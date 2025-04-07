const { checkUserAuthentication, checkCorrectUserFolder } = require("./utils");
const { body, validationResult } = require("express-validator");
const db = require("../prisma/prisma");

const validateResult = [
  body("folderName")
    .isLength({ min: 1, max: 16 })
    .withMessage("Folder name has to be 1-16 characters.")
    .custom(async (value) => {
      const exists = await db.folder.findUnique({ where: { name: value } });
      if (exists) throw new Error("Folder name already exists!");
      return true;
    }),
];

exports.createFolder = [
  checkUserAuthentication,
  validateResult,
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
    const { id } = req.query;
    await db.folder.delete({
      where: { id: parseInt(id) },
    });
    res.redirect("/");
  },
];
