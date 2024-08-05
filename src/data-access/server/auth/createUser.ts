import {adminFirebase} from "@/lib/firebase/server-app";
import {getAuth} from "firebase-admin/auth";

// !
// This will create a new user on Firebase Auth
// Enable the Firebase Extension https://extensions.dev/extensions/rowy/firestore-user-document
// so that it will create a new user document on firestore
export async function server_createUserAuth(
  email: string,
  displayName: string
) {
  const auth = getAuth(adminFirebase);
  const user = await auth.createUser({
    displayName: displayName,
    email: email,
  });

  return user.uid;
}
