const userController = require("../controllers/userController");
const { setUser, checkUserAuthentication } = require("../controllers/utils");

const userRouter = require("express").Router();

userRouter.use(setUser);

userRouter.get("/", checkUserAuthentication, userController.showRoot);
userRouter.get("/log-out", userController.userLogOut);

userRouter.get("/log-in", userController.userLogInGet);
userRouter.post("/log-in", userController.userLogInPost);

userRouter.get("/sign-up", userController.userSignUpGet);
userRouter.post("/sign-up", userController.userSignUpPost);

module.exports = userRouter;
