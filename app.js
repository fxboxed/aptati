import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Flexible MongoDB connection
// Priority: 1. MONGODB_URI, 2. MONGODB_HOST + MONGO_DB, 3. Default localhost
const getMongoConnectionString = () => {
  // Full connection string from environment variable (highest priority)
  if (process.env.MONGODB_URI) {
    console.log('Using MONGODB_URI from environment variable');
    return process.env.MONGODB_URI;
  }
  
  // Construct from host and database name
  const mongoHost = process.env.MONGODB_HOST || 'localhost';
  const mongoPort = process.env.MONGODB_PORT || '27017';
  const dbName = process.env.MONGO_DB || 'aptati';
  
  console.log(`Using MongoDB at ${mongoHost}:${mongoPort}/${dbName}`);
  return `mongodb://${mongoHost}:${mongoPort}/${dbName}`;
};

// Connect to MongoDB - REMOVED DEPRECATED OPTIONS
const mongoURI = getMongoConnectionString();

mongoose.connect(mongoURI)
  .then(() => console.log(`✓ MongoDB connected: ${mongoURI.split('@').pop() || mongoURI}`))
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    console.log('Connection string used:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    // Provide helpful troubleshooting tips for Linux
    if (mongoURI.includes('localhost') || mongoURI.includes('127.0.0.1')) {
      console.log('\nTroubleshooting tips for local MongoDB:');
      console.log('1. Make sure MongoDB is running locally: sudo systemctl start mongod');
      console.log('2. Check if MongoDB is listening on all interfaces: sudo netstat -tulpn | grep :27017');
      console.log('3. For Podman containers, use MONGODB_HOST=host.containers.internal');
      console.log('4. Or set MONGODB_URI=mongodb://host.containers.internal:27017/aptati');
      console.log('5. Check MongoDB config bindIp in /etc/mongod.conf (should be 0.0.0.0 for container access)');
    }
  });

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import route modules
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import gamesRouter from './routes/games.js'
import contactRouter from "./routes/contact.js";
// Import Passport configuration
import './config/passport.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy setting for proper cookie handling
if (process.env.NODE_ENV === 'production') {
  // Production: behind Cloudflare and nginx
  app.set('trust proxy', 2);
} else {
  // Development: trust local proxy
  app.set('trust proxy', 1);
}

// testing contact form route
const GOOGLE_CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID || "").trim();
const GOOGLE_CLIENT_SECRET = String(process.env.GOOGLE_CLIENT_SECRET || "").trim();

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("❌ Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET. Check your .env file.");
  process.exit(1);
}

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

// Test MongoDB connection route (enhanced)
app.get('/test-db', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const adminDb = mongoose.connection.getClient().db().admin();
    const serverStatus = await adminDb.serverStatus();
    
    const collections = await db.listCollections().toArray();
    let usersCount = 0;
    
    try {
      usersCount = await db.collection('Users').countDocuments();
    } catch (e) {
      // Users collection might not exist yet
    }
    
    res.json({
      message: 'MongoDB connected successfully',
      database: db.databaseName,
      connectionString: mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
      collections: collections.map(c => c.name),
      usersCount: usersCount,
      serverInfo: {
        host: serverStatus.host,
        version: serverStatus.version,
        connections: serverStatus.connections.current,
        uptime: Math.floor(serverStatus.uptime / 60) + ' minutes'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      connectionString: mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'),
      tip: 'Check if MongoDB is running and accessible from this container/process'
    });
  }
});

// Configuration info endpoint
app.get('/config', (req, res) => {
  res.json({
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoHost: process.env.MONGODB_HOST || 'localhost',
    mongoDb: process.env.MONGO_DB || 'aptati',
    hasMongodbUri: !!process.env.MONGODB_URI,
    port: PORT
  });
});

// Set view engine (Pug)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Make user and authentication status available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.isAuthed = req.isAuthenticated ? req.isAuthenticated() : false;
  next();
});

// Use modular routes
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/dashboard', dashboardRouter);
app.use('/games', gamesRouter);
app.use("/contact", contactRouter); // This is the correct contact route

// Health check endpoint (enhanced)
app.get('/health', (req, res) => {
  const mongoStatus = mongoose.connection.readyState;
  const statusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  
  res.status(mongoStatus === 1 ? 200 : 503).json({ 
    status: mongoStatus === 1 ? 'OK' : 'SERVICE_UNAVAILABLE',
    server: 'Aptati Games',
    version: '1.0.0',
    mongoDb: statusMap[mongoStatus] || 'unknown',
    uptime: process.uptime(),
    routes: ['/', '/about', '/leaderboard', '/auth', '/dashboard', '/test-db', '/config', '/health']
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
    user: res.locals.user,
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Aptati Games Server`);
  console.log(`──────────────────────────────`);
  console.log(`✓ Port: ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ Database: ${process.env.MONGO_DB || 'aptati'}`);
  console.log(`✓ MongoDB Host: ${process.env.MONGODB_HOST || 'localhost'}`);
  if (process.env.MONGODB_URI) {
    console.log(`✓ Using MONGODB_URI environment variable`);
  }
  console.log(`✓ Views: ${path.join(__dirname, 'views')}`);
  console.log(`✓ Public: ${path.join(__dirname, 'public')}`);
  console.log(`──────────────────────────────`);
  console.log(`Access URLs:`);
  console.log(`   Local: http://localhost:${PORT}`);
  console.log(`   Network: http://0.0.0.0:${PORT}`);
  console.log(`\nHealth check: http://localhost:${PORT}/health`);
  console.log(`DB test: http://localhost:${PORT}/test-db`);
  console.log(`Config: http://localhost:${PORT}/config`);
});