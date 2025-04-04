exports.setUser = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

exports.checkUserAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/log-in");
  }
};
