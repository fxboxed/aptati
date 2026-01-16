import express from 'express';
const router = express.Router();

// Middleware to check if user is authenticated (placeholder)
const requireAuth = (req, res, next) => {
  // For now, allow access - we'll implement real auth later
  next();
};

// User dashboard
router.get('/', requireAuth, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user || { displayName: 'Guest' }
  });
});

// User profile
router.get('/profile', requireAuth, (req, res) => {
  res.render('dashboard/profile', {
    title: 'Profile',
    user: req.user || { displayName: 'Guest' }
  });
});

// Game history
router.get('/history', requireAuth, (req, res) => {
  res.render('dashboard/history', {
    title: 'Game History',
    user: req.user || { displayName: 'Guest' }
  });
});

export default router;