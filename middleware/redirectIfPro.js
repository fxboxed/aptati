/**
 * =========================================================================
 * PRO REDIRECT GATEKEEPER MIDDLEWARE (middleware/redirectIfPro.js)
 * =========================================================================
 */

export default function redirectIfPro(req, res, next) {
    // If there is no logged-in session, the visitor is completely anonymous.
    // Let them pass straight through to play the 4 free games.
    if (!req.user) {
        return next();
    }

    // If they are logged in and their database account status has isPro marked true,
    // intercept their request and instantly fling them over to the premium subdomain.
    if (req.user.isPro === true) {
        return res.redirect('http://pro.aptati.com');
    }

    // If logged in but not a Pro account, let them browse the free site.
    next();
}