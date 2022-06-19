const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("../../serviceAccountKey.json");

const createIssue = async (req, res) => {
  try {
    const unitId = req.params.id;
    const body = { ...req.body };
    const issueId = uuidv4();
    const unixTimeStamp = new Date().getTime();

    const admin = require("firebase-admin");

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    // get unit related to issue
    const unitRef = await db.collection("rentals").doc(unitId);
    const unitSnapshot = await unitRef.get();
    const unitData = unitSnapshot.data();

    // add issue to issueHistory
    await unitRef.set(
      {
        ...unitData,
        issueHistory: {
          [unixTimeStamp]: {
            id: issueId,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            status: "New",
            subject: body.subject,
            details: body.body,
            modified: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    res.status(200).json({
      status: 200,
      message: `Issue object was successfully created.`,
      subject: body.subject,
      details: body.body,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Failed to create issue object",
      error: e,
    });
  }
};

module.exports = { createIssue };
