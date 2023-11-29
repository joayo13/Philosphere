// passport-config.js

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user'); // Adjust the path as needed
const bcrypt = require("bcryptjs")
passport.use(new LocalStrategy(
  { usernameField: 'username' }, // Adjust if your username field is different
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;