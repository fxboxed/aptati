import express from 'express';
import WordStack from '../models/WordStack.js';

const router = express.Router();

/**
 * GET /api/games/:gameCode
 * Fetches a random target word from the database.
 */
router.get('/:gameCode', async (req, res) => {
  try {
    const { gameCode } = req.params;

    const validGames = ['ws'];
    if (!validGames.includes(gameCode.toLowerCase())) {
      return res.status(400).json({ error: `Invalid game code. Must be one of: ${validGames.join(', ')}` });
    }

    // Query exclusively using the basic classification property
    const randomWordCollection = await WordStack.aggregate([
      { $match: { classification: 'TARGET' } },
      { $sample: { size: 1 } }
    ]);

    if (!randomWordCollection || randomWordCollection.length === 0) {
      return res.status(404).json({ 
        error: 'No target words found in the database. Ensure your sync pipeline has run.' 
      });
    }

    const selectedWord = randomWordCollection[0];

    return res.json({
      success: true,
      data: {
        word: selectedWord.word,
        classification: selectedWord.classification
      }
    });

  } catch (error) {
    console.error('❌ Game Generation Engine Route Failure:', error);
    return res.status(500).json({ error: 'Internal server error during game generation.' });
  }
});

export default router;