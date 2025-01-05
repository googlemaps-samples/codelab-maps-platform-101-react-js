// Import the functions you need from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Add Firestore import
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYGCeiwywP5LveenGYeDH6GfR181c2st0",
  authDomain: "bootwatcher-82f5d.firebaseapp.com",
  projectId: "bootwatcher-82f5d",
  storageBucket: "bootwatcher-82f5d.firebasestorage.app",
  messagingSenderId: "1007091338240",
  appId: "1:1007091338240:web:f8d830cc8a4e05b3e55ce5",
  measurementId: "G-DKZL9FRTYD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);  // Add Firestore initialization

// Export db to be used in other files
export { db };  // Export db

