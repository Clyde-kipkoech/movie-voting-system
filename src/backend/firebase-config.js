// firebase-config.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCuO__7hVK3Xknk_oohzwfmGFgii-wpnnA",
    authDomain: "movie-system-e6033.firebaseapp.com",
    databaseURL: " https://movie-system-e6033-default-rtdb.firebaseio.com",
    projectId: "movie-system-e6033",
    storageBucket: "movie-system-e6033.firebasestorage.app",
    messagingSenderId: "345322830466",
    appId: "1:345322830466:web:5d8bd2f3a41561c1d4529b",
    measurementId: "G-QS21Y1WT4C"
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
 export const db = getFirestore(app);


