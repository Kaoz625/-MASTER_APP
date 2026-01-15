const { db } = require('../config/firebase');

// Session Model
class Session {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.deviceInfo = data.deviceInfo || {};
    this.location = data.location || null;
    this.createdAt = new Date();
    this.lastActivityAt = new Date();
    this.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
  }

  async save() {
    try {
      const sessionRef = db.collection('sessions').doc(this.id || db.collection('sessions').doc().id);
      await sessionRef.set({
        ...this,
        createdAt: this.createdAt.toISOString(),
        lastActivityAt: this.lastActivityAt.toISOString(),
        expiresAt: this.expiresAt.toISOString(),
      });
      this.id = sessionRef.id;
      return this;
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  async updateActivity() {
    try {
      const sessionRef = db.collection('sessions').doc(this.id);
      await sessionRef.update({
        lastActivityAt: new Date().toISOString(),
      });
      this.lastActivityAt = new Date();
      return this;
    } catch (error) {
      console.error('Error updating session activity:', error);
      throw error;
    }
  }

  async extend() {
    try {
      const newExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
      const sessionRef = db.collection('sessions').doc(this.id);
      await sessionRef.update({
        expiresAt: newExpiresAt.toISOString(),
      });
      this.expiresAt = newExpiresAt;
      return this;
    } catch (error) {
      console.error('Error extending session:', error);
      throw error;
    }
  }

  async invalidate() {
    try {
      const sessionRef = db.collection('sessions').doc(this.id);
      await sessionRef.update({
        expiresAt: new Date().toISOString(),
        invalidatedAt: new Date().toISOString(),
      });
      return this;
    } catch (error) {
      console.error('Error invalidating session:', error);
      throw error;
    }
  }

  static async findByToken(token) {
    try {
      const snapshot = await db.collection('sessions').where('token', '==', token).limit(1).get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new Session({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding session by token:', error);
      throw error;
    }
  }

  static async findValidSessions(userId) {
    try {
      const now = new Date().toISOString();
      const snapshot = await db.collection('sessions')
        .where('userId', '==', userId)
        .where('expiresAt', '>', now)
        .get();
      return snapshot.docs.map(doc => new Session({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding valid sessions:', error);
      throw error;
    }
  }

  static async invalidateAllUserSessions(userId) {
    try {
      const snapshot = await db.collection('sessions').where('userId', '==', userId).get();
      const batch = db.batch();
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { expiresAt: new Date().toISOString() });
      });
      await batch.commit();
    } catch (error) {
      console.error('Error invalidating user sessions:', error);
      throw error;
    }
  }
}

module.exports = Session;
