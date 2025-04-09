const db = require("../prisma/prisma");
const { supabase } = require("./multer");

exports.createShareLinkGet = async (req, res) => {
  const folder = await db.folder.findUnique({
    where: { id: parseInt(req.params.id) },
  });
  res.render("shareForm", { title: "Share Folder", folder });
};

exports.createShareLinkPost = (req, res) => {};

exports.showShareLink = (req, res) => {};
