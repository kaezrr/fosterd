const fileController = require("../controllers/fileController");
const { checkUserAuthentication } = require("../controllers/utils");

const fileRouter = require("express").Router();
fileRouter.use(checkUserAuthentication);

module.exports = fileRouter;
