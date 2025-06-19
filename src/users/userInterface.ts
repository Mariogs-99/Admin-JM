export interface User {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  active: boolean;
}

export interface UserDTO {
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  active: boolean;
}
