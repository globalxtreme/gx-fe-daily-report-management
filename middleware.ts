import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5050/api/v1";

  if (!token) {
    return NextResponse.redirect(`${apiUrl}/oauth/redirect`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
