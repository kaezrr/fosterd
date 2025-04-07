const db = require("../prisma/prisma");

exports.setUser = (req, res, next) => {
  res.locals.user = req.user;
  next();
};

exports.checkUserAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
};

exports.checkCorrectUserFolder = async (req, res, next) => {
  const folder = await db.folder.findUnique({
    where: { id: parseInt(req.params.id) },
  });

  if (!folder) {
    return res.status(404).send("Folder not found!");
  }

  if (folder.userId === req.user.id) {
    return next();
  }
  return res.status(403).send("Unauthorized action!");
};

exports.checkCorrectUserFile = async (req, res, next) => {
  const file = await db.file.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { folder: true },
  });

  if (!file) {
    return res.status(404).send("File not found!");
  }

  if (file.folder.userId === req.user.id) {
    return next();
  }
  return res.status(403).send("Unauthorized action!");
};
