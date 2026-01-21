// config/passport.js
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';

// Create User model if it doesn't exist
const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  profilePicture: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://aptati.com/auth/google/callback'
        : 'http://localhost:3001/auth/google/callback'),
    scope: ['profile', 'email']
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ googleId: profile.id });
      
      if (!user) {
        // Create new user
        user = new User({
          googleId: profile.id,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          profilePicture: profile.photos[0].value
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;