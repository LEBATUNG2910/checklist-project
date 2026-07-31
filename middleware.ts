// middleware.ts — đặt ở ROOT của project (ngang với app/)
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = [
  "/login",
  "/api/auth/google",
  "/api/auth/callback",
  "/api/auth/logout",
  "/api/auth/login",
  "/api/auth/signup",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Cho phép static files và public routes qua
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/public") ||
    PUBLIC_ROUTES.some((r) => pathname.startsWith(r))
  ) {
    return NextResponse.next();
  }

  // Kiểm tra session cookie
  const session = req.cookies.get("workai_session")?.value;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};