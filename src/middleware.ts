import {NextRequest, NextResponse} from "next/server";
import {authMiddleware} from "next-firebase-auth-edge";

import {authMiddlewareOptions} from "./lib/auth-config";

// const PUBLIC_PATHS: string[] = [];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    ...authMiddlewareOptions,
    handleValidToken: async ({token, decodedToken}, headers) => {
      // Authenticated user should not be able to access /login, /register and /reset-password routes

      return NextResponse.next({
        request: {
          headers,
        },
      });
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
    // "/api/refresh",
  ],
};
