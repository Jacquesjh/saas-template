import {adminDb} from "@/lib/firebase/server-app";
import {User} from "@/models/user";

export async function server_getUserById(userId: string) {
  // Get the user document reference
  const userDocRef = adminDb.collection("users").doc(userId);

  // Fetch the document
  const userDoc = await userDocRef.get();

  // Check if the document exists
  if (!userDoc.exists) {
    return null;
  }

  // Extract and return the user data
  return userDoc.data() as User;
}

export async function server_getUserByAttribute(
  attribute: keyof User,
  value: any
) {
  // Query the users collection to find the document with the specified attribute and value
  const userQuery = adminDb.collection("users").where(attribute, "==", value);
  const querySnapshot = await userQuery.get();

  // If no matching documents are found, return null
  if (querySnapshot.empty) {
    return null;
  }

  // Assuming there's only one matching document, retrieve it
  const userDoc = querySnapshot.docs[0];
  const userData = {...userDoc.data(), uid: userDoc.id} as User;

  return userData;
}
