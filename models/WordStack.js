import mongoose from 'mongoose';

const wordSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    classification: {
        type: String,
        required: true,
        enum: ['TARGET', 'ALLOWED'],
        uppercase: true
    }
}, { 
    timestamps: true 
});

const WordStack = mongoose.models.WordStack || mongoose.model('WordStack', wordSchema);

export default WordStack;