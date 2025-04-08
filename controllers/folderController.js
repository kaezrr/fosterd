const { body, query, validationResult } = require("express-validator");
const db = require("../prisma/prisma");
const { format } = require("date-fns");
const { supabase } = require("./multer");

const validateCreateFolder = [
  body("folderName")
    .isLength({ min: 1, max: 16 })
    .withMessage("Folder name has to be 1-16 characters."),
];

const validateUpdateFolder = [
  query("newName")
    .isLength({ min: 1, max: 16 })
    .withMessage("Folder name has to be 1-16 characters."),
];

exports.createFolder = [
  validateCreateFolder,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "error",
        errors.array().map((e) => e.msg),
      );
      return req.session.save(() => res.redirect("/"));
    }

    await db.folder.create({
      data: {
        name: req.body.folderName,
        userId: req.user.id,
      },
    });
    res.redirect("/");
  },
];

exports.deleteFolder = async (req, res) => {
  const folder = await db.folder.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { files: true },
  });

  if (folder.files.length > 0) {
    const { data, error } = await supabase.storage
      .from("files")
      .remove(folder.files.map((f) => f.storedName));

    if (error) {
      return res.status(500).send(error.message);
    }
  }

  await db.folder.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.redirect("/");
};

exports.editFolder = [
  validateUpdateFolder,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash(
        "error",
        errors.array().map((e) => e.msg),
      );
      return req.session.save(() => res.redirect("/"));
    }
    await db.folder.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.query.newName,
      },
    });
    res.redirect("/");
  },
];

function getFormatSize(size) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"];
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    ++i;
  }
  return `${size.toFixed(1)}${units[i]}`;
}

exports.viewFolder = async (req, res) => {
  const errors = req.flash("error").map((msg) => ({ msg }));
  const folder = await db.folder.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { files: true },
  });

  folder.files = folder.files.map((file) => ({
    ...file,
    formattedDate: format(file.uploadTime, "dd MMM yy"),
    formattedSize: getFormatSize(file.size),
  }));

  res.render("folder", { title: folder.name, folder, errors });
};
