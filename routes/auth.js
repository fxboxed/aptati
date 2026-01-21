// routes/auth.js
import express from 'express';
import passport from 'passport';
const router = express.Router();

// Google OAuth initiation
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/'
  }),
  (req, res) => {
    // Successful authentication
    res.redirect('/dashboard');
  }
);

// Logout - POST method to prevent accidental logout via GET
router.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    
    // Destroy the session
    req.session.destroy(function(err) {
      if (err) {
        console.error('Session destruction error:', err);
      }
      // Clear the session cookie
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

// Also support GET for compatibility, but use POST in production
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { 
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    
    // Destroy the session
    req.session.destroy(function(err) {
      if (err) {
        console.error('Session destruction error:', err);
      }
      // Clear the session cookie
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

export default router;