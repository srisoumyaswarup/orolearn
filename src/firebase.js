import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your exact credentials from your console screenshot
const firebaseConfig = {
  apiKey: "AIzaSyAKSikaTTD1wMrtGrbiuqpz34bhGvqUvMU",
  authDomain: "orolearn.firebaseapp.com",
  projectId: "orolearn",
  storageBucket: "orolearn.firebasestorage.app",
  messagingSenderId: "213612149398",
  appId: "1:213612149398:web:4acb00e25837dba956e2cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export these modules so we can import them into your Onboarding and Dashboard files
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
