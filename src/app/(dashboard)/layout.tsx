import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/features/auth/server/auth";
import { DashboardShell } from "@/app/(dashboard)/_components/dashboard-shell";
import { LOGIN_ROUTE } from "@/shared/constants/routes";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();
  if (!session?.user) {
    redirect(LOGIN_ROUTE);
  }
  return <DashboardShell user={session.user}>{children}</DashboardShell>;
}
