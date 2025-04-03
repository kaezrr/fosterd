const express = require("express");
const session = require("express-session");
const { PrismaStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");

const App = express();
App.use("view engine", "ejs");
App.use(express.static("public"));
App.use(express.urlencoded({ extended: false }));
App.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //ms
    },
    saveUninitialized: false,
    resave: false,
    store: new PrismaStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);

const PORT = process.env.PORT || 3000;
App.listen(PORT, () => console.log(`App running on port ${PORT}`));
