"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/db/client";
import { requireAdmin } from "@/features/auth/permissions";
import {
  createUserSchema,
  deleteUserSchema,
  updateUserSchema,
  type CreateUserInput,
  type DeleteUserInput,
  type UpdateUserInput,
} from "@/features/users/schemas";
import { handleServerError, successState, type ActionState } from "@/shared/lib/server-error";
import { hashPassword } from "@/features/auth/utils/password";
import { recordAuditLog } from "@/shared/lib/audit-log";

const USERS_PATH = "/dashboard/users";

function handlePrismaError(error: unknown, fallbackMessage: string): ActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return {
      status: "error",
      message: "Email already exists.",
    };
  }

  return handleServerError({
    error,
    context: "usersAction",
    fallbackMessage,
  });
}

export async function createUserAction(input: CreateUserInput): Promise<ActionState> {
  try {
    const session = await requireAdmin();
    const parsed = createUserSchema.safeParse(input);

    if (!parsed.success) {
      return {
        status: "error",
        message: "Please review the form.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const user = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role,
        passwordHash: await hashPassword(parsed.data.password),
      },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "USER_CREATED",
      targetId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    revalidatePath(USERS_PATH);
    return successState("User created.");
  } catch (error) {
    return handlePrismaError(error, "Unable to create the user.");
  }
}

export async function updateUserAction(input: UpdateUserInput): Promise<ActionState> {
  try {
    const session = await requireAdmin();
    const parsed = updateUserSchema.safeParse(input);

    if (!parsed.success) {
      return {
        status: "error",
        message: "Please review the form.",
        fieldErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const data: Prisma.UserUpdateInput = {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
    };

    if (parsed.data.password) {
      data.passwordHash = await hashPassword(parsed.data.password);
    }

    const user = await prisma.user.update({
      where: { id: parsed.data.id },
      data,
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "USER_UPDATED",
      targetId: user.id,
      metadata: {
        email: user.email,
        role: user.role,
        fields: Object.keys(data),
      },
    });

    revalidatePath(USERS_PATH);
    return successState("User updated.");
  } catch (error) {
    return handlePrismaError(error, "Unable to update the user.");
  }
}

export async function deleteUserAction(input: DeleteUserInput): Promise<ActionState> {
  try {
    const session = await requireAdmin();
    const parsed = deleteUserSchema.safeParse(input);

    if (!parsed.success) {
      return {
        status: "error",
        message: "Invalid user.",
      };
    }

    const user = await prisma.user.delete({
      where: { id: parsed.data.id },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "USER_DELETED",
      targetId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    revalidatePath(USERS_PATH);
    return successState("User deleted.");
  } catch (error) {
    return handlePrismaError(error, "Unable to delete the user.");
  }
}
