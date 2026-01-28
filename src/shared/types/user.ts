import { type UserRole } from "@/shared/auth/roles";

export type AppUserIdentity = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};
