import express from 'express';
const router = express.Router();

router.get('/games/letter-link', (req, res) => {
  res.render('games/letter-link', {title: 'Letter Link',restart: 'll-restart-btn', newGame: 'll-new-game-btn', answers: 'll-answers-btn', dropdown: 'll-dropdown', shuffle: 'll-shuffle-btn', clear: 'll-clear-btn', submit: 'll-submit-btn', currentPage: 'Letter Link', gameMessage: 'll-Message Placeholder'});
});

export default router;
