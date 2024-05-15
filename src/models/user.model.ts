export type UserRole = "admin" | "sub-admin" | "user";

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}
