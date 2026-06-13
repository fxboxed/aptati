// import mongoose from 'mongoose';

// /**
//  * =========================================================================
//  * ORIGINAL WORDSTACK MODEL (models/WordStack.js)
//  * =========================================================================
//  * Restored to original single-domain layout.
//  */
// const wordStackSchema = new mongoose.Schema({
//   // The normalized uppercase text string for the target game word
//   word: {
//     type: String,
//     required: true,
//     unique: true, // Original unique constraint on word only
//     uppercase: true,
//     trim: true
//   },
//   // Character count matching the length of the string
//   length: {
//     type: Number,
//     required: true
//   },
//   // Legacy root word reference
//   root_word: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   // Legacy local audio track configurations
//   audio_local: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   // Legacy locale identifier tags
//   audioLocale: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   // Visibility status flags across standard application game engines
//   flags: {
//     ws: { type: Boolean, default: false }, // Word Stack
//     sb: { type: Boolean, default: false }, // Spelling Bee
//     cq: { type: Boolean, default: false }, // Category Quiz
//     ll: { type: Boolean, default: false }  // Ladder Logic
//   },
//   // Grammatical structure tags
//   grammar: {
//     is_noun: { type: Boolean, default: true },
//     is_adj:  { type: Boolean, default: false },
//     is_adv:  { type: Boolean, default: false },
//     v_pres:  { type: Boolean, default: false },
//     v_prog:  { type: Boolean, default: false },
//     v_past:  { type: Boolean, default: false }
//   }
// }, { 
//   timestamps: true 
// });

// export default mongoose.models.WordStack || mongoose.model('WordStack', wordStackSchema);
import mongoose from 'mongoose';

/**
 * =========================================================================
 * UPDATED WORDSTACK MODEL (models/WordStack.js)
 * =========================================================================
 * Multi-domain vocabulary structure supporting birds, plants, and future expansions.
 */
const wordStackSchema = new mongoose.Schema({
  // The normalized uppercase text string for the target game word
  word: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  // Classification domain identifier (e.g., 'birds', 'plants')
  category: {
    type: String,
    required: true,
    toLowerCase: true,
    trim: true,
    default: 'birds' // Keeps existing bird data secure automatically
  },
  // Character count matching the length of the string
  length: {
    type: Number,
    required: true
  },
  // Legacy root word reference
  root_word: {
    type: String,
    trim: true,
    default: ''
  },
  // Legacy local audio track configurations
  audio_local: {
    type: String,
    trim: true,
    default: ''
  },
  // Legacy locale identifier tags
  audioLocale: {
    type: String,
    trim: true,
    default: ''
  },
  // Visibility status flags across standard application game engines
  flags: {
    ws: { type: Boolean, default: false }, // Word Stack
    sb: { type: Boolean, default: false }, // Spelling Bee
    cq: { type: Boolean, default: false }, // Category Quiz
    ll: { type: Boolean, default: false }  // Ladder Logic
  },
  // Grammatical structure tags
  grammar: {
    is_noun: { type: Boolean, default: true },
    is_adj:  { type: Boolean, default: false },
    is_adv:  { type: Boolean, default: false },
    v_pres:  { type: Boolean, default: false },
    v_prog:  { type: Boolean, default: false },
    v_past:  { type: Boolean, default: false }
  }
}, { 
  timestamps: true 
});

export default mongoose.models.WordStack || mongoose.model('WordStack', wordStackSchema);