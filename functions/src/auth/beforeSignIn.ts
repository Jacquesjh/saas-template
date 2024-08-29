import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

// Function triggered before a user signs in
export const updateLastSignInTime = functions.auth
  .user()
  .beforeSignIn(async (user, context) => {
    const data = {
      lastSignInTime: context.timestamp,
    };

    // Update the user's document
    await admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set(data, {merge: true});
  });
