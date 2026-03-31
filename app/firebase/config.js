// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCOo7apl-4uilhSCLMr7sbQhrSybgqzzjI",
  authDomain: "messoptimize-92f38.firebaseapp.com",
  projectId: "messoptimize-92f38",
  storageBucket: "messoptimize-92f38.firebasestorage.app",
  messagingSenderId: "351126499260",
  appId: "1:351126499260:web:49b212231dea8f99a305b9",
  measurementId: "G-1D7Q6S6WMD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;