require("dotenv").config();
const db = require("../prisma/prisma");
const { supabase } = require("./multer");
const { body, validationResult } = require("express-validator");
const { v4: uuid4 } = require("uuid");
const { format, formatDistanceToNow } = require("date-fns");
const { getFormatSize } = require("./folderController");

const allowedDurations = [
  3600000, // 1 hour
  21600000, // 6 hours
  86400000, // 1 day
  259200000, // 3 days
  604800000, // 7 days
];

exports.createShareLinkGet = async (req, res) => {
  const folder = await db.folder.findUnique({
    where: { id: parseInt(req.params.id, 10) },
  });
  res.render("shareForm", { title: "Share Folder", folder });
};

exports.createShareLinkPost = [
  body("validFor")
    .trim()
    .isInt()
    .withMessage("Duration must be a number, you cheeky bastard!")
    .custom((val) => allowedDurations.includes(parseInt(val)))
    .withMessage("Invalid duration time."),
  async (req, res) => {
    const errors = validationResult(req);
    const folderId = parseInt(req.params.id, 10);
    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!errors.isEmpty()) {
      return res.render("shareForm", {
        title: "Share Folder",
        folder,
        errors: errors.array(),
      });
    }

    const validFor = parseInt(req.body.validFor, 10);
    const expiresAt = new Date(Date.now() + validFor);

    const uurl = uuid4();
    await db.shareLink.create({
      data: { url: uurl, folderId, expiresAt },
    });

    const rootUrl = process.env.APP_BASE_URL || "http://localhost:3000";
    res.render("shareForm", {
      title: "Share Folder",
      folder,
      shareUrl: `${rootUrl}/share/${uurl}`,
    });
  },
];

exports.showShareLink = async (req, res) => {
  const { url } = req.params;
  const shareLink = await db.shareLink.findUnique({
    where: { url: url },
    include: { folder: { include: { files: true, user: true } } },
  });

  if (!shareLink || new Date(shareLink.expiresAt) < new Date()) {
    return res.status(404).send("This link is invalid or has expired.");
  }

  const data = await Promise.all(
    shareLink.folder.files.map((file) =>
      supabase.storage
        .from("files")
        .createSignedUrl(file.storedName, 60, { download: file.originalName }),
    ),
  );

  shareLink.folder.files = shareLink.folder.files.map((file) => ({
    ...file,
    formattedDate: format(file.uploadTime, "dd MMM yy"),
    formattedSize: getFormatSize(file.size),
  }));

  const download = data.map((d) => d.data.signedUrl);
  res.render("shareFolder", {
    title: "View Shared Folder",
    user: shareLink.folder.user,
    folder: shareLink.folder,
    download: download,
    expires: formatDistanceToNow(new Date(shareLink.expiresAt), {
      addSuffix: true,
    }),
  });
};
