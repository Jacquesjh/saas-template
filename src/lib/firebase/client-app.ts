// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from "firebase/app";
import {getAnalytics, isSupported} from "firebase/analytics";
import {connectAuthEmulator, getAuth} from "firebase/auth";
import {connectFirestoreEmulator, getFirestore} from "firebase/firestore";

let firebaseConfig = {};

// This is all safe to expose, regardless of production or developtment envs
if (process.env.NODE_ENV === "production") {
  firebaseConfig = {
    apiKey: "AIzaSyDhPOuhIfGz-avDy2ldIjZfJMHvZTohFzI",
    authDomain: "saas-template-739eb.firebaseapp.com",
    projectId: "saas-template-739eb",
    storageBucket: "saas-template-739eb.appspot.com",
    messagingSenderId: "919204756186",
    appId: "1:919204756186:web:9d28d47cec8a8c7c3183e3",
    measurementId: "G-JE6HW1WGDN",
  };
} else {
  firebaseConfig = {
    apiKey: "AIzaSyDhPOuhIfGz-avDy2ldIjZfJMHvZTohFzI",
    authDomain: "saas-template-739eb.firebaseapp.com",
    projectId: "saas-template-739eb",
    storageBucket: "saas-template-739eb.appspot.com",
    messagingSenderId: "919204756186",
    appId: "1:919204756186:web:9d28d47cec8a8c7c3183e3",
    measurementId: "G-JE6HW1WGDN",
  };
}

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const clientAuth = getAuth(app);
const clientDb = getFirestore(app);
const clientAnalytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);

export {clientAnalytics, clientAuth, clientDb};

// Emulator -> firebase emulators:start
if (process.env.NODE_ENV === "development") {
  console.log("Connecting Firebase Emulators...");

  connectAuthEmulator(clientAuth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(clientDb, "127.0.0.1", 8080);
}
