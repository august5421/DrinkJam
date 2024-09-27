import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCXDf5w-ORhQRSqom4gMOqkxAD33bnBi4c",
  authDomain: "drinkjam-7732f.firebaseapp.com",
  projectId: "drinkjam-7732f",
  storageBucket: "drinkjam-7732f.appspot.com",
  messagingSenderId: "934536854972",
  appId: "1:934536854972:web:9f7c69cef025719760ffb9",
  measurementId: "G-JZDE47NCHD"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage };