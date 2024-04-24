import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./index.scss"
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

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
