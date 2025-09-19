/**
 * Import function triggers from their respective submodules:
 *
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions/gen2/triggers
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const {onCall} = require("firebase-functions/v2/https");
// const {defineSecret} = require("firebase-functions/params");
// const nodemailer = require("nodemailer");
// const logger = require("firebase-functions/logger");

const generic = require("./fnHelloWorld.js");
const emails = require("./fnEmails.js");

// The helloWorld function is an HTTPS-triggered function
// that responds to HTTP requests.
// It uses a simple Express-like handler to respond with "Hello from Firebase!"

// exports.helloWorld = onRequest((request, response) => {
//   // Use the logger to log a message for debugging.
//   // This will appear in the Google Cloud Console logs.
// //   logger.info("Hello logs!", { structured: true });

//   // Send a response to the client.
//   // The client can be a web browser, a mobile app, or another server.
//   response.send("Hello from Propdial! deploying again");
// });

exports.helloWorld = generic.helloWorld;
// exports.helloWorld = helloWorldFunc;


exports.sendEmailWithoutAuth = emails.sendEmailWithoutAuth;
exports.sendEmailWithAuth = emails.sendEmailWithAuth;
