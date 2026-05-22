export type RegisterResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export type LoginResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type LogoutResponse = void;

export type RefreshResponse = {
  accessToken: string;
  refreshToken: string;
};

export type GoogleAuthResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type GetUserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
};
