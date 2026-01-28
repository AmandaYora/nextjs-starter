import { auth } from "@/features/auth/server/auth";
import { AppError } from "@/shared/lib/server-error";
import { isAdminRole } from "@/shared/auth/roles";

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new AppError("Unauthorized", { statusCode: 401 });
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (!isAdminRole(session.user.role)) {
    throw new AppError("Admins only", { statusCode: 403 });
  }
  return session;
}
