const fileController = require("../controllers/fileController");
const {
  checkUserAuthentication,
  checkCorrectUserFile,
} = require("../controllers/utils");

const fileRouter = require("express").Router();
fileRouter.use(checkUserAuthentication);

fileRouter.post("/new", fileController.uploadFile);
fileRouter.get("/:id/delete", checkCorrectUserFile, fileController.deleteFile);
fileRouter.get(
  "/:id/download",
  checkCorrectUserFile,
  fileController.downloadFile,
);

module.exports = fileRouter;
