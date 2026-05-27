/**
 * =========================================================================
 * PRO SUBSCRIPTION DASHBOARD ROUTER (routes/dashboard.route.js)
 * =========================================================================
 */
import express from 'express';
import { ensureAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    // 1. SECURITY SECURITY: Validate account clearance parameters
    if (!req.user || req.user.isPro !== true) {
        console.warn(`🔒 ACCESS DENIED: Non-Pro user ${req.user?.email || 'Unknown'} blocked from dashboard.`);
        return res.redirect('/#upgrade-notice');
    }

    // 2. DYNAMIC BASE URL CALCULATION:
    // Determines if the user is testing locally or running live on production.
    const isLocal = req.headers.host.includes('localhost');
    const mainDomain = isLocal ? 'http://localhost:3000' : 'https://aptati.com';

    // 3. ABSOLUTE LOGOUT METHODOLOGY:
    // Forces the dashboard view template to explicitly link back to the main domain 
    // to clear cookies, bypassing potential cross-subdomain link breakage.
    const absoluteLogoutUrl = `${mainDomain}/auth/logout`;

    // 4. RENDER DASHBOARD VIEW ENVIRONMENT
    // Passes the profile data and the specific absolute logout anchor down to the template
    res.render('dashboard', { 
        user: req.user,
        logoutUrl: absoluteLogoutUrl
    });
});

export default router;