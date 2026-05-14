import express from 'express';
const router = express.Router();

router.get('/games/cluster-quest', (req, res) => {
  res.render('games/cluster-quest', {title: 'Cluster Quest',restart: 'cq-restart-btn', newGame: 'cq-new-game-btn', answers: 'cq-answers-btn', dropdown: 'cq-dropdown', shuffle: 'cq-shuffle-btn', clear: 'cq-clear-btn', submit: 'cq-submit-btn', currentPage: 'Cluster Quest',gameMessage: 'cq-Message Placeholder'});
});

export default router;