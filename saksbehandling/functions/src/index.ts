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
import * as admin from "firebase-admin";

admin.initializeApp();

setGlobalOptions({maxInstances: 10});

export const sendMailFromFirebase = onDocumentCreated(
  "cases/{caseId}/comments/{commentId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.log("No document data.");
      return;
    }
    const sendgridKey = process.env.SENDGRID_API_KEY;
    sgMail.setApiKey(sendgridKey);

    const commentDoc = snapshot.data();
    const caseId = event.params.caseId;

    const caseRef = admin.firestore().doc(`cases/${caseId}`);
    const caseSnap = await caseRef.get();

    if (!caseSnap.exists) {
      console.log("Case document does not exist.");
      return;
    }

    const caseDoc = caseSnap.data();

    if (caseDoc?.creator === commentDoc?.creator) {
      console.log("Same creator for case and comment.");
    } else {
      console.log("Different creators.");
    }

    const userId = caseDoc?.creator;
    if (!userId) {
      console.error("User ID is missing in case document.");
      return;
    }
    const docRef = admin.firestore().collection("users").doc(userId);
    const docSnap = await docRef.get();

    const userData = docSnap.data();
    if (!userData || !userData.email) {
      console.error("User data or email is missing.");
      return;
    }
    const msg = {
      to: userData.email,
      from: "snorresovold@gmail.com",
      subject: `Ny kommentar på sak: ${caseDoc.title}`,
      text: `Ny kommentar: ${snapshot.data().comment}`,
      html: `<p><strong>Ny kommentar:</strong> ${snapshot.data().comment}</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
);
