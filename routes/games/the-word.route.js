import express from 'express';
import { title } from 'node:process';
const router = express.Router();

router.get('/games/the-word', (req, res) => {
  res.render('games/the-word', {title: 'The Word',restart: 'tw-restart-btn', newGame: 'tw-new-game-btn', answers: 'tw-answers-btn', dropdown: 'tw-dropdown', shuffle: 'tw-shuffle-btn', clear: 'tw-clear-btn', submit: 'tw-submit-btn', currentPage: 'The Word', gameMessage: 'tw-Message Placeholder'}); 
});   

export default router;