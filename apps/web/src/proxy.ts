import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

const protectedPaths = ["/account", "/wishlist"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRouter = pathname.startsWith("/api");

  if (!isApiRouter) {
    const { pathname } = req.nextUrl;
    const cookieData = await cookies();
    const refreshToken = cookieData.get("refreshToken");
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

    if (isProtected && !refreshToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);

      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}
