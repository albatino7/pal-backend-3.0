import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    // Runs AFTER Passport exchanged the code and fetched the profile
    async (accessToken, refreshToken, profile, done) => {
      try {
        return done(null, profile);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

export default passport;
