// routes/dashboard.js
import express from 'express';
import User from '../models/User.js';

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
router.get('/', ensureAuthenticated, async (req, res) => {
  // Normalize the email for comparison
  const userEmail = req.user.email.toLowerCase().trim();
  
  if (userEmail === ADMIN_EMAIL) {
    try {
      // Fetch all users from database
      const allUsers = await User.find({})
        .select('email name')
        .sort({ createdAt: -1 })
        .lean();

      // Render the admin dashboard with user list
      return res.render('admin/control-panel', {
        title: 'Admin Control Panel',
        currentPage: 'admin',
        user: req.user,
        users: allUsers
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      return res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load admin panel'
      });
    }
  }
  
  // Regular user dashboard
  res.render('dashboard', {
    title: 'Dashboard',
    currentPage: 'dashboard',
    user: req.user
  });
});

export default router;