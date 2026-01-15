const { db } = require('../config/firebase');

// Parent-Child Relationship Model
class ParentChild {
  constructor(data) {
    this.id = data.id;
    this.parentId = data.parentId;
    this.childId = data.childId;
    this.relationship = data.relationship || 'parent';
    this.status = data.status || 'active'; // 'active', 'pending', 'suspended', 'terminated'
    this.permissions = data.permissions || {
      canViewActivity: true,
      canSetLimits: true,
      canApprovePurchases: true,
      canLockAccount: true,
      dailyTimeLimit: null,
      approvedApps: [],
    };
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  async save() {
    try {
      const relationshipRef = db.collection('parent_child').doc(this.id || db.collection('parent_child').doc().id);
      await relationshipRef.set({
        ...this,
        createdAt: this.createdAt.toISOString(),
        updatedAt: this.updatedAt.toISOString(),
      });
      this.id = relationshipRef.id;
      return this;
    } catch (error) {
      console.error('Error saving parent-child relationship:', error);
      throw error;
    }
  }

  async updatePermissions(permissions) {
    try {
      const relationshipRef = db.collection('parent_child').doc(this.id);
      await relationshipRef.update({
        permissions,
        updatedAt: new Date().toISOString(),
      });
      this.permissions = { ...this.permissions, ...permissions };
      this.updatedAt = new Date();
      return this;
    } catch (error) {
      console.error('Error updating permissions:', error);
      throw error;
    }
  }

  async suspend() {
    try {
      const relationshipRef = db.collection('parent_child').doc(this.id);
      await relationshipRef.update({
        status: 'suspended',
        updatedAt: new Date().toISOString(),
      });
      this.status = 'suspended';
      this.updatedAt = new Date();
      return this;
    } catch (error) {
      console.error('Error suspending relationship:', error);
      throw error;
    }
  }

  static async findByParentId(parentId) {
    try {
      const snapshot = await db.collection('parent_child')
        .where('parentId', '==', parentId)
        .where('status', '==', 'active')
        .get();
      return snapshot.docs.map(doc => new ParentChild({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error finding children for parent:', error);
      throw error;
    }
  }

  static async findByChildId(childId) {
    try {
      const snapshot = await db.collection('parent_child')
        .where('childId', '==', childId)
        .where('status', '==', 'active')
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new ParentChild({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding parent for child:', error);
      throw error;
    }
  }

  static async findRelationship(parentId, childId) {
    try {
      const snapshot = await db.collection('parent_child')
        .where('parentId', '==', parentId)
        .where('childId', '==', childId)
        .limit(1)
        .get();
      if (snapshot.empty) return null;
      const doc = snapshot.docs[0];
      return new ParentChild({ id: doc.id, ...doc.data() });
    } catch (error) {
      console.error('Error finding parent-child relationship:', error);
      throw error;
    }
  }

  toPublicJSON() {
    return {
      id: this.id,
      relationship: this.relationship,
      status: this.status,
      permissions: this.permissions,
      createdAt: this.createdAt,
    };
  }
}

module.exports = ParentChild;
