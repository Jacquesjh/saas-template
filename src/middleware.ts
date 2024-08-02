import {NextRequest} from "next/server";
import {authMiddleware} from "next-firebase-auth-edge";

import {authMiddlewareOptions} from "./lib/auth-config";

// const PUBLIC_PATHS: string[] = [];

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    ...authMiddlewareOptions,
  });
}

export const config = {
  matcher: [
    "/",
    "/((?!_next|favicon.ico|__/auth|__/firebase|api|.*\\.).*)",
    "/api/login",
    "/api/logout",
  ],
};
