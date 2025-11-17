export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  email: string;
  password: string;
}

export interface User {
  userId: string;
  userName: string;
  email: string;
  roleId: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
