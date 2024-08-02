import * as admin from "firebase-admin";
import {cert, getApps} from "firebase-admin/app";

function createApp() {
  const apps = getApps();

  if (apps.length > 0) {
    return apps[0]!;
  }

  if (process.env.NODE_ENV === "development") {
    // For firestore
    process.env["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080";

    // For auth
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099";

    process.env[
      "FIREBASE_DATABASE_URL"
    ] = `http://${process.env["FIRESTORE_EMULATOR_HOST"]}`;
  }

  return admin.initializeApp({
    credential: cert({
      projectId: process.env["AUTH_FIREBASE_PROJECT_ID"] as string,
      clientEmail: process.env["AUTH_FIREBASE_CLIENT_EMAIL"] as string,
      privateKey: process.env["AUTH_FIREBASE_PRIVATE_KEYS"] as string,
    }),
    databaseURL: process.env["FIREBASE_DATABASE_URL"] || undefined,
  });
}

const adminFirebase = createApp();
const adminAuth = admin.auth(adminFirebase);
const adminDb = admin.firestore(adminFirebase);

export {adminAuth, adminDb};
