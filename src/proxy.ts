import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Public routes
  const publicRoutes = ["/", "/login", "/signup", "/demo"];
  if (publicRoutes.includes(path) || path.startsWith("/api/auth/") || path.startsWith("/demo")) {
    return NextResponse.next();
  }

  // API routes handle their own auth
  if (path.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Protected routes — check for session cookie
  const session = request.cookies.get("kidspark_session");
  if (!session?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
