export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: 'ADMIN' | 'USER'; // 👈 tipos explícitos
}
