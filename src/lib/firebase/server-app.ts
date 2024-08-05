import {AppOptions, cert, getApps, initializeApp} from "firebase-admin/app";

function createApp() {
  const apps = getApps();

  if (apps.length > 0) {
    console.log("Firebase app already initialized");
    return apps[0]!;
  }

  const options: AppOptions = {
    credential: cert({
      projectId: process.env["AUTH_PROJECT_ID"] as string,
      clientEmail: process.env["AUTH_CLIENT_EMAIL"] as string,
      privateKey: process.env["AUTH_PRIVATE_KEYS"]!.replace(/\\n/g, "\n")!,
    }),
  };

  if (process.env.NODE_ENV === "test") {
    // For firestore
    process.env["FIRESTORE_EMULATOR_HOST"] = "127.0.0.1:8080";

    // For auth
    process.env["FIREBASE_AUTH_EMULATOR_HOST"] = "127.0.0.1:9099";

    process.env["FIREBASE_DATABASE_URL"] = "http://127.0.0.1:8080";

    options.databaseURL = "http://127.0.0.1:8080";
  }

  try {
    return initializeApp(options);
  } catch (error) {
    console.error("Error initializing Firebase app:", error);
    throw error;
  }
}

export const adminFirebase = createApp();
