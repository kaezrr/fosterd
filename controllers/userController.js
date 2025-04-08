const passport = require("./passport");
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
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be 8-20 characters"),
  body("confirm")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Confirm password doesn't match"),
];

exports.userLogInGet = (req, res) => {
  const errors = req.flash("error").map((msg) => ({ msg }));
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

exports.showRoot = async (req, res) => {
  const errors = req.flash("error").map((msg) => ({ msg }));
  const folders = await db.folder.findMany({
    where: { userId: req.user.id },
    include: { files: true },
  });
  res.render("index", { title: "Home", errors, folders });
};

exports.userLogOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/log-in");
  });
};

exports.userLogInPost = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.flash("error", info.message);
      return req.session.save(() => res.redirect("/log-in"));
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
};
