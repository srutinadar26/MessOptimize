// app/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
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
const auth = getAuth(app);

export { auth };
export default app;