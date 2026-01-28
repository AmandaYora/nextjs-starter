import { redirect } from "next/navigation";
import { auth } from "@/features/auth/server/auth";
import { DASHBOARD_ROUTE, LOGIN_ROUTE } from "@/shared/constants/routes";

export default async function IndexPage() {
  const session = await auth();
  redirect(session?.user ? DASHBOARD_ROUTE : LOGIN_ROUTE);
}
