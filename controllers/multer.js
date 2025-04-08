const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const storedName = uuidv4() + path.extname(file.originalname);
    cb(null, storedName);
  },
});

exports.upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 50 },
});
