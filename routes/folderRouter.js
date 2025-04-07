const { Router } = require("express");
const folderController = require("../controllers/folderController");

const folderRouter = new Router();

folderRouter.post("/new-folder", folderController.createFolder);
folderRouter.get("/delete-folder", folderController.deleteFolder);

module.exports = folderRouter;
