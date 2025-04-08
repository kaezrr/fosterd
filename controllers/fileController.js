const { upload } = require("./multer");
const db = require("../prisma/prisma");

exports.uploadFile = [
  upload.single("uploadedFile"),
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
