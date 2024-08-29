import {
  getAdditionalUserInfo,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase,
  UserCredential,
} from "firebase/auth";
import {clientAuth} from "./firebase/client-app";
import config from "@/config";
import {logAnalyticsEvent} from "./analytics";

async function handleAuthResult(result: UserCredential) {
  const additionalUserInfo = getAdditionalUserInfo(result);
  const isNewUser = additionalUserInfo?.isNewUser;

  await logAnalyticsEvent(isNewUser ? "sign_up" : "login", {
    method: result.providerId,
  });

  const idToken = await result.user.getIdToken();

  // Sets authenticated browser cookies
  await fetch(config.auth.loginPath, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return result;
}

export async function signInWithGooglePopUp() {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(clientAuth, provider);

  return handleAuthResult(result);
}

export async function signInEmailPassword(email: string, password: string) {
  const result = await signInWithEmailAndPassword(clientAuth, email, password);
  return handleAuthResult(result);
}

export async function signOut() {
  await signOutFirebase(clientAuth);

  // Removes authenticated cookies
  await fetch(config.auth.logoutPath, {
    method: "GET",
  });
}
