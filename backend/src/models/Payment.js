const { db } = require('../config/firebase');

// Payment Model
class Payment {
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId; // User making/receiving payment
    this.type = data.type || 'p2p'; // 'p2p', 'subscription', 'purchase'
    this.amount = data.amount || 0;
    this.currency = data.currency || 'USD';
    this.status = data.status || 'pending'; // 'pending', 'completed', 'failed', 'refunded'
    this.fromUserId = data.fromUserId || null; // For P2P payments
    this.toUserId = data.toUserId || null; // For P2P payments
    this.platformFee = data.platformFee || 0; // 5% platform fee
    this.netAmount = data.netAmount || data.amount; // Amount after fee
    this.stripePaymentIntentId = data.stripePaymentIntentId || null;
    this.stripeTransferId = data.stripeTransferId || null;
    this.description = data.description || '';
    this.metadata = data.metadata || {};
    this.createdAt = new Date();
    this.completedAt = data.completedAt || null;
  }

  async save() {
    try {
      const paymentRef = db.collection('payments').doc(this.id || db.collection('payments').doc().id);
      await paymentRef.set({
        ...this,
        createdAt: this.createdAt.toISOString(),
        completedAt: this.completedAt ? this.completedAt.toISOString() : null,
      });
      this.id = paymentRef.id;
      return this;
    } catch (error) {
      console.error('Error saving payment:', error);
      throw error;
    }
  }

  async update(updates) {
    try {
      const paymentRef = db.collection('payments').doc(this.id);
      await paymentRef.update({
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      Object.assign(this, updates);
      return this;
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async complete() {
    try {
      const now = new Date();
      await this.update({
        status: 'completed',
        completedAt: now.toISOString(),
      });
      this.status = 'completed';
      this.completedAt = now;
      return this;
    } catch (error) {
      console.error('Error completing payment:', error);
      throw error;
    }
  }

  async fail(reason) {
    try {
      await this.update({
        status: 'failed',
        metadata: { ...this.metadata, failureReason: reason },
      });
      this.status = 'failed';
      return this;
    } catch (error) {
      console.error('Error marking payment as failed:', error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const snapshot = await db.collection('payments')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => new Payment({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding payments by user ID:', error);
      throw error;
    }
  }

  static async findByType(type, userId) {
    try {
      const snapshot = await db.collection('payments')
        .where('userId', '==', userId)
        .where('type', '==', type)
        .orderBy('createdAt', 'desc')
        .get();
      return snapshot.docs.map(doc => new Payment({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding payments by type:', error);
      throw error;
    }
  }

  static async findRecentPayments(userId, limit = 10) {
    try {
      const snapshot = await db.collection('payments')
        .where('userId', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();
      return snapshot.docs.map(doc => new Payment({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding recent payments:', error);
      throw error;
    }
  }

  toPublicJSON() {
    return {
      id: this.id,
      userId: this.userId,
      type: this.type,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      fromUserId: this.fromUserId,
      toUserId: this.toUserId,
      platformFee: this.platformFee,
      netAmount: this.netAmount,
      description: this.description,
      createdAt: this.createdAt,
      completedAt: this.completedAt,
    };
  }
}

module.exports = Payment;
