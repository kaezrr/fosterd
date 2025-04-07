const { checkUserAuthentication, checkCorrectUserFolder } = require("./utils");
const { body, query, validationResult } = require("express-validator");
const db = require("../prisma/prisma");

const validateCreateFolder = [
  body("folderName")
    .isLength({ min: 1, max: 16 })
    .withMessage("Folder name has to be 1-16 characters.")
    .custom(async (value) => {
      const exists = await db.folder.findUnique({ where: { name: value } });
      if (exists) throw new Error("Folder name already exists!");
      return true;
    }),
];

const validateUpdateFolder = [
  query("newName").custom(async (value) => {
    const exists = await db.folder.findUnique({ where: { name: value } });
    if (exists) throw new Error("Folder name already exists!");
    return true;
  }),
];

exports.createFolder = [
  checkUserAuthentication,
  validateCreateFolder,
  async (req, res) => {
    const errors = validationResult(req);
    const errorString = errors
      .array()
      .map((err) => `errors=${encodeURIComponent(err.msg)}`)
      .join("&");

    if (!errors.isEmpty()) {
      return res.redirect("/?" + errorString);
    }

    await db.folder.create({
      data: {
        name: req.body.folderName,
        userId: req.user.id,
      },
    });
    res.redirect("/");
  },
];

exports.deleteFolder = [
  checkUserAuthentication,
  checkCorrectUserFolder,
  async (req, res) => {
    await db.folder.delete({
      where: { id: parseInt(req.query.id) },
    });
    res.redirect("/");
  },
];

exports.editFolder = [
  validateUpdateFolder,
  checkUserAuthentication,
  checkCorrectUserFolder,
  async (req, res) => {
    const errors = validationResult(req);
    const errorString = errors
      .array()
      .map((err) => `errors=${encodeURIComponent(err.msg)}`)
      .join("&");

    if (!errors.isEmpty()) {
      return res.redirect("/?" + errorString);
    }
    await db.folder.update({
      where: { id: parseInt(req.query.id) },
      data: {
        name: req.query.newName,
      },
    });
    res.redirect("/");
  },
];
