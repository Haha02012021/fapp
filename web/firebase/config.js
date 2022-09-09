// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpKeiezVxV9sYRlwQZ9MhKsdbHhNgLQZU",
  authDomain: "dapp-85034.firebaseapp.com",
  databaseURL: "https://dapp-85034-default-rtdb.firebaseio.com",
  projectId: "dapp-85034",
  storageBucket: "dapp-85034.appspot.com",
  messagingSenderId: "392046123325",
  appId: "1:392046123325:web:6435022eb87bb1e84fcd54",
  measurementId: "G-5NRRYZ1FP0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);