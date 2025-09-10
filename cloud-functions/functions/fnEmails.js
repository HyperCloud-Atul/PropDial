const {onCall} = require("firebase-functions/v2/https");
// const {defineSecret} = require("firebase-functions/params");
const {HttpsError} = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");

// Define a secret to hold your email password
// const EMAIL_PASS = defineSecret("EMAIL_PASS");

exports.sendEmails = onCall(
    // { secrets: [EMAIL_PASS] }, // Make the secret available to this function
    async (request) => {
    // Check if the user is authenticated (optional, but good practice)
      if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The function must be called while authenticated.",
        );
      }
      console.log("requst.data: ", request.data);
      const {to, subject, html} = request.data;
      console.log("to: ", to);
      console.log("subject: ", subject);
      console.log("html body: ", html);
      const emailData = request.data;
      console.log("emailData: ", emailData);
      // Create a Nodemailer transporter using your Gmail credentials
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        // user: process.env.EMAIL_USER, // Your emailfirebase config
        // pass: EMAIL_PASS.value(),      // Your password from the secret
          user: "atul@hyperclouddigital.com",
          pass: "grygbudwtyovrleb",
        },
      });

      console.log("transporter: ", transporter);

      const mailOptions = {
        from: "Propdial",
        to: emailData.toList,
        cc: emailData.ccList,
        bcc: emailData.bccList,
        subject: emailData.subject,
        // body: emailData.body,
        html: emailData.body,
      };

      console.log("mailOptions: ", mailOptions);

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully!");
        return {status: "success", message: "Email sent successfully!"};
      } catch (error) {
        console.error("Error sending email:", error);
        throw new HttpsError("internal", "Failed to send email.");
      }
    },
);
