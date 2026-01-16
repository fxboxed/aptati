// app.js - Updated with authentication
import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Connect to MongoDB
mongoose.connect(`mongodb://localhost:27017/${process.env.MONGO_DB || 'aptati'}`)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import route modules
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';

// Import Passport configuration
import './config/passport.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set view engine (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Make user available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Use modular routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    server: 'Aptati Games',
    version: '1.0.0',
    routes: ['/', '/about', '/leaderboard', '/auth', '/dashboard']
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Page Not Found',
    user: res.locals.user
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Error',
    message: 'Something went wrong!',
    user: res.locals.user
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✓ Aptati Games running on http://localhost:${PORT}`);
  console.log(`✓ Routes loaded: index, auth, dashboard`);
  console.log(`✓ Views directory: ${path.join(__dirname, 'views')}`);
  console.log(`✓ Public directory: ${path.join(__dirname, 'public')}`);
});