export type UserRole = 'ADMIN' | 'CLIENT' | 'COORDINATOR' | 'FINANCE' | 'OPERATIONS';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}