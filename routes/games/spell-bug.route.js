import express from 'express';
const router = express.Router();

router.get('/games/spell-bug', (req, res) => {
  res.render('games/spell-bug', {title: 'Spell Bug',restart: 'sb-restart-btn', newGame: 'sb-new-game-btn', answers: 'sb-answers-btn', dropdown: 'sb-dropdown', shuffle: 'sb-shuffle-btn', clear: 'sb-clear-btn', submit: 'sb-submit-btn', currentPage: 'Spell Bug', wordList: 'sb-word-list', gameMessage: 'sb-Message Placeholder'});
});

export default router;