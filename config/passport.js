/**
 * =========================================================================
 * PASSPORT GOOGLE OAUTH STRATEGY CONFIGURATION (config/passport.js)
 * =========================================================================
 */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import mongoose from 'mongoose';

// Minimalist User Schema initialization for user verification
const UserSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Serialize user into the active login session cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user out of the active cookie session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Configure Google Passport Interceptor
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback'
},
async (accessToken, refreshToken, profile, done) => {
    const emailAddress = profile.emails[0].value;
    
    try {
        // Query to see if this user profile already exists inside MongoDB
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            return done(null, user);
        }
        
        // If profile doesn't exist, generate a brand new player profile document
        user = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: emailAddress,
            avatar: profile.photos[0]?.value || ''
        });
        
        return done(null, user);
    } catch (err) {
        console.error('❌ OAuth profile database ingestion failure:', err);
        return done(err, null);
    }
}));