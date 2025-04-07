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

exports.deleteFolder = async (req, res) => {
  await db.folder.delete({
    where: { id: parseInt(req.params.id) },
  });
  res.redirect("/");
};

exports.editFolder = [
  validateUpdateFolder,
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
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.query.newName,
      },
    });
    res.redirect("/");
  },
];

exports.viewFolder = async (req, res) => {
  const folder = await db.folder.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { files: true },
  });
  res.render("folder", { title: "Folder View", folder });
};
