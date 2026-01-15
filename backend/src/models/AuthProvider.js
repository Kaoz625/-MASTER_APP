const { db } = require('../config/firebase');

// Auth Provider Model - Track which OAuth providers user uses
class AuthProvider {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.provider = data.provider || ''; // 'google', 'apple', 'email', 'phone'
    this.providerId = data.providerId || null; // Google ID, Apple ID
    this.email = data.email || null;
    this.lastUsedAt = new Date();
    this.isActive = data.isActive !== false;
  }

  async save() {
    try {
      const providerRef = db.collection('auth_providers').doc(this.id || db.collection('auth_providers').doc().id);
      await providerRef.set({
        ...this,
        lastUsedAt: this.lastUsedAt.toISOString(),
      });
      this.id = providerRef.id;
      return this;
    } catch (error) {
      console.error('Error saving auth provider:', error);
      throw error;
    }
  }

  async updateLastUsed() {
    try {
      const providerRef = db.collection('auth_providers').doc(this.id);
      await providerRef.update({
        lastUsedAt: new Date().toISOString(),
      });
      this.lastUsedAt = new Date();
      return this;
    } catch (error) {
      console.error('Error updating auth provider last used:', error);
      throw error;
    }
  }

  static async findByUserIdAndProvider(userId, provider) {
    try {
      const snapshot = await db.collection('auth_providers')
        .where('userId', '==', userId)
        .where('provider', '==', provider)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new AuthProvider({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding auth provider:', error);
      throw error;
    }
  }

  static async findAllByUserId(userId) {
    try {
      const snapshot = await db.collection('auth_providers')
        .where('userId', '==', userId)
        .get();
      return snapshot.docs.map(doc => new AuthProvider({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding auth providers for user:', error);
      throw error;
    }
  }
}

module.exports = AuthProvider;
