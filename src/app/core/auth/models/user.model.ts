// src/app/core/auth/models/user.model.ts
export enum Role {
  ADMIN = 'ADMIN',
  BROKER = 'BROKER',
  AGENT = 'AGENT',
  ASSISTANT = 'ASSISTANT'
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
  role: Role;
  status: UserStatus;
  createdDate: string;
  updatedDate: string;
}
