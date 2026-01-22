import express from 'express';
const router = express.Router();

// Home page
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Aptati Games Hub',
    subtitle: 'Daily challenges for your pleasure',
    currentPage: 'home',  // This should be 'home'
    user: req.user || null
  });
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About',
    user: req.user || null
  });
});

// Leaderboard (public)
router.get('/leaderboard', (req, res) => {
  res.render('leaderboard', {
    title: 'Leaderboard',
    user: req.user || null
  });
});



export default router;