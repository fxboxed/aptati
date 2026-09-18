//controllers/gameController.js

// Import the blueprint rules so we can search the database collection
import Word from '../models/Word.js';

// ACTION 1: Grab one random answer word for the game session
export const getRandomTargetWord = async (req, res) => {
    try {
        // Ask MongoDB to look through words labeled 'TARGET' and randomly pick 1 word item
        const [randomWord] = await Word.aggregate([
            { $match: { classification: 'TARGET' } }, // Filter: Keep target classification only
            { $sample: { size: 1 } }                  // Pick: Choose 1 item randomly
        ]);

        // If no target words were loaded into the database, tell the game client
        if (!randomWord) {
            return res.status(404).json({ error: 'No target words are available in the database.' });
        }

        // Send the picked word back to the game screen as JSON format data
        res.json({ word: randomWord.word });
    } catch (error) {
        // Report server error message if database query fails
        res.status(500).json({ error: error.message });
    }
};
//home/dave/dev/aptati/models/Word
// ACTION 2: Check if a player's typed word is valid/allowed
export const validateGuess = async (req, res) => {
    try {
        // Extract the typed word from the game web address parameters
        const { guess } = req.params;

        // Check if this word exists anywhere in the database (either TARGET or ALLOWED)
        const exists = await Word.exists({ word: guess.toUpperCase() });

        // Reply to game client: true if word is in database, false if not found
        res.json({ isValid: Boolean(exists) });
    } catch (error) {
        // Report server error message if query fails
        res.status(500).json({ error: error.message });
    }
};