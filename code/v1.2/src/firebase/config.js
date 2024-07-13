import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/functions";
import "firebase/compat/messaging";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
// Import other services you need, such as Storage, Analytics, etc.

// development keys
const firebaseConfig = {
  apiKey: "AIzaSyBQ1dlizv-nwe6vtOH-Z2acQX7paKwHykw",
  authDomain: "propdial-dev-aa266.firebaseapp.com",
  projectId: "propdial-dev-aa266",
  storageBucket: "propdial-dev-aa266.appspot.com",
  messagingSenderId: "529710611415",
  appId: "1:529710611415:web:0a7ff10bb6101f986fa992",
};

// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_FIREBASE_KEY,
//     authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
//     projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
//     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
//     messagingSenderId: process.env.REACT_APP_FIREBASE_SENDERID,
//     appId: process.env.REACT_APP_FIREBASE_APPID
// };

// ----------------------- Firebase 10.0 ----------------
// initialize firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectAuthObj = firebase.auth;
const projectStorage = firebase.storage();
const projectFunctions = firebase.functions();
const projectMsg = firebase.messaging();
const timestamp = firebase.firestore.Timestamp;
const projectID = app.options.projectId;
const FieldValue = firebase.FieldValue;
// Initialize other services as needed

// Initialize App Check
const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LcyUg4qAAAAAKhxTjhvbILwgFw1FMKd-l2sUUi4"),
  isTokenAutoRefreshEnabled: true,
});

export {
  app,
  projectFirestore,
  FieldValue,
  projectAuth,
  projectAuthObj,
  projectStorage,
  projectFunctions,
  projectMsg,
  timestamp,
  projectID,
  appCheck,
};
