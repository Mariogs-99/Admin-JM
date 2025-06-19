// userInterface.ts

export interface User {
  userId: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  active: boolean;
  role?: string; // agregar rol opcional
}

export interface UserDTO {
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  active: boolean;
  role?: string; // agregar rol opcional
}

export interface Role {
  id: number;
  name: string;
}
