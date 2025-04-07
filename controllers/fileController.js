const { upload } = require("./multer");
const db = require("../prisma/prisma");

exports.uploadFile = [
  upload.single("uploadedFile"),
  async (req, res) => {
    const fileName = req.file.originalname;
    const folderId = parseInt(req.query.folderId);
    await db.file.create({
      data: {
        name: fileName,
        folderId: folderId,
      },
    });
    res.redirect(`/folders/${folderId}`);
  },
];
