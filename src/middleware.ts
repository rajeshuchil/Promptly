import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isPublicPage = req.nextUrl.pathname === "/";

  if (isLoginPage) {
    if (isLoggedIn) {
      // Authenticated users skip login → go straight to Build workspace
      return NextResponse.redirect(new URL("/build", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (isPublicPage) {
    return NextResponse.next();
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/build/:path*",
    "/dashboard/:path*",
    "/projects/:path*",
    "/generate/:path*",
    "/templates/:path*",
    "/settings/:path*",
    "/help/:path*",
    "/login",
  ],
};
