// import React from "react";
// import ReactDOM from "react-dom/client";
// import "core-js/stable";
// import "regenerator-runtime/runtime";
// import 'core-js/features/global-this';
// import { BrowserRouter } from "react-router-dom";

// import "./index.css";
// import "./index.scss"
// import App from "./App";
// import { AuthContextProvider } from "./context/AuthContext";

// // IMPORT SERVICE WORKER
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// const rootElement = document.getElementById("root");
// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <React.StrictMode>
//     <AuthContextProvider>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//     </AuthContextProvider>
//   </React.StrictMode>
// );

// // Register service worker
// serviceWorkerRegistration.register();

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "core-js/stable";
import "regenerator-runtime/runtime";
import "core-js/features/global-this";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import "./index.scss";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { CityContextProvider } from "./context/CityContext";

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);

const RootComponent = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a small delay for loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Adjust the delay as needed
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div
        className="page_loader"
        style={{
          height: "100vh",
        }}
      >
        <img
          src="/assets/img/logo_propdial.png"
          alt="Propdial"
          style={{
            height: "80px",
            width: "auto",
          }}
        />
      </div>
    ); // Show the loader while loading
  }

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <CityContextProvider>
          <App />
        </CityContextProvider>
      </BrowserRouter>
    </AuthContextProvider>
  );
};

root.render(
  <React.StrictMode>
    <RootComponent />
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
