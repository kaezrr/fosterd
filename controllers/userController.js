const passport = require("./passport");
const { checkUserAuthentication } = require("./utils");
const { body, validationResult } = require("express-validator");
const db = require("../prisma/prisma");
const bcrypt = require("bcryptjs");

const validateSignUp = [
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric.")
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be 3-20 characters.")
    .custom(async (value) => {
      const exists = await db.user.findFirst({
        where: { username: value },
      });
      if (exists) throw new Error("Username already exists.");
      return true;
    }),
  body("password")
    .isLength({ min: 1, max: 20 })
    .withMessage("Password must be 8-20 characters"),
  body("confirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm password doesn't match"),
];

exports.userLogInGet = (req, res) => {
  let errors = null;
  if (req.session.messages) {
    errors = req.session.messages.map((error) => ({ msg: error }));
    delete req.session.messages;
  }
  res.render("logIn", { title: "Log in", errors });
};

exports.userSignUpGet = (req, res) => {
  res.render("signUp", { title: "Sign up" });
};

exports.userSignUpPost = [
  validateSignUp,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("signUp", { title: "Sign up", errors: errors.array() });
    }
    const { username, password } = req.body;
    await db.user.create({
      data: {
        username,
        password: await bcrypt.hash(password, 10),
      },
    });
    res.redirect("/log-in");
  },
];

exports.showRoot = [
  checkUserAuthentication,
  (req, res) => res.render("index", { title: "Your Files" }),
];

exports.userLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/log-in");
  });
};

exports.userLogInPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureMessage: true,
});
