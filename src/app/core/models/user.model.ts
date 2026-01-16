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

export interface AuthResponseModel {
  userId: number;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  refreshExpiresIn: number;
}

export interface RefreshTokenResponseModel {

  userId: number;
  token: string;
}
