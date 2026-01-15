const { db } = require('../config/firebase');

// Lockout Model - For handling account lockouts
class Lockout {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.reason = data.reason || 'too-many-attempts';
    this.attempts = data.attempts || 0;
    this.lockedAt = new Date();
    this.unlockAt = data.unlockAt || new Date(Date.now() + 15 * 60 * 1000); // 15 minutes default
    this.ipAddress = data.ipAddress || null;
    this.deviceId = data.deviceId || null;
  }

  async save() {
    try {
      const lockoutRef = db.collection('lockouts').doc(this.id || db.collection('lockouts').doc().id);
      await lockoutRef.set({
        ...this,
        lockedAt: this.lockedAt.toISOString(),
        unlockAt: this.unlockAt.toISOString(),
      });
      this.id = lockoutRef.id;
      return this;
    } catch (error) {
      console.error('Error saving lockout:', error);
      throw error;
    }
  }

  async unlock() {
    try {
      const lockoutRef = db.collection('lockouts').doc(this.id);
      await lockoutRef.update({
        unlockAt: new Date().toISOString(),
        unlockedAt: new Date().toISOString(),
      });
      this.unlockAt = new Date();
      return this;
    } catch (error) {
      console.error('Error unlocking account:', error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const now = new Date().toISOString();
      const snapshot = await db.collection('lockouts')
        .where('userId', '==', userId)
        .where('unlockAt', '>', now)
        .orderBy('lockedAt', 'desc')
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new Lockout({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding lockout by user ID:', error);
      throw error;
    }
  }

  static async findByUserIdAndIP(userId, ipAddress) {
    try {
      const now = new Date().toISOString();
      const snapshot = await db.collection('lockouts')
        .where('userId', '==', userId)
        .where('ipAddress', '==', ipAddress)
        .where('unlockAt', '>', now)
        .orderBy('lockedAt', 'desc')
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new Lockout({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding lockout by user ID and IP:', error);
      throw error;
    }
  }

  isLocked() {
    return new Date() < this.unlockAt;
  }

  getTimeRemaining() {
    const now = new Date();
    const remaining = this.unlockAt - now;
    return Math.max(0, Math.floor(remaining / 1000 / 60)); // minutes
  }

  toPublicJSON() {
    return {
      id: this.id,
      reason: this.reason,
      attempts: this.attempts,
      lockedAt: this.lockedAt,
      unlockAt: this.unlockAt,
      timeRemaining: this.getTimeRemaining(),
    };
  }
}

module.exports = Lockout;
