export interface CredentialsModel {
  email: string;
  password: string;
}

export interface RegistrationModel {
  username: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  bio: string | null;
}

export interface RefreshTokenRequestModel {
  token: string;
}

export interface AuthResponseModel {
  userId: number;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface Role {
  id: number;
  role: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface UserProfileModel {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  accountLocked: boolean;
  lockReason: string | null;
  lockInstant: string | null;
  roles: Role[];
}

export enum UserRole {
  USER = 'USER',
  DEVELOPER = 'DEVELOPER',
  ADMIN = 'ADMIN'
}
