const { upload } = require("./multer");
const db = require("../prisma/prisma");
const { MulterError } = require("multer");

exports.uploadFile = [
  (req, res, next) => {
    upload.single("uploadedFile")(req, res, (err) => {
      console.log(err);
      console.log(req.query);
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
    await db.file.create({
      data: {
        originalName: req.file.originalname,
        storedName: req.file.filename,
        size: req.file.size,
        uploadTime: new Date(),
        folderId: folderId,
      },
    });
    res.redirect(`/folders/${folderId}`);
  },
];

exports.deleteFile = async (req, res) => {
  const folderId = parseInt(req.query.folderId);
  await db.file.delete({ where: { id: parseInt(req.params.id) } });
  res.redirect(`/folders/${folderId}`);
};
