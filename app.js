// Load hidden variables from your environment setup file (.env)
import 'dotenv/config';

// Load Express, the engine that powers your web server
import express from 'express';

// Load session management to keep users logged in across pages
import session from 'express-session';

// Load Passport, the security system handling user logins
import passport from 'passport';

// Load Mongoose, the bridge connecting Node.js to your local MongoDB database
import mongoose from 'mongoose';

// Load your custom database connector file
import connectDB from './config/db.js';

// Load the Google Sheet automatic syncing task script
import { syncGoogleSheet } from './scripts/syncSheet.js';

// Create your main Express web application instance
const app = express();

// Set the port number where your local server listens (Port 3000)
const port = 3000;

// Set Pug as the template view engine for HTML rendering
app.set('view engine', 'pug');

// Serve static public assets like stylesheet CSS, client JS, and images
app.use(express.static('public'));

// Parse JSON incoming requests automatically (needed for modern game fetch APIs)
app.use(express.json());

// Parse standard HTML form submissions automatically
app.use(express.urlencoded({ extended: true }));

// Check whether your app is running live in production or locally on your computer
const isProduction = process.env.NODE_ENV === 'production';

// Configure session cookies for tracking user state
app.use(session({
  secret: process.env.SESSION_SECRET || 'default-secret-change-in-production', // Secret key to encrypt session IDs
  resave: false,                                                             // Do not save session if unmodified
  saveUninitialized: false,                                                  // Do not create session until something stored
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // Keep session active for exactly 1 day (in milliseconds)
    secure: isProduction,         // Force HTTPS security cookies only when live in production
    httpOnly: true,               // Protect cookies from bad browser scripts
    sameSite: 'lax',              // Help shield against cross-site request forgery attacks
    domain: isProduction ? '.aptati.com' : undefined // Set cookie domain scope
  }
}));

// Turn on Passport authentication engine
app.use(passport.initialize());

// Enable persistent login sessions with Passport
app.use(passport.session());

// Middleware: Pass logged-in status and user details to every rendered web page automatically
app.use((req, res, next) => {
  res.locals.isAuthed = req.isAuthenticated(); // TRUE if logged in, FALSE if guest
  res.locals.user = req.user || null;          // Store logged-in user profile details
  next();                                      // Continue to the next task
});

// Import Passport strategy configurations
import './config/passport.js';

// IMPORT ROUTE HANDLERS
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000;"
  );
  next();
});
//import wordStackRoute from './routes/games/word-stack.route.js';
import gameRoutes from './routes/game.routes.js';       // This houses your game controller logic (Step 3)
import wordStackRoute from './routes/games/word-stack.route.js';
import contactRouter from './routes/contact.route.js';
import authRouter from './routes/authRoutes.js'; 
import dashboardRouter from './routes/dashboard.route.js';

// MOUNT ROUTE HANDLERS ON THE APP
//app.use(wordStackRoute);
app.use('/api/games', gameRoutes);
app.use(wordStackRoute); // Routes for getting random words and checking typed guesses
app.use(contactRouter);
app.use(authRouter);
app.use(dashboardRouter);

// Main root home page route
app.get('/', (req, res) => {
  res.render('index', { title: 'Word challenges', currentPage: 'APTATI' });
});

// STARTUP SEQUENCE: Connect Database -> Run Google Sheet Sync -> Start Web Server
const startServer = async () => {
  try {
    // 1. Establish database connection using your connectDB tool
    await connectDB();

    // 2. Fetch latest words from Google Sheets and write updates to MongoDB automatically
    console.log('🔄 Checking for Google Sheet word updates...');
    await syncGoogleSheet();

    // 3. Start the Express web server listening for requests on port 3000
    app.listen(port, () => {
      console.log(`=======================================================`);
      console.log(`🚀 SUCCESS: Server listening at http://localhost:${port}`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    // Report failure if database or sync steps encounter an unrecoverable error
    console.error(`❌ FAILURE: Server startup interrupted: ${error.message}`);
    process.exit(1); // Stop execution
  }
};

// Execute the startup sequence
startServer();