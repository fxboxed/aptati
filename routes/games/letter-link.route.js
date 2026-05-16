import express from 'express';
const router = express.Router();

router.get('/games/letter-link', (req, res) => {
  res.render('games/letter-link', {title: 'Letter Link',restart: 'll-restart-btn', newGame: 'll-new-game-btn', answers: 'll-answers-btn', answerDropdown: 'll-answers', wordConstructor: 'll-word-constructor', shuffle: 'll-shuffle-btn', clear: 'll-clear-btn', submit: 'll-submit-btn', currentPage: 'Letter Link', gameMessage: 'll-Message Placeholder'});
});

export default router;
// this game will use a dropdown to show the top 5 or 6 solutions

// will any of the IDs be better in public js? Each game will have its own directory and be as modular as possible.
// All JS shall be commented as if for a none coder, and the code will be as self explanatory as possible. The goal is for the code to be easily editable by non coders, so I will try to make it as easy to understand as possible.
