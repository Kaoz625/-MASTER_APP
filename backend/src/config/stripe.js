const crypto = require('crypto');

// Encryption utilities for sensitive data
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY_LENGTH = 32;
const IV_LENGTH = 16;

// Generate encryption key from password
function generateKey(password) {
  return crypto.scryptSync(password, 'salt', 64, 8, 1000000);
}

// Encrypt data
function encrypt(text, key) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
  };
}

// Decrypt data
function decrypt(encryptedData, iv, key) {
  const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, Buffer.from(iv, 'hex'));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Hash PIN (SHA-256 with salt)
function hashPIN(pin, salt = 'master-app-salt') {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(pin.toString());
  return hash.digest('hex');
}

// Generate referral code
function generateReferralCode() {
  return crypto.randomBytes(8).toString('hex');
}

// Generate JWT secret
function generateJWTSecret() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = {
  generateKey,
  encrypt,
  decrypt,
  hashPIN,
  generateReferralCode,
  generateJWTSecret,
  ENCRYPTION_ALGORITHM,
  IV_LENGTH,
  ENCRYPTION_KEY_LENGTH,
};
