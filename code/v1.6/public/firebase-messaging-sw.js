importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js");
// import firebase from "firebase/app";

// Initialize the Firebase app in the service worker by passing the messagingSenderId
// development keys
firebase.initializeApp({
    apiKey: "AIzaSyBQ1dlizv-nwe6vtOH-Z2acQX7paKwHykw",
    authDomain: "propdial-dev-aa266.firebaseapp.com",
    projectId: "propdial-dev-aa266",
    storageBucket: "propdial-dev-aa266.appspot.com",
    messagingSenderId: "529710611415",
    appId: "1:529710611415:web:0a7ff10bb6101f986fa992",
});

// production keys
// firebase.initializeApp({
//     apiKey: "AIzaSyAHSLHwNrU95nb1ZYZ7Fgkr2ZIhguEBYks",
//     authDomain: "propdial-prod-80faa.firebaseapp.com",
//     projectId: "propdial-prod-80faa",
//     storageBucket: "propdial-prod-80faa.appspot.com",
//     messagingSenderId: "712362135422",
//     appId: "1:712362135422:web:6ba46eaf02cbf95302ad2f",
//     measurementId: "G-JHL35RB2RE"
// });

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.setBackgroundMessageHandler((payload) => {
    console.log("Handling background message: ", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "/assets/img/logo_propdial.png",
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});
