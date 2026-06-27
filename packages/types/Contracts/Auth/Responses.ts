export type UserRole = "USER" | "ADMIN";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
};

export type RegisterResponse = {
  user: UserProfile;
};

export type GoogleAuthResponse = {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
};

export type LoginResponse = {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
};

export type LogoutResponse = void;

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type GetUserResponse = {
  user: UserProfile | null;
};
