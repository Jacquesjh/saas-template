import {adminDb} from "@/lib/firebase/server-app";
import {User} from "@/models/user";

export async function server_updateUser(uid: string, data: Partial<User>) {
  // Reference to the user document in the "users" collection
  const userDoc = adminDb.collection("users").doc(uid);

  // Update the user document with the provided partial data
  await userDoc.update(data);
}
