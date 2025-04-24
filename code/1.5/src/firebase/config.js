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
