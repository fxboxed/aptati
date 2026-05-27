/**
 * =========================================================================
 * CLUSTER QUEST GAME ROUTE
 * routes/games/cluster-quest.route.js
 * =========================================================================
 */
import express from 'express';
// Import the gatekeeper middleware with the mandatory .js extension
import redirectIfPro from '../../middleware/redirectIfPro.js';

const router = express.Router();

// Inject the redirectIfPro middleware directly into the route path
router.get('/games/cluster-quest', redirectIfPro, (req, res) => {
  res.render('games/cluster-quest', {
    title: 'Cluster Quest',
    restart: 'cq-restart-btn', 
    newGame: 'cq-new-game-btn', 
    answers: 'cq-answers-btn', 
    dropdown: 'cq-dropdown', 
    shuffle: 'cq-shuffle-btn', 
    clear: 'cq-clear-btn', 
    submit: 'cq-submit-btn', 
    currentPage: 'Cluster Quest',
    gameMessage: 'cq-Message Placeholder'
  });
});

export default router;