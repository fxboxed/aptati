/**
 * =========================================================================
 * WORD STACK INTEGRATED GAME ROUTE & API (routes/games/word-stack.route.js)
 * =========================================================================
 * Dynamically streams 5-letter puzzles across all active lexicon categories
 * with session-based memory to prevent immediate repeats.
 */
import express from 'express';
import redirectIfPro from '../../middleware/redirectIfPro.js';
import WordStack from '../../models/WordStack.js';

const router = express.Router();

// 1. The Core HTML Page Render Router
router.get('/games/word-stack', redirectIfPro, async (req, res) => {
  try {
    const derivedBaseUrl = `${req.protocol}://${req.get('host')}`;

    res.render('games/word-stack', {
      title: 'Word Stack',
      restart: 'ws-restart-btn', 
      answersBtn: 'ws-open-answers-dropdown-btn', 
      answersDropdown: 'ws-answers-dropdown', 
      shuffle: 'ws-shuffle-btn', 
      clear: 'ws-clear-btn', 
      submit: 'ws-submit-btn', 
      currentPage: 'Word Stack', 
      gameMessage: 'ws-message-display',
      baseUrl: derivedBaseUrl,       
      description: "Play Word Stack at Aptati Games. Challenge your vocabulary and taxonomy skills across all categories in this daily 5-letter word challenge."
    }); 

  } catch (error) {
    console.error('❌ Failed to render Word Stack layout template:', error);
    res.status(500).send("Critical layout generation error: Game components unreadable.");
  }
});

// 2. ENDPOINT: Dynamic Global Category Randomizer (With Anti-Repeat Memory)
router.get('/api/games/word-stack/random', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    // 1. Initialize the player's session memory if it doesn't exist yet
    if (!req.session.playedWsWords) {
      req.session.playedWsWords = [];
    }

    // 2. Query MongoDB, explicitly excluding words the user has already played
    let randomWords = await WordStack.aggregate([
      { 
        $match: { 
          'flags.ws': true, 
          length: 5,
          word: { $nin: req.session.playedWsWords } // Filter out played words
        } 
      },
      { $sample: { size: 1 } }
    ]);

    // 3. Deck Exhausted Trigger: If no words are returned, they've played them all!
    if (!randomWords || randomWords.length === 0) {
      console.log(`♻️ Session ${req.sessionID} exhausted Word Stack pool. Reshuffling deck.`);
      
      // Clear the memory array
      req.session.playedWsWords = [];
      
      // Pull a fresh word from the newly reset deck
      randomWords = await WordStack.aggregate([
        { $match: { 'flags.ws': true, length: 5 } },
        { $sample: { size: 1 } }
      ]);

      // If it's STILL empty, the database is genuinely empty
      if (!randomWords || randomWords.length === 0) {
        return res.status(404).json({ error: "No matching 5-letter game assets found in DB." });
      }
    }

    const selectedDocument = randomWords[0];
    const activeCategory = selectedDocument.category || 'general';

    // 4. Save this specific word into the user's session memory so they don't see it again
    req.session.playedWsWords.push(selectedDocument.word);

    // 5. Send the clean payload to the frontend
    res.json({ 
      word: selectedDocument.word.toUpperCase(),
      category: activeCategory,
      progress: {
        playedCount: req.session.playedWsWords.length
      }
    });

  } catch (error) {
    console.error('❌ API Error fetching random word stack document:', error);
    res.status(500).json({ error: "Internal Server database allocation failure." });
  }
});

// THIS LINE PREVENTS THE CRASH
export default router;