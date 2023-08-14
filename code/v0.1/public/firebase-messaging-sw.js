// importScripts('https://www.gstatic.com/firebasejs/8.10.0')
// importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js')

importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyBQ1dlizv-nwe6vtOH-Z2acQX7paKwHykw",
    authDomain: "propdial-dev-aa266.firebaseapp.com",
    projectId: "propdial-dev-aa266",
    storageBucket: "propdial-dev-aa266.appspot.com",
    messagingSenderId: "529710611415",
    appId: "1:529710611415:web:0a7ff10bb6101f986fa992"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// initialize firebase
// const app = firebase.initializeApp(firebaseConfig);

// // initialize Services
// const pushMessages = firebase.messaging()

// Handle push notification
messaging.onMessage(async function (payload) {
    const notification = await messaging.getInitialNotification();

    // Do something with the notification
    console.log(notification);
});


// messaging.onBackgroundMessage((payload) => {
//     console.log('[firebase-messaging-ws.js]: ', payload)
//     const notificationTitle = payload.notificationTitle;
//     const notificationOptions = {
//         body: payload.notification.body,
//         icon: payload.notification.image,
//     }

//     self.ServiceWorkerRegistration.showNotification(notificationTitle, notificationOptions)
// })