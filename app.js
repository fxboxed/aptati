
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { title: 'Word challenges', currentPage: 'APTATI' });
});
import boxedLettersRoute from './routes/games/boxed-letters.route.js';
import spellBugRoute from './routes/games/spell-bug.route.js';
import wordScrambleRoute from './routes/games/word-scramble.route.js';
import wordGroupsRoute from './routes/games/word-groups.route.js';

// testing contact form route
// const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || "").trim();
// const GOOGLE_CLIENT_SECRET = String(process.env.GOOGLE_CLIENT_SECRET || "").trim();

// if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
//   console.error("❌ Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET. Check your .env file.");
//   process.exit(1);
// }

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: process.env.NODE_ENV === 'production' ? true : 'auto',
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'lax'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(boxedLettersRoute);
app.use(spellBugRoute);
app.use(wordScrambleRoute);
app.use(wordGroupsRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});