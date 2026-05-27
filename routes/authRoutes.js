/**
 * =========================================================================
 * AUTHENTICATION & SUBDOMAIN ROUTING (routes/authRoutes.js)
 * =========================================================================
 */

import express from 'express';
import passport from 'passport';

const router = express.Router();

/**
 * 1. TRIGGER ROUTE: aptati.com/auth/google
 * Point your "Go Pro" or "Log In" buttons to this URL.
 */
router.get('/auth/google', passport.authenticate('google', { 
    scope: ['profile', 'email'] 
}));

/**
 * 2. CALLBACK ROUTE: aptati.com/auth/google/callback
 * Google sends users back here with their secure authentication token.
 */
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }), 
    (req, res) => {
        // Successful login achieved! Check if their record is a Pro account.
        if (req.user.isPro === true) {
            // LOCAL TESTING GUARD: If running locally, don't break out to the live web
            if (process.env.GOOGLE_CALLBACK_URL && process.env.GOOGLE_CALLBACK_URL.includes('localhost')) {
                console.log('👑 Pro account authenticated successfully in local testing environment.');
                return res.redirect('/#pro-dashboard-local');
            }
            
            // Production route deployment path
            return res.redirect('http://pro.aptati.com');
        } else {
            // Logged in but hasn't upgraded to Pro yet. Send to a checkout landing page notice.
            return res.redirect('/#upgrade-notice');
        }
    }
);

/**
 * 3. LOGOUT ROUTE: aptati.com/auth/logout
 * Clears out their secure cookie session completely.
 */
router.get('/auth/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

export default router;