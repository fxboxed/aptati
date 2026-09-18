// Load Mongoose to communicate with MongoDB
import mongoose from 'mongoose';

// Define rules for storing words in the database
const wordSchema = new mongoose.Schema({
    // Word column rules
    word: {
        type: String,       // Must be plain text
        required: true,     // Cannot be empty
        unique: true,       // Prevents duplicate entries
        uppercase: true,    // Converts text to UPPERCASE
        trim: true          // Removes extra spaces
    },
    // Classification column rules
    classification: {
        type: String,       // Must be plain text
        required: true,     // Cannot be empty
        enum: ['TARGET', 'ALLOWED'], // Allows ONLY these two values
        uppercase: true     // Converts text to UPPERCASE
    }
}, { 
    timestamps: true        // Adds createdAt and updatedAt timestamps
});

// Create the database model named "Word"
const Word = mongoose.model('Word', wordSchema);

// Export the model for use in other files
export default Word;