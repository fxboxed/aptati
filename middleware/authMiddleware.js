/**
 * =========================================================================
 * AUTHENTICATION ENFORCEMENT MIDDLEWARE (middleware/authMiddleware.js)
 * =========================================================================
 */

/**
 * Express middleware to protect secure routes.
 * Ensures the requesting client has an active Passport session.
 */
export const ensureAuthenticated = (req, res, next) => {
    // 1. PASSPORT SESSION CHECK
    // Passport automatically adds the isAuthenticated() helper method to the request object
    if (req.isAuthenticated()) {
        return next(); // User is logged in. Proceed cleanly to the controller route!
    }

    // 2. DYNAMIC REDIRECT TARGET
    // If the user is unauthenticated, determine where to send them back based on environment.
    const isLocal = req.headers.host.includes('localhost');
    const mainDomain = isLocal ? 'http://localhost:3000' : 'https://aptati.com';

    console.warn(`🔒 UNAUTHORIZED ATTEMPT: Intercepted request to secure path. Redirecting to auth gateway.`);
    
    // 3. FORCE ABSOLUTE REDIRECT
    // Bounces them out to the root landing page/login anchor, clearing them from the subdomain view
    return res.redirect(`${mainDomain}/#login-required`);
};