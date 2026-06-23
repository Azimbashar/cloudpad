import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,

// apiKey:"AIzaSyCwSPnpjoOIAmXiMepkgt49Ommfb9sOZh0",
// authDomain:"my-test-project-8329a.firebaseapp.com",
// projectId:"my-test-project-8329a",
// storageBucket:"my-test-project-8329a.firebasestorage.app",
// messagingSenderId:"605319506844",
// appId:"1:605319506844:web:a38e28b9f01bde82363659",
// measurementId : "G-SKN13SCDX2",
// databaseURL:"https://my-test-project-8329a-default-rtdb.firebaseio.com/"


};

// Initialize Firebase
console.log(import.meta.env.VITE_FIREBASE_DATABASE_URL);
console.log(typeof import.meta.env.VITE_FIREBASE_DATABASE_URL);
 export const app = initializeApp(firebaseConfig);
