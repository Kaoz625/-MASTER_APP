require('dotenv').config();

const { User } = require('./models/User');
const { Session } = require('./models/Session');
const { Lockout } = require('./models/Lockout');
const { AuthProvider } = require('./models/AuthProvider');
const { Referral } = require('./models/Referral');
const { firebase } = require('./config/firebase');
const { generateJWT, verifyJWT, generateRefreshToken, verifyRefreshToken } = require('./utils/tokenGenerator');
const { encrypt, decrypt } = require('./config/stripe');
const { generateReferralCode } = require('./config/stripe');
const { hashPIN } = require('./config/stripe');

// Rate limiter
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS) || 5,
  message: {
    error: 'Too many login attempts',
    message: 'Too many login attempts. Please try again later.',
    remainingAttempts: 0,
    unlockTime: new Date(Date.now() + 15 * 60 * 1000),
    recoveryOptions: [
      'Wait 15 minutes for automatic unlock',
      'Click "Forgot Password" to reset via email',
      'Click "Forgot Password" to reset via phone',
      'Contact support for immediate unlock',
    ],
  },
  standardHeaders: true,
  skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
});

// Google OAuth
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify with Firebase
    const decodedToken = await firebase.auth.verifyIdToken(idToken);

    // Check if user exists
    let user = await User.findByEmail(decodedToken.email);
    if (!user) {
      // Create new user
      user = new User({
        email: decodedToken.email,
        authProviders: ['google'],
        ageGroup: req.ageGroup || 'adult',
        firstName: decodedToken.name || '',
        lastName: decodedToken.family_name || '',
        isActive: true,
      });
      await user.save();

      // Create auth provider record
      const authProvider = new AuthProvider({
        userId: user.id,
        provider: 'google',
        providerId: decodedToken.sub,
        isActive: true,
      });
      await authProvider.save();

      // Track referral if code provided
      if (req.body.referralCode) {
        await Referral.recordConversion(user.id, 0);
      }
    } else {
      // Update last used auth provider
      const authProvider = await AuthProvider.findByUserIdAndProvider(user.id, 'google');
      if (authProvider) {
        await authProvider.updateLastUsed();
      }
    }

    // Create session
    const session = new Session({
      userId: user.id,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.body.platform || 'unknown',
      },
    });
    await session.save();

    // Return tokens
    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE_IN || '30m',
      isNewUser: !user.lastLoginAt,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Google authentication failed',
      message: error.message,
    });
  }
};

// Apple Sign In
const appleAuth = async (req, res) => {
  try {
    const { identityToken } = req.body;

    // Verify with Firebase
    const decodedToken = await firebase.auth.verifyIdToken(identityToken);

    // Check if user exists
    let user = await User.findByEmail(decodedToken.email);
    if (!user) {
      user = new User({
        email: decodedToken.email,
        authProviders: ['apple'],
        ageGroup: req.ageGroup || 'adult',
        firstName: decodedToken.name ? decodedToken.name.givenName : '',
        lastName: decodedToken.name ? decodedToken.name.familyName : '',
        isActive: true,
      });
      await user.save();

      // Create auth provider record
      const authProvider = new AuthProvider({
        userId: user.id,
        provider: 'apple',
        providerId: decodedToken.sub,
        isActive: true,
      });
      await authProvider.save();

      // Track referral
      if (req.body.referralCode) {
        await Referral.recordConversion(user.id, 0);
      }
    } else {
      // Update auth provider
      const authProvider = await AuthProvider.findByUserIdAndProvider(user.id, 'apple');
      if (authProvider) {
        await authProvider.updateLastUsed();
      }
    }

    // Create session
    const session = new Session({
      userId: user.id,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.body.platform || 'unknown',
      },
    });
    await session.save();

    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE_IN || '30m',
    });
  } catch (error) {
    console.error('Apple auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Apple authentication failed',
      message: error.message,
    });
  }
};

// Email/Password Authentication
const emailAuth = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check rate limit
    const isRateLimited = await checkRateLimit(req, email);
    if (isRateLimited) {
      return res.status(429).json({
        success: false,
        error: 'Too many login attempts',
        message: 'Account temporarily locked. Please wait 15 minutes or use password recovery.',
        unlockTime: new Date(Date.now() + 15 * 60 * 1000),
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
    }

    // Check password
    if (user.password !== user.hashPassword(password)) {
      // Increment failed attempts
      user.failedAttempts = (user.failedAttempts || 0) + 1;

      if (user.failedAttempts >= 5) {
        // Create lockout
        const lockout = new Lockout({
          userId: user.id,
          reason: 'too-many-attempts',
          attempts: user.failedAttempts,
          ipAddress: req.ip,
          deviceId: req.body.deviceId,
        });
        await lockout.save();

        await user.update({ isLocked: true, lockedUntil: lockout.unlockAt });

        return res.status(423).json({
          success: false,
          error: 'Account locked',
          message: 'Too many failed login attempts. Account locked for 15 minutes.',
          lockout: lockout.toPublicJSON(),
        });
      }

      await user.update({ failedAttempts: user.failedAttempts });

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
        remainingAttempts: 5 - user.failedAttempts,
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      const lockout = await Lockout.findByUserId(user.id);
      if (lockout && lockout.isLocked()) {
        return res.status(423).json({
          success: false,
          error: 'Account locked',
          message: 'Account is temporarily locked. Please wait ' + lockout.getTimeRemaining() + ' minutes.',
          lockout: lockout.toPublicJSON(),
        });
      }
    }

    // Successful login
    await user.update({
      failedAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      lastLoginAt: new Date(),
    });

    // Create auth provider record
    const authProvider = await AuthProvider.findByUserIdAndProvider(user.id, 'email');
    if (!authProvider) {
      authProvider = new AuthProvider({
        userId: user.id,
        provider: 'email',
        providerId: null,
        isActive: true,
      });
      await authProvider.save();
    } else {
      await authProvider.updateLastUsed();
    }

    // Create session
    const session = new Session({
      userId: user.id,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.body.platform || 'unknown',
      },
    });
    await session.save();

    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE_IN || '30m',
    });
  } catch (error) {
    console.error('Email auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: error.message,
    });
  }
};

// Phone Number Authentication (SMS verification)
const phoneAuth = async (req, res) => {
  try {
    const { phone, code, country } = req.body;

    // Validate phone number
    const formattedPhone = `${country || '+1'}${phone.replace(/\D/g, '')}`;

    // Check rate limit
    const isRateLimited = await checkRateLimit(req, formattedPhone);
    if (isRateLimited) {
      return res.status(429).json({
        success: false,
        error: 'Too many verification attempts',
        message: 'Too many attempts. Please wait 15 minutes.',
        unlockTime: new Date(Date.now() + 15 * 60 * 1000),
      });
    }

    // Verify code with Firebase Phone Auth
    const verificationResult = await firebase.auth.verifyPhoneNumberCode(formattedPhone, code);

    if (!verificationResult.success) {
      return res.status(401).json({
        success: false,
        error: 'Invalid verification code',
        message: 'The code you entered is incorrect or has expired.',
      });
    }

    // Find or create user
    let user = await User.findByPhone(formattedPhone);
    if (!user) {
      // Create new user from phone
      user = new User({
        phone: formattedPhone,
        authProviders: ['phone'],
        ageGroup: req.ageGroup || 'adult',
        isActive: true,
      });
      await user.save();

      // Create auth provider record
      const authProvider = new AuthProvider({
        userId: user.id,
        provider: 'phone',
        providerId: formattedPhone,
        isActive: true,
      });
      await authProvider.save();

      // Track referral
      if (req.body.referralCode) {
        await Referral.recordConversion(user.id, 0);
      }
    } else {
      // Update auth provider
      const authProvider = await AuthProvider.findByUserIdAndProvider(user.id, 'phone');
      if (authProvider) {
        await authProvider.updateLastUsed();
      }
    }

    // Create session
    const session = new Session({
      userId: user.id,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.body.platform || 'unknown',
      },
    });
    await session.save();

    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: 'Phone authentication successful',
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE_IN || '30m',
    });
  } catch (error) {
    console.error('Phone auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Phone authentication failed',
      message: error.message,
    });
  }
};

// PIN Authentication (quick login)
const pinAuth = async (req, res) => {
  try {
    const { userId, pin } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'Please login with your credentials first.',
      });
    }

    // Verify PIN
    if (!user.pinEnabled || !user.pinHash) {
      return res.status(400).json({
        success: false,
        error: 'PIN not set',
        message: 'Please set up a PIN in settings first.',
      });
    }

    if (user.pinHash !== hashPIN(pin)) {
      // Increment failed attempts
      user.failedAttempts = (user.failedAttempts || 0) + 1;

      if (user.failedAttempts >= 5) {
        // Create lockout
        const lockout = new Lockout({
          userId: user.id,
          reason: 'too-many-pin-attempts',
          attempts: user.failedAttempts,
          ipAddress: req.ip,
        });
        await lockout.save();

        await user.update({ isLocked: true, lockedUntil: lockout.unlockAt });

        return res.status(423).json({
          success: false,
          error: 'Account locked',
          message: 'Too many failed PIN attempts. Account locked for 15 minutes.',
          lockout: lockout.toPublicJSON(),
        });
      }

      await user.update({ failedAttempts: user.failedAttempts });

      return res.status(401).json({
        success: false,
        error: 'Invalid PIN',
        message: 'The PIN you entered is incorrect.',
        remainingAttempts: 5 - user.failedAttempts,
      });
    }

    // Successful PIN login
    await user.update({
      failedAttempts: 0,
      isLocked: false,
      lockedUntil: null,
      lastLoginAt: new Date(),
    });

    // Create session
    const session = new Session({
      userId: user.id,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.body.platform || 'unknown',
      },
    });
    await session.save();

    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: 'PIN login successful',
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE_IN || '30m',
    });
  } catch (error) {
    console.error('PIN auth error:', error);
    res.status(500).json({
      success: false,
      error: 'PIN authentication failed',
      message: error.message,
    });
  }
};

// Biometric Authentication (Face ID/Touch ID)
const biometricAuth = async (req, res) => {
  try {
    const { userId, biometricToken } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'Please login with your credentials first.',
      });
    }

    // Verify biometric token
    if (!user.biometricEnabled) {
      return res.status(400).json({
        success: false,
        error: 'Biometrics not enabled',
        message: 'Please enable biometrics in settings first.',
      });
    }

    // Verify token matches stored value
    if (encrypt(biometricToken, user.id) !== encrypt(userId, user.id)) {
      return res.status(401).json({
        success: false,
        error: 'Biometric verification failed',
        message: 'Please login with PIN or password.',
      });
    }

    // Create session
    const session = new Session({
      userId: user.id,
      deviceInfo: {
        userAgent: req.headers['user-agent'],
        ip: req.ip,
        platform: req.body.platform || 'unknown',
      },
    });
    await session.save();

    const accessToken = generateJWT(user);
    const refreshToken = generateRefreshToken(user);

    res.json({
      success: true,
      message: 'Biometric login successful',
      user: user.toPublicJSON(),
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_EXPIRE_IN || '30m',
    });
  } catch (error) {
    console.error('Biometric auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Biometric authentication failed',
      message: error.message,
    });
  }
};

// Check rate limit helper
async function checkRateLimit(req, identifier) {
  // Check if user is locked out
  if (req.user && req.user.isLocked) {
    const lockout = await Lockout.findByUserId(req.user.id);
    if (lockout && lockout.isLocked()) {
      return true;
    }
  }

  return false;
}

module.exports = {
  googleAuth,
  appleAuth,
  emailAuth,
  phoneAuth,
  pinAuth,
  biometricAuth,
};
