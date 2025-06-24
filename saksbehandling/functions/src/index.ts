/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions";
import {onDocumentCreated} from "firebase-functions/firestore";
import sgMail from "@sendgrid/mail";
import {onRequest} from "firebase-functions/https";
import {defineSecret} from "firebase-functions/params";

const sendgridKey = defineSecret("SENDGRID_API_KEY");


// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({maxInstances: 10});

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
export const helloworld = onRequest(
  {secrets: [sendgridKey]},
  (request, response) => {
    sgMail.setApiKey(sendgridKey.value());

    const msg = {
      to: "snorresovold@gmail.com",
      from: "snorre@zebraconsulting.no",
      subject: "Sending with SendGrid is Fun",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log(sendgridKey);
        console.log("Email sent");
        response.send("Email sent");
      })
      .catch((error) => {
        console.error(error);
        response.status(500).send("Error sending email");
      });
  }
);

export const sendMailFromFirebase = onDocumentCreated(
  "cases/{caseId}/comments/{commentId}",
  async (event) => {
    sgMail.setApiKey(sendgridKey.value());

    const snapshot = event.data;
    if (!snapshot) {
      console.log("No document data.");
      return;
    }

    const doc = snapshot.data();
    console.log("New comment document created:", doc);

    // Use the correct property name for the comment text
    const commentText = doc.text || doc.comment || "";

    const msg = {
      to: "snorresovold@gmail.com", // Change to recipient
      from: "snorre@zebraconsulting.com", // Must be a verified sender in SendGrid
      subject: "New Comment Added",
      text: `New comment: ${commentText}`,
      html: `<p><strong>New comment:</strong> ${commentText}</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
);


