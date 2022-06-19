const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");

const serviceAccount = require("../../serviceAccountKey.json");

const updateIssue = async (req, res) => {
  try {
    const body = { ...req.body };

    // unitId, unixId, status

    const admin = require("firebase-admin");

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    // get unit ref and data
    const unitRef = await db.collection("rentals").doc(body.unitId);
    const unitSnapshot = await unitRef.get();
    const unitData = unitSnapshot.data();

    const response = await unitRef.set(
      {
        ...unitData,
        issueHistory: {
          ...unitData.issueHistory,
          [body.unixId]: {
            ...unitData.issueHistory[body.unixId],
            status: body.status,
            modified: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    res.status(200).json({
      status: 202,
      message: `Status updated to ${body.status}`,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Something went wrong updating the issue",
      error: e,
    });
  }
};

module.exports = { updateIssue };
