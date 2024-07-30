import {NextRequest} from "next/server";
import {authMiddleware} from "next-firebase-auth-edge";

import {authMiddlewareOptions} from "./lib/auth-config";

export async function middleware(request: NextRequest) {
  return authMiddleware(request, {
    ...authMiddlewareOptions,
  });
}

export const config = {
  matcher: [
    "/api/auth/login",
    "/api/auth/logout",
    "/",
    "/((?!_next|favicon.ico|api|.*\\.).*)",
  ],
};
