import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isPublicPage = req.nextUrl.pathname === "/";

  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
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
    "/dashboard/:path*",
    "/projects/:path*",
    "/generate/:path*",
    "/settings/:path*",
    "/help/:path*",
    "/login",
  ],
};
