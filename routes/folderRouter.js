const folderController = require("../controllers/folderController");
const {
  checkUserAuthentication,
  checkCorrectUserFolder,
} = require("../controllers/utils");

const folderRouter = require("express").Router();

folderRouter.use(checkUserAuthentication);

folderRouter.post("/new", folderController.createFolder);
folderRouter.get("/:id", checkCorrectUserFolder, folderController.viewFolder);
folderRouter.get(
  "/:id/edit",
  checkCorrectUserFolder,
  folderController.editFolder,
);
folderRouter.get(
  "/:id/delete",
  checkCorrectUserFolder,
  folderController.deleteFolder,
);

module.exports = folderRouter;
