import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
// import "firebase/messaging";

// import { getFunctions, httpsCallable } from 'firebase/functions'

// // development keys
const firebaseConfig = {
  apiKey: "AIzaSyBQ1dlizv-nwe6vtOH-Z2acQX7paKwHykw", 
  authDomain: "propdial-dev-aa266.firebaseapp.com",
  projectId: "propdial-dev-aa266",
  storageBucket: "propdial-dev-aa266.appspot.com",
  messagingSenderId: "529710611415",
  appId: "1:529710611415:web:0a7ff10bb6101f986fa992",
};

// production keys
// const firebaseConfig = {
//   apiKey: "AIzaSyAHSLHwNrU95nb1ZYZ7Fgkr2ZIhguEBYks",
//   authDomain: "propdial-prod-80faa.firebaseapp.com",
//   projectId: "propdial-prod-80faa",
//   storageBucket: "propdial-prod-80faa.appspot.com",
//   messagingSenderId: "712362135422",
//   appId: "1:712362135422:web:6ba46eaf02cbf95302ad2f",
//   measurementId: "G-9XMJXP77SE",
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
// const projectMsg = firebase.messaging();
const projectID = app.options.projectId;

// timestamp
const timestamp = firebase.firestore.Timestamp;

export {
  projectFirestore,
  FieldValue,
  projectAuth,
  projectAuthObj,
  projectStorage,
  projectFunctions,
  // projectMsg,
  projectID,
  timestamp,
};
