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

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  status: UserStatus;
  createdDate: string;
  updatedDate: string;
}
