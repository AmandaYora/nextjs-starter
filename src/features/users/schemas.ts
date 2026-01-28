import { z } from "zod";
import { USER_ROLES, type UserRole } from "@/shared/auth/roles";

const baseUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(USER_ROLES),
});

export const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8),
});

export const updateUserSchema = baseUserSchema
  .extend({
    id: z.string().min(1),
    password: z.string().min(8).optional(),
  })
  .refine(
    (data) => (data.password ? data.password.length >= 8 : true),
    "Password must be at least 8 characters.",
  );

export const deleteUserSchema = z.object({
  id: z.string().min(1),
});

export const userQuerySchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  q: z.string().optional(),
  sort: z.enum(["createdAt", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
export type UserQueryInput = z.infer<typeof userQuerySchema>;
export type UserRoleInput = UserRole;
