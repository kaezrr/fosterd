const fileController = require("../controllers/fileController");
const {
  checkUserAuthentication,
  checkCorrectUserFile,
} = require("../controllers/utils");

const fileRouter = require("express").Router();
fileRouter.use(checkUserAuthentication);

fileRouter.post("/new", fileController.uploadFile);
fileRouter.get("/:id/delete", checkCorrectUserFile);
fileRouter.get("/:id/edit", checkCorrectUserFile);
fileRouter.get("/:id/download", checkCorrectUserFile);

module.exports = fileRouter;
