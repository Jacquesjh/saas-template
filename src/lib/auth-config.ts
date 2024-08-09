import config from "@/config";
import {AuthMiddlewareOptions} from "next-firebase-auth-edge/lib/next/middleware";
import {GetTokensOptions} from "next-firebase-auth-edge/lib/next/tokens";
import {adminServiceAccount} from "./firebase/server-app";

export const authGetTokensOptions: GetTokensOptions = {
  apiKey: process.env["NEXT_PUBLIC_FIREBASE_API_KEY"] as string,

  // This needs to be "__session" to work inside Firebase Hosting
  cookieName: "__session",

  cookieSignatureKeys: [process.env["AUTH_COOKIES_SIGNATURE_KEYS"] as string],

  serviceAccount: adminServiceAccount,
};

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  ...authGetTokensOptions,

  loginPath: config.auth.loginPath,
  logoutPath: config.auth.logoutPath,
  // refreshTokenPath: "/api/refresh",
  refreshTokenPath: config.auth.refreshTokenPath,
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set this to true on HTTPS environments
    sameSite: "lax" as const,
    maxAge: 7 * 60 * 60 * 24, // 7 days
  },
  enableMultipleCookies: false,
  debug: process.env.NODE_ENV !== "production",
  // checkRevoked: true,
};
