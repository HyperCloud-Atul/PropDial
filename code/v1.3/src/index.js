import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./index.scss"
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

// IMPORT SERVICE WORKER
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);

// Register service worker
serviceWorkerRegistration.register();

//Register service worker for FCM Messaging
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker
//       .register('/firebase-messaging-sw.js')
//       .then((registration) => {
//         console.log('FCM Service Worker registered with scope:', registration.scope);
//       })
//       .catch((err) => {
//         console.log('FCM Service Worker registration failed:', err);
//       });
//   });
// }

