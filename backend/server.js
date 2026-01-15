require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { database } = require('./src/config/database');

// Middleware
const authMiddleware = require('./src/middleware/auth.middleware');
const rateLimiter = require('./src/middleware/rateLimiter');
const sessionTimeout = require('./src/middleware/sessionTimeout');
const errorHandler = require('./src/middleware/errorHandler');
const ageGroupCheck = require('./src/middleware/ageGroupCheck');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const paymentRoutes = require('./src/routes/payment.routes');
const lockoutRoutes = require('./src/routes/lockout.routes');
const parentRoutes = require('./src/routes/parent.routes');
const adminRoutes = require('./src/routes/admin.routes');
const referralRoutes = require('./src/routes/referral.routes');
const voiceRoutes = require('./src/routes/voice.routes');
const mapRoutes = require('./src/routes/map.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5000', 'http://localhost:8080'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('combined'));

// Static files
app.use(express.static('public'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: database.pool ? 'connected' : 'disconnected',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/lockout', lockoutRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/map', mapRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║                                                ║
║   🚀 MASTER APP BACKEND SERVER           ║
║                                                ║
║   📡 Server: Running                    ║
║   🔗 Port: ${PORT}                           ║
║   📍 URL: http://localhost:${PORT}        ║
║   ⏰ Started: ${new Date().toLocaleString()}    ║
║                                                ║
║   📊 Health Check: http://localhost:${PORT}/health ║
║   📚 API Docs: http://localhost:${PORT}/api/docs ║
║                                                ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
