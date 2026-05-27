import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose'; // Added for your database validation hooks

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.use(express.static('public'));

// Core body parsers so your forms work perfectly
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamic production vs local environment verification flags
const isProduction = process.env.NODE_ENV === 'production';

// Session configuration matching your layout variables
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    secure: isProduction,
    httpOnly: true,
    sameSite: 'lax',
    // Allows sharing logins seamlessly with pro.aptati.com in production
    domain: isProduction ? '.aptati.com' : undefined
  }
}));

// Initialize Passport Engine
app.use(passport.initialize());
app.use(passport.session());

// GLOBAL VARIABLE INJECTION MIDDLEWARE
// This makes sure 'isAuthed' and 'user' flow down into your side-nav partial cleanly!
app.use((req, res, next) => {
  res.locals.isAuthed = req.isAuthenticated();
  res.locals.user = req.user || null;
  next();
});

// Import your configuration initialization files
import './config/passport.js';

// Connect to Local MongoDB Instance
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aptati')
    .then(() => console.log('🍃 Local MongoDB database instance connected successfully.'))
    .catch((err) => console.error('❌ MongoDB internal local connection failure:', err));

// Main Root Application Entry Point
app.get('/', (req, res) => {
  res.render('index', { title: 'Word challenges', currentPage: 'APTATI' });
});

// YOUR ORIGINAL WORKING GAME ROUTE IMPORTS (Perfectly Restored)
import letterLinkRoute from './routes/games/letter-link.route.js';
import spellBugRoute from './routes/games/spell-bug.route.js';
import wordScrambleRoute from './routes/games/word-scramble.route.js';
import clusterQuestRoute from './routes/games/cluster-quest.route.js';

// NEW ROUTE IMPORTS (Auth system & premium dashboards)
import contactRouter from './routes/contact.route.js';
import authRouter from './routes/authRoutes.js'; 
import dashboardRouter from './routes/dashboard.route.js';

// MOUNT ALL ROUTERS
app.use(letterLinkRoute);
app.use(spellBugRoute);
app.use(wordScrambleRoute);
app.use(clusterQuestRoute);

app.use(contactRouter);
app.use(authRouter);
app.use(dashboardRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});