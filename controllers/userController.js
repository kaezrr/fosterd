const passport = require("./passport");
const { checkUserAuthentication } = require("./utils");
const { body, validationResult } = require("express-validator");

const validateSignUp = [body("username"), body("password"), body("confirm")];

exports.userLogInGet = (req, res) => {
  res.render("logIn", { title: "Log in" });
};
exports.userSignUpGet = (req, res) => {
  res.render("signUp", { title: "Sign up" });
};

exports.showRoot = [
  checkUserAuthentication,
  (req, res) => res.render("files", { title: "Your Files" }),
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
