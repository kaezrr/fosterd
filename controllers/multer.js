const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => cb(null, file.originalname),
});

exports.upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
});
