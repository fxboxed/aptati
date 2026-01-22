import express from 'express';
const router = express.Router();


// Games list
router.get('/', (req, res) => {
  res.render('games', {
    title: 'Aptati Games Collection',
    subtitle: 'The complete list of Aptati daily challenges',
    user: req.user || null
  });
});




export default router;