import * as admin from "firebase-admin";
import {cert, getApps} from "firebase-admin/app";

function createApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0]!;
  }

  return admin.initializeApp({
    credential: cert({
      projectId: process.env["AUTH_FIREBASE_PROJECT_ID"] as string,
      clientEmail: process.env["AUTH_FIREBASE_CLIENT_EMAIL"] as string,
      privateKey: process.env["AUTH_FIREBASE_PRIVATE_KEYS"] as string,
    }),
  });
}

const adminFirebase = createApp();
const adminAuth = admin.auth(adminFirebase);

export {adminAuth};
