// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAKDqtyk6sUrCijuP8HRLa5ni_IPg-yLBk",
  authDomain: "todo-application-ab782.firebaseapp.com",
  projectId: "todo-application-ab782",
  storageBucket: "todo-application-ab782.firebasestorage.app",
  messagingSenderId: "27243997926",
  appId: "1:27243997926:web:0d59f6cf40d215e9fca927"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };