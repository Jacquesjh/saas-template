import {adminFirebase} from "@/lib/firebase/server-app";
import {User} from "@/models/user";
import {getFirestore} from "firebase-admin/firestore";

export async function server_updateUser(uid: string, data: Partial<User>) {
  const db = getFirestore(adminFirebase);
  // Reference to the user document in the "users" collection
  const userDoc = db.collection("users").doc(uid);

  // Update the user document with the provided partial data
  await userDoc.update(data);
}
