const { upload, supabase } = require("./multer");
const db = require("../prisma/prisma");
const path = require("path");
const { MulterError } = require("multer");
const { v4: uuid4 } = require("uuid");

exports.uploadFile = [
  (req, res, next) => {
    upload.single("uploadedFile")(req, res, (err) => {
      const folderId = parseInt(req.query.folderId);
      if (err instanceof MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.redirect(
            `/folders/${folderId}?errors=${encodeURIComponent("File too large! Max size is 50MB")}`,
          );
        }
        return res.redirect(
          `/folders/${folderId}?errors=${encodeURIComponent(`Multer error: ${err.message}`)}`,
        );
      } else if (err) {
        return res.redirect(
          `/folders/${folderId}?errors=${encodeURIComponent(`Unexpected error: ${err.message}`)}`,
        );
      }
      next();
    });
  },
  async (req, res) => {
    const folderId = parseInt(req.query.folderId);
    if (!req.file) {
      req.flash("error", "Cannot upload empty files!");
      return req.session.save(() => res.redirect(`/folders/${folderId}`));
    }
    const { originalname, size, buffer, mimetype } = req.file;
    const storedName = uuid4() + path.extname(originalname);

    const { data, error } = await supabase.storage
      .from("files")
      .upload(storedName, buffer, {
        contentType: mimetype,
        upsert: true,
      });

    if (error) {
      return res.status(500).send(error.message);
    }

    await db.file.create({
      data: {
        originalName: originalname,
        storedName: storedName,
        size: size,
        uploadTime: new Date(),
        folderId: folderId,
      },
    });

    res.redirect(`/folders/${folderId}`);
  },
];

exports.deleteFile = async (req, res) => {
  const file = await db.file.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  const { data, error } = await supabase.storage
    .from("files")
    .remove([file.storedName]);

  if (error) {
    return res.status(500).send(error.message);
  }

  const folderId = parseInt(req.query.folderId);
  await db.file.delete({ where: { id: parseInt(req.params.id) } });
  res.redirect(`/folders/${folderId}`);
};

exports.downloadFile = async (req, res) => {
  const file = await db.file.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  const { data, error } = await supabase.storage
    .from("files")
    .createSignedUrl(file.storedName, 60, {
      download: file.originalName,
    });

  if (error) {
    return res.status(500).send(error.message);
  }

  res.redirect(data.signedUrl);
};
