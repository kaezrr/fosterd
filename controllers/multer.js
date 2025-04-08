require("dotenv").config();
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");

const { SUPABASE_KEY, PROJECT_URL } = process.env;

exports.upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 1024 * 1024 * 50 },
});

exports.supabase = createClient(PROJECT_URL, SUPABASE_KEY);
