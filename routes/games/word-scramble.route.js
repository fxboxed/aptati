import express from 'express';
import { title } from 'node:process';
const router = express.Router();

router.get('/games/word-scramble', (req, res) => {
  res.render('games/word-scramble', {title: 'Word Scramble',restart: 'ws-restart-btn', newGame: 'ws-new-game-btn', answers: 'ws-answers-btn', dropdown: 'ws-dropdown', shuffle: 'ws-shuffle-btn', clear: 'ws-clear-btn', submit: 'ws-submit-btn', currentPage: 'Word Scramble', gameMessage: 'ws-Message Placeholder'}); 
});   

export default router;