// src/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAhKDWqhCKxuRDXLOHRuYdZ4tZmeBq608c",
    authDomain: "dreambridge-ff3f1.firebaseapp.com",
    projectId: "dreambridge-ff3f1",
    storageBucket: "dreambridge-ff3f1.appspot.com",
    messagingSenderId: "885577786424",
    appId: "1:885577786424:web:1c3b104440b027503932cd",
    measurementId: "G-F14THZQWB8", // 若没有可删
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

const db = getFirestore(app);

export { app, auth, db };
export default app;
