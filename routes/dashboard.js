// routes/dashboard.js
import express from 'express';
const router = express.Router();

// Hardcoded admin email
const ADMIN_EMAIL = 'dfg@boxedfx.com';

// Ensure user is authenticated middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/google');
};

// Dashboard route
router.get('/', ensureAuthenticated, (req, res) => {
  // Normalize the email for comparison
  const userEmail = req.user.email.toLowerCase().trim();
  
  if (userEmail === ADMIN_EMAIL) {
    // Render the admin dashboard
    return res.render('admin/control-panel', {
      title: 'Admin Control Panel',
      currentPage: 'admin',
      user: req.user
    });
  }
  
  // Regular user dashboard
  res.render('dashboard', {
    title: 'Dashboard',
    currentPage: 'dashboard',
    user: req.user
  });
});

export default router;