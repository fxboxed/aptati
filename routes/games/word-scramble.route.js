/**
 * =========================================================================
 * WORD SCRAMBLE GAME ROUTE (routes/games/word-scramble.route.js)
 * =========================================================================
 */
import express from 'express';
// IMPORT NOTE: We add the mandatory .js extension required by type: "module"
import redirectIfPro from '../../middleware/redirectIfPro.js';

const router = express.Router();

/**
 * We drop 'redirectIfPro' right between the URL path and your rendering logic.
 * * Execution Order:
 * 1. User requests '/games/word-scramble'.
 * 2. 'redirectIfPro' checks if they are logged in and if 'isPro === true'.
 * - If YES: They are intercepted and sent to http://pro.aptati.com.
 * - If NO (Anonymous or Free User): It triggers 'next()', running the block below.
 * 3. The server renders the HTML layout using your backend variables.
 */
router.get('/games/word-scramble', redirectIfPro, (req, res) => {
  res.render('games/word-scramble', {
    title: 'Word Scramble',
    restart: 'ws-restart-btn', 
    newGame: 'ws-new-game-btn', 
    answers: 'ws-answers-btn', 
    dropdown: 'ws-dropdown', 
    shuffle: 'ws-shuffle-btn', 
    clear: 'ws-clear-btn', 
    submit: 'ws-submit-btn', 
    currentPage: 'Word Scramble', 
    gameMessage: 'ws-Message Placeholder'
  }); 
});   

export default router;