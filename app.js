require("dotenv").config();
const express = require("express");
const session = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const db = require("./prisma/prisma");
const passport = require("./controllers/passport");
const userRouter = require("./routes/userRouter");
const expressLayouts = require("express-ejs-layouts");

const App = express();
App.set("view engine", "ejs");
App.use(express.static("public"));
App.use(expressLayouts);
App.set("layout", "layout");

App.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, //ms
    },
    secret: process.env.COOKIE_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new PrismaSessionStore(db, {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  }),
);
App.use(passport.session());
App.use(express.urlencoded({ extended: false }));
App.use("/", userRouter);

const PORT = process.env.PORT || 3000;
App.listen(PORT, () => console.log(`App running on port ${PORT}`));
