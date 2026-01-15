const { db } = require('../config/firebase');

// Referral Model - For tracking affiliate codes
class Referral {
  constructor(data) {
    this.id = data.id;
    this.referralCode = data.referralCode || '';
    this.referredById = data.referredById || null; // User who created the code
    this.referredToId = data.referredToId || null; // User who used the code
    this.clicks = data.clicks || 0; // Number of times link was clicked
    this.conversions = data.conversions || 0; // Number of users who signed up
    this.conversionRate = data.conversionRate || 0; // conversions/clicks * 100
    this.totalRevenue = data.totalRevenue || 0; // Total revenue from referrals
    this.isActive = data.isActive !== false;
    this.createdAt = new Date();
    this.lastConversionAt = data.lastConversionAt || null;
  }

  async save() {
    try {
      const referralRef = db.collection('referrals').doc(this.id || db.collection('referrals').doc().id);
      await referralRef.set({
        ...this,
        createdAt: this.createdAt.toISOString(),
      });
      this.id = referralRef.id;
      return this;
    } catch (error) {
      console.error('Error saving referral:', error);
      throw error;
    }
  }

  async trackClick(ipAddress) {
    try {
      await db.collection('referrals').doc(this.id).update({
        clicks: firebase.firestore.FieldValue.increment(1),
      });
      this.clicks += 1;
      return this;
    } catch (error) {
      console.error('Error tracking referral click:', error);
      throw error;
    }
  }

  async recordConversion(referredUserId, purchaseAmount) {
    try {
      const now = new Date();
      await db.collection('referrals').doc(this.id).update({
        conversions: firebase.firestore.FieldValue.increment(1),
        referredToId: referredUserId,
        lastConversionAt: now.toISOString(),
        totalRevenue: firebase.firestore.FieldValue.increment(purchaseAmount),
      });
      this.conversions += 1;
      this.referredToId = referredUserId;
      this.lastConversionAt = now;
      this.totalRevenue += purchaseAmount;

      // Calculate conversion rate
      if (this.clicks > 0) {
        this.conversionRate = (this.conversions / this.clicks) * 100;
      }

      return this;
    } catch (error) {
      console.error('Error recording conversion:', error);
      throw error;
    }
  }

  static async findByReferralCode(code) {
    try {
      const snapshot = await db.collection('referrals')
        .where('referralCode', '==', code)
        .where('isActive', '==', true)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new Referral({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding referral by code:', error);
      throw error;
    }
  }

  static async findByReferrer(userId) {
    try {
      const snapshot = await db.collection('referrals')
        .where('referredById', '==', userId)
        .where('isActive', '==', true)
        .get();
      return snapshot.docs.map(doc => new Referral({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding referrals for user:', error);
      throw error;
    }
  }

  toPublicJSON() {
    return {
      id: this.id,
      referralCode: this.referralCode,
      referredById: this.referredById,
      referredToId: this.referredToId,
      clicks: this.clicks,
      conversions: this.conversions,
      conversionRate: this.conversionRate,
      totalRevenue: this.totalRevenue,
      isActive: this.isActive,
      createdAt: this.createdAt,
      lastConversionAt: this.lastConversionAt,
    };
  }
}

module.exports = Referral;
