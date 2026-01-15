const { db } = require('../config/firebase');
const { encrypt, decrypt } = require('../config/stripe');

// User Model
class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email || null;
    this.phone = data.phone || null;
    this.password = data.password ? this.hashPassword(data.password) : null;
    this.authProviders = data.authProviders || [];
    this.ageGroup = data.ageGroup || 'adult'; // '2-5', '5-12', '12-18', '18-50', '50+'
    this.firstName = data.firstName || null;
    this.lastName = data.lastName || null;
    this.profilePicture = data.profilePicture || null;
    this.biometricEnabled = data.biometricEnabled || false;
    this.pinEnabled = data.pinEnabled || false;
    this.pinHash = data.pin ? this.hashPIN(data.pin) : null;
    this.isActive = data.isActive !== false;
    this.isLocked = data.isLocked || false;
    this.lockedUntil = data.lockedUntil || null;
    this.failedAttempts = data.failedAttempts || 0;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.lastLoginAt = null;
    this.preferences = {
      theme: data.theme || 'auto',
      fontSize: data.fontSize || 'normal', // 'small', 'normal', 'large', 'extra-large'
      voiceEnabled: data.voiceEnabled || true,
      locationEnabled: data.locationEnabled || false,
      notifications: {
        email: data.emailNotifications !== false,
        push: data.pushNotifications !== false,
        sms: false,
      },
    };
    this.isAdmin = data.isAdmin || false;
    this.adminRole = data.adminRole || null;
    this.balance = data.balance || 0;
    this.referralCode = data.referralCode || null;
    this.referredBy = data.referredBy || null;
  }

  hashPassword(password) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  hashPIN(pin) {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', 'master-app-salt');
    hash.update(pin.toString());
    return hash.digest('hex');
  }

  async save() {
    try {
      const userRef = db.collection('users').doc(this.id || db.collection('users').doc().id);
      await userRef.set({
        ...this,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
      });
      this.id = userRef.id;
      return this;
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  }

  async update(updates) {
    try {
      const userRef = db.collection('users').doc(this.id);
      await userRef.update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      Object.assign(this, updates);
      return this;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const doc = await db.collection('users').doc(id).get();
      if (!doc.exists) return null;
      return new User({ id, ...doc.data() });
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new User({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async findByPhone(phone) {
    try {
      const snapshot = await db.collection('users').where('phone', '==', phone).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new User({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding user by phone:', error);
      throw error;
    }
  }

  static async findByReferralCode(code) {
    try {
      const snapshot = await db.collection('users').where('referralCode', '==', code).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new User({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding user by referral code:', error);
      throw error;
    }
  }

  toPublicJSON() {
    return {
      id: this.id,
      email: this.email,
      ageGroup: this.ageGroup,
      firstName: this.firstName,
      lastName: this.lastName,
      profilePicture: this.profilePicture,
      preferences: this.preferences,
      createdAt: this.createdAt,
    };
  }
}

module.exports = User;
