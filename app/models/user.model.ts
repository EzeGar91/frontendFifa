export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
