import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdf1PuLyNE0X9rBFEFOnkMxHP46uOovcI",
  authDomain: "social-media-app-4bea8.firebaseapp.com",
  projectId: "social-media-app-4bea8",
  storageBucket: "social-media-app-4bea8.firebasestorage.app",
  messagingSenderId: "209059724376",
  appId: "1:209059724376:web:cd55a539e2f7c347411e2d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
