import {clientDb} from "@/lib/firebase/client-app";
import {User} from "@/models/user";
import {collection, doc, getDoc} from "firebase/firestore";

export async function client_getUserById(userId: string) {
  // Get the user document reference
  const userDocRef = doc(collection(clientDb, "users"), userId);

  // Fetch the document
  const userDoc = await getDoc(userDocRef);

  // Check if the document exists
  if (!userDoc.exists()) {
    return null;
  }

  // Extract and return the user data
  return userDoc.data() as User;
}
