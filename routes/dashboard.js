// import express from 'express';
// const router = express.Router();

// // Middleware to check if user is authenticated
// const requireAuth = (req, res, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/auth');
// };

// // Protected dashboard routes
// router.get('/', requireAuth, (req, res) => {
//   res.render('dashboard/index', {
//     title: 'Dashboard',
//     user: req.user
//   });
// });

// router.get('/profile', requireAuth, (req, res) => {
//   res.render('dashboard/profile', {
//     title: 'Profile',
//     user: req.user
//   });
// });

// router.get('/history', requireAuth, (req, res) => {
//   res.render('dashboard/history', {
//     title: 'Game History',
//     user: req.user
//   });
// });

// export default router;
// routes/dashboard.js
import express from 'express';
const router = express.Router();

// Ensure user is authenticated middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth');
};

// Dashboard route
router.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    currentPage: 'dashboard',
    user: req.user
  });
});

export default router;