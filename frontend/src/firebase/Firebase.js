// src/firebase/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZznE7k1r8sRHRUzAb5l7QhGHKSePJ4Hw",
  authDomain: "real-time-chat-pp.firebaseapp.com",
  projectId: "real-time-chat-pp",
  storageBucket: "real-time-chat-pp.appspot.com",
  messagingSenderId: "962853424480",
  appId: "1:962853424480:web:096d6812b71f3487982205",
  measurementId: "G-PTXYZET308"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; 
