const fileController = require("../controllers/fileController");
const {
  checkUserAuthentication,
  checkCorrectUserFile,
} = require("../controllers/utils");

const fileRouter = require("express").Router();
fileRouter.use(checkUserAuthentication);

fileRouter.post("/new", fileController.uploadFile);

module.exports = fileRouter;
