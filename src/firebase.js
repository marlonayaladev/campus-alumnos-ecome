import { initializeApp } from "firebase/app"; // <--- ESTA LÍNEA FALTA
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3H_6NxKsSGsBjSQOC0p8Kcu-O5r_FPbg",
  authDomain: "tactico-final.firebaseapp.com",
  projectId: "tactico-final",
  storageBucket: "tactico-final.firebasestorage.app",
  messagingSenderId: "1063643660940",
  appId: "1:1063643660940:web:5491b8ee6d7ff3da21b1a9"
};

const app = initializeApp(firebaseConfig);

// ¡ESTO ES LO IMPORTANTE! Asegúrate de que digan "export"
export const db = getFirestore(app); 
export const auth = getAuth(app);