const { Router } = require("express");
const folderController = require("../controllers/folderController");

const folderRouter = new Router();

folderRouter.post("/new-folder", folderController.createFolder);
folderRouter.get("/delete-folder", folderController.deleteFolder);
folderRouter.get("/edit-folder", folderController.editFolder);

module.exports = folderRouter;
