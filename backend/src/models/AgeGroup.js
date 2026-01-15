const { db } = require('../config/firebase');

// Age Group Model - Define age-specific configurations
class AgeGroup {
  constructor(data) {
    this.id = data.id;
    this.name = data.name || ''; // '2-5', '5-12', '12-18', '18-50', '50+'
    this.displayName = data.displayName || '';
    this.minAge = data.minAge;
    this.maxAge = data.maxAge;
    this.features = data.features || {};
    this.uiSettings = data.uiSettings || {};
    this.restrictions = data.restrictions || {};
    this.parentControlsRequired = data.parentControlsRequired || false;
    this.createdAt = new Date();
  }

  async save() {
    try {
      const ageGroupRef = db.collection('age_groups').doc(this.id || db.collection('age_groups').doc().id);
      await ageGroupRef.set({
        ...this,
        createdAt: this.createdAt.toISOString(),
      });
      this.id = ageGroupRef.id;
      return this;
    } catch (error) {
      console.error('Error saving age group:', error);
      throw error;
    }
  }

  static async findByName(name) {
    try {
      const snapshot = await db.collection('age_groups')
        .where('name', '==', name)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new AgeGroup({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding age group:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const snapshot = await db.collection('age_groups').get();
      return snapshot.docs.map(doc => new AgeGroup({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding all age groups:', error);
      throw error;
    }
  }

  isAppropriateForAge(age) {
    return age >= this.minAge && age <= this.maxAge;
  }

  hasFeature(feature) {
    return this.features[feature] || false;
  }

  getUIRequirement(key) {
    return this.uiSettings[key] || null;
  }

  toPublicJSON() {
    return {
      id: this.id,
      name: this.name,
      displayName: this.displayName,
      minAge: this.minAge,
      maxAge: this.maxAge,
      features: this.features,
      uiSettings: this.uiSettings,
      restrictions: this.restrictions,
      parentControlsRequired: this.parentControlsRequired,
      createdAt: this.createdAt,
    };
  }
}

module.exports = AgeGroup;
