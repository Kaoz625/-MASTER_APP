// Admin Role Model - Define admin permissions and roles
class AdminRole {
  constructor(data) {
    this.userId = data.userId;
    this.role = data.role || 'user'; // 'user', 'moderator', 'admin', 'super-admin'
    this.permissions = data.permissions || this.getDefaultPermissions(this.role);
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isActive = data.isActive !== false;
  }

  getDefaultPermissions(role) {
    const permissionSets = {
      'moderator': [
        'content:moderate',
        'user:view',
        'comments:moderate',
      ],
      'admin': [
        'user:read',
        'user:write',
        'user:delete',
        'user:suspend',
        'analytics:view',
        'payments:view',
        'content:moderate',
        'settings:view',
      ],
      'super-admin': [
        'user:read',
        'user:write',
        'user:delete',
        'user:suspend',
        'analytics:view',
        'analytics:export',
        'payments:view',
        'payments:refund',
        'content:moderate',
        'settings:view',
        'settings:configure',
        'admin:manage',
      ],
      'user': [],
    };

    return permissionSets[role] || [];
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }

  hasAnyPermission(permissions) {
    return permissions.some(p => this.permissions.includes(p));
  }

  hasAllPermissions(permissions) {
    return permissions.every(p => this.permissions.includes(p));
  }

  addPermission(permission) {
    if (!this.permissions.includes(permission)) {
      this.permissions.push(permission);
    }
  }

  removePermission(permission) {
    this.permissions = this.permissions.filter(p => p !== permission);
  }

  updateRole(newRole) {
    this.role = newRole;
    this.permissions = this.getDefaultPermissions(newRole);
    this.updatedAt = new Date();
  }

  toPublicJSON() {
    return {
      userId: this.userId,
      role: this.role,
      permissions: this.permissions,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = AdminRole;
