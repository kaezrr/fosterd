const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../prisma/prisma");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await db.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      return done(null, false, { message: "Username does not exist!" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return done(null, false, { message: "Password does not match!" });
    }

    return done(null, user);
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await db.user.findUnique({
    where: {
      id: id,
    },
  });

  done(null, user);
});

module.exports = passport;
