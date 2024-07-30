import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as signOutFirebase,
} from "firebase/auth";
import {clientAuth} from "./firebase/client-app";
import config from "@/config";

export async function signInWithGooglePopUp() {
  const provider = new GoogleAuthProvider();

  // provider.addScope("https://www.googleapis.com/auth/calendar.readonly");

  // Pops up a signin window. The user will either be a new user or an existing one
  const result = await signInWithPopup(clientAuth, provider);

  // The signed-in user info.
  const idToken = await result.user.getIdToken();

  // Sets authenticated browser cookies
  await fetch(config.auth.loginUrl, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  return result;
}

export async function signInEmailPassword(email: string, password: string) {
  await signInWithEmailAndPassword(clientAuth, email, password);
}

export async function signOut() {
  await signOutFirebase(clientAuth);

  // Removes authenticated cookies
  await fetch(config.auth.logoutUrl, {
    method: "GET",
  });
}
