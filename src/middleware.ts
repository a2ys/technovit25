import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname === "/") {
    return NextResponse.next();
  }

  if (url.pathname.startsWith("/_next") || url.pathname.includes(".")) {
    return NextResponse.next();
  }

  url.pathname = "/";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: "/:path*",
};
