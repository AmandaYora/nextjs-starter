import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/features/auth/server/auth";
import {
  DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  authRoutes,
  protectedPrefixes,
} from "@/shared/constants/routes";

export default auth((req: NextRequest) => {
  const isAuthRoute = authRoutes.has(req.nextUrl.pathname);
  const isProtected = protectedPrefixes.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (!req.auth && isProtected) {
    const loginUrl = new URL(LOGIN_ROUTE, req.nextUrl.origin);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (req.auth && isAuthRoute) {
    return NextResponse.redirect(new URL(DASHBOARD_ROUTE, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
