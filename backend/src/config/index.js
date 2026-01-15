const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost:5432/master_app',
    poolMax: parseInt(process.env.DATABASE_POOL_MAX || '10'),
    ssl: process.env.NODE_ENV === 'production',
  },

  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  },

  // Supabase (backup)
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Stripe
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    platformFeePercentage: parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || '5'),
  },

  // Email (Nodemailer)
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
  },

  // SMS (Twilio or Firebase)
  sms: {
    provider: process.env.SMS_PROVIDER || 'firebase', // 'firebase' or 'twilio'
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
  },

  // JWT (Session Tokens)
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRE_IN || '30m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE_IN || '7d',
  },

  // Session Timeout
  session: {
    maxIdleTime: parseInt(process.env.SESSION_MAX_IDLE_TIME || '30'), // minutes
    absoluteTimeout: parseInt(process.env.SESSION_ABSOLUTE_TIMEOUT || '24'), // hours
    warningBefore: parseInt(process.env.SESSION_WARNING_BEFORE || '5'), // minutes
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes in ms
    maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '5'),
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
  },

  // Admin
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@masterapp.com',
    backupEmail: process.env.ADMIN_BACKUP_EMAIL || 'NYCTailblazers@gmail.com',
    phone: process.env.ADMIN_PHONE || '+13472608305',
  },

  // Server
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || 'localhost',
    nodeEnv: process.env.NODE_ENV || 'development',
    cors: {
      origin: process.env.CORS_ORIGIN || ['http://localhost:5000', 'http://localhost:8080'],
      credentials: true,
    },
  },

  // Update System
  updates: {
    checkIntervalDays: parseInt(process.env.UPDATE_CHECK_INTERVAL_DAYS || '7'),
    checkTime: process.env.UPDATE_CHECK_TIME || '03:33',
    checkDay: process.env.UPDATE_CHECK_DAY || 'Monday',
    logFile: process.env.UPDATE_LOG_FILE || '/var/log/master-app-updates.log',
    notificationEmail: process.env.UPDATE_NOTIFICATION_EMAIL || process.env.ADMIN_BACKUP_EMAIL,
    githubOwner: process.env.GITHUB_OWNER || 'Kaoz625',
    githubRepo: process.env.GITHUB_REPO || 'MASTER_APP',
  },

  // Voice Navigation
  voice: {
    provider: process.env.VOICE_PROVIDER || 'web-speech-api', // 'web-speech-api' or custom
    language: process.env.VOICE_LANGUAGE || 'en-US',
    enabledForAllAges: process.env.VOICE_ENABLED_FOR_ALL === 'true',
  },

  // Maps & Location
  maps: {
    provider: process.env.MAPS_PROVIDER || 'google-maps', // 'google-maps', 'mapbox', 'openstreetmap'
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    defaultZoom: parseInt(process.env.MAPS_DEFAULT_ZOOM || '14'),
  },
};
