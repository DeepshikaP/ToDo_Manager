// server/config/passportConfig.js

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Make sure this points to your actual User model

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let existingUser = await User.findOne({ googleId: profile.id });

    if (!existingUser) {
      existingUser = await User.create({
        googleId: profile.id,
        email: profile.emails?.[0]?.value || '',
        name: profile.displayName
      });
    }

    return done(null, existingUser);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
