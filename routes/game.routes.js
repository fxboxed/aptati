import express from 'express';
import WordStack from '../models/WordStack.js';

const router = express.Router();

/**
 * GET /api/games/:gameCode
 * Fetches a random word across ALL categories tailored to a specific game's rules.
 */
router.get('/:gameCode', async (req, res) => {
  try {
    const { gameCode } = req.params;
    const wordLength = req.query.length ? parseInt(req.query.length, 10) : null;

    // 1. Sanitize and validate the incoming game token
    const validGames = ['ws', 'sb', 'cq', 'll', 'cc']; // Extend this list as you add more games
    if (!validGames.includes(gameCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid game code. Must be one of: ${validGames.join(', ')}` });
    }

    // 2. Dynamically construct the MongoDB query filter matrix
    const matchQuery = {
      [`flags.${gameCode.toLowerCase()}`]: true
    };

    // If a specific length requirement is passed (like 5 for Word Stack), enforce it
    if (wordLength) {
      matchQuery.length = wordLength;
    }

    // 3. Run high-performance random sampling aggregation
    const randomWordCollection = await WordStack.aggregate([
      { $match: matchQuery },          // Filter down to eligible game words globally
      { $sample: { size: 1 } }         // High-performance native random selector
    ]);

    // 4. Handle empty pool safety check
    if (randomWordCollection.length === 0) {
      return res.status(404).json({ 
        error: 'No words found matching those constraints. Ensure your sync pipeline has run.' 
      });
    }

    // Extract the single raw document returned by the pipeline
    const selectedWord = randomWordCollection[0];

    // 5. Explicitly return ALL fields including the newly verified category string
    return res.json({
      success: true,
      data: {
        word: selectedWord.word,
        length: selectedWord.length,
        category: selectedWord.category || 'unknown', // 🎯 FORCED PROPERTY EXPORT
        audioLocale: selectedWord.audioLocale || 'BOTH'
      }
    });

  } catch (error) {
    console.error('❌ Game Generation Engine Route Failure:', error);
    return res.status(500).json({ error: 'Internal server error assembly fault.' });
  }
});

export default router;