// Import the functions you need from the SDKs you need
import { type FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
    apiKey: "AIzaSyCBjt8lSY14u7sIKwAPaKlJwBh8gMKVorY",
    authDomain: "ml-playground-4202d.firebaseapp.com",
    projectId: "ml-playground-4202d",
    storageBucket: "ml-playground-4202d.appspot.com",
    messagingSenderId: "686466202659",
    appId: "1:686466202659:web:704c3e3ede583ce8b2c596",
    measurementId: "G-P0HPK79FXW"
};

// Initialize Firebase
export const initializeFirebase = () => {
    let app;
    try {
        app = getApp();
    } catch (e) {
        app = initializeApp(firebaseConfig);
    }
    const analytics = getAnalytics(app);
    const auth = getAuth(app);
    return { app, analytics, auth };
}
