import { type UserRole } from "@/shared/auth/roles";

export type UserListItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
};

export type UsersResponse = {
  items: UserListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
