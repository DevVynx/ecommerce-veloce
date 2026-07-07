import { jwtDecode } from "jwt-decode";
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
    const accessToken = cookieData.get("accessToken");
    const refreshToken = cookieData.get("refreshToken");
    const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
    const isAdminPath = pathname.startsWith("/admin");

    if (isAdminPath) {
      if (!refreshToken) {
        const loginUrl = new URL("/login", req.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (accessToken) {
        const decoded = jwtDecode(accessToken.value) as { userId: string; role: string };
        if (decoded.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }

      return NextResponse.next();
    }

    if (isProtected && !refreshToken) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }
}
