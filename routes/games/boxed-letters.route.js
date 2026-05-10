import express from 'express';
const router = express.Router();

router.get('/games/boxed-letters', (req, res) => {
  res.render('games/boxed-letters', {title: 'Boxed Letters',restart: 'bl-restart-btn', newGame: 'bl-new-game-btn', answers: 'bl-answers-btn', dropdown: 'bl-dropdown', shuffle: 'bl-shuffle-btn', clear: 'bl-clear-btn', submit: 'bl-submit-btn', currentPage: 'Boxed Letters', gameMessage: 'bl-Message Placeholder'});
});

export default router;
