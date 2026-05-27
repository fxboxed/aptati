/**
 * =========================================================================
 * SPELL BUG GAME ROUTE (routes/games/spell-bug.route.js)
 * =========================================================================
 */
import express from 'express';
// Import the gatekeeper middleware with the mandatory .js extension
import redirectIfPro from '../../middleware/redirectIfPro.js';

const router = express.Router();

// Inject the redirectIfPro middleware directly into the route path
router.get('/games/spell-bug', redirectIfPro, (req, res) => {
  res.render('games/spell-bug', {
    title: 'Spell Bug',
    restart: 'sb-restart-btn', 
    newGame: 'sb-new-game-btn', 
    answers: 'sb-answers-btn', 
    dropdown: 'sb-dropdown', 
    shuffle: 'sb-shuffle-btn', 
    clear: 'sb-clear-btn', 
    submit: 'sb-submit-btn', 
    currentPage: 'Spell Bug', 
    wordList: 'sb-word-list', 
    gameMessage: 'sb-Message Placeholder'
  });
});

export default router;