/**
 * =========================================================================
 * LETTER LINK GAME ROUTE (routes/games/letter-link.route.js)
 * =========================================================================
 */
import express from 'express';
// CRITICAL FIX: Add this import line right here to define redirectIfPro
import redirectIfPro from '../../middleware/redirectIfPro.js';

const router = express.Router();

// Now that it's imported at the top, Node won't panic when it reads this line
router.get('/games/letter-link', redirectIfPro, (req, res) => {
  res.render('games/letter-link', {
    title: 'Letter Link',
    restart: 'll-restart-btn', 
    newGame: 'll-new-game-btn', 
    answers: 'll-answers-btn', 
    dropdown: 'll-dropdown', 
    shuffle: 'll-shuffle-btn', 
    clear: 'll-clear-btn', 
    submit: 'll-submit-btn', 
    currentPage: 'Letter Link', 
    gameMessage: 'll-Message Placeholder'
  });
});

export default router;