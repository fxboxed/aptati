/**
 * =========================================================================
 * USER DATA MODEL (models/User.js) — ES MODULE VERSION
 * =========================================================================
 * This file defines the blueprint (Schema) for user profiles inside MongoDB.
 * * * IMPORTANT ARCHITECTURAL NOTE: 
 * Free users on aptati.com play completely anonymously and will NEVER have 
 * records created here. This file is strictly used to store data for users 
 * who explicitly register or log in via Google OAuth to access Pro features.
 */

// Import the Mongoose library using modern ES Module import syntax.
// (Because mongoose is an external npm package, we don't need a file extension here).
import mongoose from 'mongoose';

// Define the blueprint schema for a registered user account
const UserSchema = new mongoose.Schema({
    // The unique, permanent ID code supplied by Google when the user authenticates.
    // This allows us to recognize them instantly the next time they click login.
    googleId: {
        type: String,
        required: true,
        unique: true // Guarantees that no two profiles share the same Google ID
    },
    
    // The user's primary email address fetched securely from their Google Profile.
    email: {
        type: String,
        required: true,
        unique: true,      // Ensures an email can only be registered once
        lowercase: true,   // Automatically drops input to lowercase to prevent duplicates via typos
        trim: true         // Strips out accidental blank spaces at the beginning or end
    },
    
    // The public display name of the user (e.g., "Alex Smith") taken from Google.
    displayName: {
        type: String,
        required: true
    },
    
    // The URL link to the user's Google profile picture/avatar.
    avatarUrl: {
        type: String
    },
    
    /**
     * THE SUBDOMAIN REDIRECT TRIGGER
     * This field controls whether the user is authorized to use the Pro site.
     * * * How it works:
     * - When a user registers, your system will determine if they have paid/subscribed.
     * - If 'isPro' is true, our middleware on aptati.com catches them and boots them 
     * straight to pro.aptati.com.
     * - If 'isPro' is false, they are denied access to the subdomain.
     */
    isPro: {
        type: Boolean,
        default: false // Defaults to false until their subscription is confirmed/activated
    },
    
    // Automatically logs the exact timestamp when this user profile was first created
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compile the schema blueprint into a working Mongoose model and export it.
// We use 'export default' instead of 'module.exports' to align with type: "module".
const User = mongoose.model('User', UserSchema);
export default User;