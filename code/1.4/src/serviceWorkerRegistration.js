// serviceWorkerRegistration.js
import { event } from 'jquery';
import { Workbox } from "workbox-window";

// Check if service worker is supported by the browser
export const register = () => {
  if ("serviceWorker" in navigator) {
    const wb = new Workbox("/service-worker.js");

    wb.addEventListener("installed", (event) => {
      if (event.isUpdate) {
        //silent refresh without asking permission from user
        window.location.reload();

        //asking permission from user to refresh the page
        // if (confirm("New update is available, click ok to refresh")) {
        //   window.location.reload();
        // }
      }
    });

    try {
      wb.register();
      console.log("Service worker registered successfully!");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  } else {
    console.log("Service Worker is not supported.");
  }
};

// Unregister service worker
export const unregister = () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error("Service Worker unregistration failed:", error);
      });
  }
};
