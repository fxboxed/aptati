import express from 'express';
const router = express.Router();

router.get('/games/word-groups', (req, res) => {
  res.render('games/word-groups', {title: 'Word Groups',restart: 'wg-restart-btn', newGame: 'wg-new-game-btn', answers: 'wg-answers-btn', dropdown: 'wg-dropdown', shuffle: 'wg-shuffle-btn', clear: 'wg-clear-btn', submit: 'wg-submit-btn', currentPage: 'Word Groups'});
});

export default router;