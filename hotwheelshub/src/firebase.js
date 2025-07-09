// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDm4vXhtbMr-EFph0GRXvtkWWZIHf0ip8o",
  authDomain: "hotwheelshub-45992.firebaseapp.com",
  projectId: "hotwheelshub-45992",
  storageBucket: "hotwheelshub-45992.appspot.com",
  messagingSenderId: "748470311385",
  appId: "1:748470311385:web:cceab4918ce60abe4621c8",
  measurementId: "G-Y3HTQER2PQ",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ Export Firestore
