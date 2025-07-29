// src/app/core/auth/models/user.model.ts
export enum Role {
  ADMIN = 'ROLE_ADMIN',
  BROKER = 'ROLE_BROKER',
  AGENT = 'ROLE_AGENT',
  ASSISTANT = 'ROLE_ASSISTANT'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

// Updated User interface - roles is now string[] instead of Role[]
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];  // CHANGED: from Role[] to string[]
  status: string;   // CHANGED: from UserStatus to string
  createdDate: string;
  updatedDate: string;
}

// Helper class for role operations with the new string format
export class UserHelper {
  static hasRole(user: User, role: Role): boolean {
    return user.roles.includes(role);
  }

  static isAdmin(user: User): boolean {
    return UserHelper.hasRole(user, Role.ADMIN);
  }

  static isBroker(user: User): boolean {
    return UserHelper.hasRole(user, Role.BROKER);
  }

  static isAgent(user: User): boolean {
    return UserHelper.hasRole(user, Role.AGENT);
  }

  static isAssistant(user: User): boolean {
    return UserHelper.hasRole(user, Role.ASSISTANT);
  }

  static isSupervisor(user: User): boolean {
    return UserHelper.isAdmin(user) || UserHelper.isBroker(user);
  }

  static getDisplayRoles(user: User): string[] {
    return user.roles.map(role => role.replace('ROLE_', ''));
  }

  static getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  static getInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  static isActive(user: User): boolean {
    return user.status === UserStatus.ACTIVE;
  }
}
