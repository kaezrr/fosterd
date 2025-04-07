const userController = require("../controllers/userController");
const { Router } = require("express");
const { setUser } = require("../controllers/utils");

const userRouter = new Router();

userRouter.use(setUser);

userRouter.get("/", userController.showRoot);
userRouter.get("/log-out", userController.userLogOut);

userRouter.get("/log-in", userController.userLogInGet);
userRouter.post("/log-in", userController.userLogInPost);

userRouter.get("/sign-up", userController.userSignUpGet);
userRouter.post("/sign-up", userController.userSignUpPost);

module.exports = userRouter;
