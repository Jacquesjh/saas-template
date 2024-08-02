import config from "@/config";
import {AuthMiddlewareOptions} from "next-firebase-auth-edge/lib/next/middleware";
import {GetTokensOptions} from "next-firebase-auth-edge/lib/next/tokens";

export const authGetTokensOptions: GetTokensOptions = {
  apiKey: process.env["AUTH_FIREBASE_API_KEY"] as string,

  // This needs to be "__session" to work inside Firebase Hosting
  cookieName: "_session",

  cookieSignatureKeys: [
    process.env["AUTH_FIREBASE_COOKIES_SIGNATURE_KEYS"] as string,
  ],

  serviceAccount: {
    projectId: process.env["AUTH_FIREBASE_PROJECT_ID"] as string,
    clientEmail: process.env["AUTH_FIREBASE_CLIENT_EMAIL"] as string,
    privateKey: process.env["AUTH_FIREBASE_PRIVATE_KEYS"] as string,
  },
};

export const authMiddlewareOptions: AuthMiddlewareOptions = {
  ...authGetTokensOptions,

  loginPath: config.auth.loginPath,
  logoutPath: config.auth.logoutPath,
  // refreshTokenPath: config.auth.refreshTokenPath,
  cookieSerializeOptions: {
    path: "/",
    httpOnly: true,
    secure:
      process.env["AUTH_FIREBASE_COOKIES_SECURE"]?.toLowerCase() === "true", // Set this to true on HTTPS environments
    sameSite: "lax" as const,
    maxAge: 7 * 60 * 60 * 24, // 7 days
  },
  enableMultipleCookies: false,
  debug: process.env.NODE_ENV === "production" ? false : true,
  checkRevoked: true,
};
