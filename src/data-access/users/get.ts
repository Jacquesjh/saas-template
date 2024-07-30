import {clientDb} from "@/lib/firebase/client-app";
import {User} from "@/models/user";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

export async function getUserById(userId: string) {
  // Get the user date to check if it has a workspace associated to it
  const userDoc = await getDoc(doc(collection(clientDb, "users"), userId));
  const userData = {...userDoc.data(), uid: userId} as User;

  return userData;
}

export async function getUserByAttribute(attribute: keyof User, value: any) {
  // Query the users collection to find the document with the specified attribute and value
  const userQuery = query(
    collection(clientDb, "users"),
    where(attribute, "==", value)
  );
  const querySnapshot = await getDocs(userQuery);

  // If no matching documents are found, return null
  if (querySnapshot.empty) {
    return null;
  }

  // Assuming there's only one matching document, retrieve it
  const userDoc = querySnapshot.docs[0];
  const userData = {...userDoc.data(), uid: userDoc.id} as User;

  return userData;
}
