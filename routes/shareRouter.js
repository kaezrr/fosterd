const shareController = require("../controllers/shareController");
const shareRouter = require("express").Router();
const {
  checkCorrectUserFolder,
  checkUserAuthentication,
} = require("../controllers/utils");

shareRouter.get(
  "/create/:id",
  checkUserAuthentication,
  checkCorrectUserFolder,
  shareController.createShareLinkGet,
);

shareRouter.post(
  "/create/:id",
  checkUserAuthentication,
  checkCorrectUserFolder,
  shareController.createShareLinkPost,
);

shareRouter.get("/:url", shareController.showShareLink);

module.exports = shareRouter;
