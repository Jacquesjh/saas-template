import {clientDb} from "@/lib/firebase/client-app";
import {User} from "@/models/user";
import {doc, updateDoc} from "firebase/firestore";

export async function updateUser(uid: string, data: Partial<User>) {
  // Reference to the user document in the "users" collection
  const userRef = doc(clientDb, "users", uid);

  // Update the user document with the provided partial data
  await updateDoc(userRef, data);
}
