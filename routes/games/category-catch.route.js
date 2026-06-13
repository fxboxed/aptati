/**
 * =========================================================================
 * CATEGORY CATCH GAME ROUTE & API (routes/games/category-catch.route.js)
 * =========================================================================

 */
import express from 'express';
import redirectIfPro from '../../middleware/redirectIfPro.js';
import WordStack from '../../models/WordStack.js';

const router = express.Router();

// 1. The Core HTML Page Render Router
router.get('/games/category-catch', redirectIfPro, async (req, res) => {
  try {
    const derivedBaseUrl = `${req.protocol}://${req.get('host')}`;

    res.render('games/category-catch', {
      title: 'Category Catch',
      answersBtn: 'cc-answers-btn', 
      newGame: 'cc-new-game-btn',
      clear: 'cc-clear-btn', 
      submit: 'cc-submit-btn', 
      currentPage: 'Category Catch', 
      gameMessage: 'cc-message-display',
      ccCategory1: 'cc-category-1',
      ccCategory1Word1: 'cc-category-1-word-1',
      ccCategory1Word2: 'cc-category-1-word-2',
      ccCategory1Word3: 'cc-category-1-word-3',
      ccCategory1Word4: 'cc-category-1-word-4',
      ccCategory2: 'cc-category-2',
      ccCategory2Word1: 'cc-category-2-word-1',

      baseUrl: derivedBaseUrl,       
      description: "Play Category Catch at Aptati Games. Challenge your vocabulary and taxonomy skills across all categories in this daily 5-letter word challenge."
    }); 

  } catch (error) {
    console.error('❌ Failed to render Category Catch layout template:', error);
    res.status(500).send("Critical layout generation error: Game components unreadable.");
  }
});



export default router;
///home/god/projects/aptati/views/games/category-catch.pug