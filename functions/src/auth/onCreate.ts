import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// Function triggered when a new user is created
export const createUserDocument = functions.auth
  .user()
  .onCreate(async (user) => {
    const userData = JSON.parse(JSON.stringify(user));

    // Create the user's document
    await admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set(userData, {merge: true});

    return null;
  });
