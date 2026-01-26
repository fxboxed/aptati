import express from 'express';
const router = express.Router();


// Games list
router.get('/', (req, res) => {
  res.render('games', {
    title: 'Aptati Games Collection',
    subtitle: 'The complete list of Aptati daily challenges',
    currentPage: 'games',
    user: req.user || null
  });
});

router.get('/the-word', (req, res) => {
  res.render('games/the-word', {
    title: 'The Word Game',
    subtitle: 'Test your vocabulary skills!',
    currentPage: 'the-word',
    user: req.user || null
  });
});


export default router;