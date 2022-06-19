const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");

const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("../../serviceAccountKey.json");

const adjustRentAndResolve = async (req, res) => {
  try {
    const body = { ...req.body };

    // unitid, unixid, amount

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

    const unixTimestamp = new Date().getTime();
    const paymentId = uuidv4();

    const response = await unitRef.set(
      {
        ...unitData,
        // UPDATE RENT OWED AND BALANCE HISTORY
        rentOwed: Number(unitData.rentOwed) - Number(body.amount),
        balanceHistory: {
          ...unitData.balanceHistory,
          [unixTimestamp]: {
            unixId: unixTimestamp,
            id: paymentId,
            type: "Rent Adjustment",
            amount: Number(body.amount),
            source: "Admin",
            created: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
        // UPDATE THE ISSUE OBJECT
        issueHistory: {
          ...unitData.issueHistory,
          [body.unixId]: {
            ...unitData.issueHistory[body.unixId],
            status: "Resolved",
            modified: firebase.firestore.FieldValue.serverTimestamp(),
          },
        },
      },
      { merge: true }
    );

    res.status(200).json({
      status: 200,
      message: `Issue was successfully resolved with a rent adjustment of ${body.amount}`,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message:
        "Something went wrong while updating the issue, or updating the rent.",
      error: e,
    });
  }
};

module.exports = { adjustRentAndResolve };
