// app.js - Updated with modular routes
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import route modules
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Make user available to all templates (placeholder)
app.use((req, res, next) => {
  // This will be replaced with real Passport authentication
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