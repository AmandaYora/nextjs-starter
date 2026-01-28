"use server";

import { signOut } from "@/features/auth/server/auth";

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
