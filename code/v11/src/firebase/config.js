import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import "firebase/messaging";
// import { getFunctions, httpsCallable } from 'firebase/functions'
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

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

// initialize firebase
const app = firebase.initializeApp(firebaseConfig);

// initialize Services
const projectFirestore = firebase.firestore();
const FieldValue = firebase.FieldValue;
const projectAuth = firebase.auth();
const projectAuthObj = firebase.auth;
const projectStorage = firebase.storage();
const projectFunctions = firebase.functions();
const projectMsg = firebase.messaging();
const projectID = app.options.projectId;

// timestamp
const timestamp = firebase.firestore.Timestamp;

// Initialize App Check
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider("6LcyUg4qAAAAAKhxTjhvbILwgFw1FMKd-l2sUUi4"),
//   isTokenAutoRefreshEnabled: true,
// });

export {
  projectFirestore,
  FieldValue,
  projectAuth,
  projectAuthObj,
  projectStorage,
  projectFunctions,
  projectMsg,
  timestamp,
  projectID,
  // appCheck,
};
