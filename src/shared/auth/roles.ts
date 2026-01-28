export const USER_ROLES = ["ADMIN", "USER"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ADMIN_ROLE: UserRole = "ADMIN";
export const DEFAULT_ROLE: UserRole = "USER";

export function isAdminRole(role: UserRole) {
  return role === ADMIN_ROLE;
}
