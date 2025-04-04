const userController = require("../controllers/userController");
const { Router } = require("express");

const userRouter = new Router();

userRouter.get("/", userController.showRoot);
userRouter.get("/log-out", userController.userLogOut);

userRouter.get("/log-in", userController.userLogInGet);
userRouter.post("/log-in", userController.userLogInPost);

userRouter.get("/sign-up", userController.userSignUpGet);
// userRouter.post("/sign-up", userController.userSignUpPost);

module.exports = userRouter;
