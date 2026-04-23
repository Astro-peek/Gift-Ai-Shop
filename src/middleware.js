import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

// Routes that require authentication
const PROTECTED = ["/admin", "/orders"];

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const path = req.nextUrl.pathname;
  if (path.startsWith("/admin/login")) return res;

  const isProtected = PROTECTED.some((p) => path.startsWith(p));

  // If accessing a protected route without a session, redirect to login
  if (isProtected && !session) {
    const isSpecialAdmin = path.startsWith("/admin");
    const loginUrl = new URL(isSpecialAdmin ? "/admin/login" : "/login", req.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*"],
};
