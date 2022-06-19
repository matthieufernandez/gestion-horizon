const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");
const { firebaseConfig } = require("../firebaseConfig");
const axios = require("axios");

const serviceAccount = require("../serviceAccountKey.json");

const processRentPayment = async (req, res) => {
  try {
    // PULL DATA FROM REQUEST AND CREATE UNIQUE ID
    const body = { ...req.body };
    const paymentId = uuidv4();

    const admin = require("firebase-admin");

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    // PULL DOC FROM DB, SPLIT REF AND SNAPSHOT AND CREATE TEMP UNIT COPY
    // REF IS FOR REFERENCING DOCUMENT FOR THE "SET" UPDATE, SNAPSHOT IS FOR THE TEMP COPY
    const propertyRef = await db.collection("rentals").doc(body.unitId);
    const propertySnapshot = await propertyRef.get();
    let propertyTemp = await propertySnapshot.data();

    // VARIABLE IS UPDATED TO FALSE IF PAYMENT IS MODIFIED FROM PENDING STATUS
    let newPayment = true;

    // CREATE PAYMENT OBJECT USING PROVIDED BODY DATA
    const paymentObject = {
      id: body.id ? body.id : paymentId,
      type: body.type,
      amount: body.amount,
      source: body.tenantId,
      rentalId: body.unitId,
      created: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // CREATE UNIQUE UNIX TIME BASED KEY FOR CHRONOLOGICAL STORAGE
    const unixTimeStamp = new Date().getTime();

    // REDUCE RENTOWNED BY PAYMENT AMOUNT ON COPY (WHEN TYPE === PAYMENT ONLY)
    let tempUnit = {
      ...propertyTemp,
    };

    if (body.type === "Payment") {
      // LOOK IN BALANCEHISTORY TO SEE IF A PENDING PAYMENT WITH THAT ID ALREADY EXISTSTS
      // IF A PAYMENT IS FOUND, THE PAYMENT STATUS IS UPDATED AND THE BALANCE IS
      await axios
        .patch("http://localhost:4000/api/payments/get-balance", {
          unitId: body.unitId,
          tenantId: body.tenantId,
          amount: body.amount,
          type: "Payment",
          id: body.id,
        })
        .then((response) => {
          response.status === 200
            ? (newPayment = false)
            : console.log("processing new payment intent...");
        });
      //IF THE PAYMENT IS NEW,
      tempUnit = {
        ...propertyTemp,
        rentOwed: Number(propertyTemp.rentOwed) - Number(body.amount),
      };
    }

    // SHIP TO DB {...ITERATE ADJUSTED UNIT COPY, ADD PAYMENTOBJECT TO HISTORY WITH UNIX TIMESTAMP KEY}
    if (newPayment) {
      const response = await propertyRef.set(
        {
          ...tempUnit,
          balanceHistory: {
            [unixTimeStamp]: { ...paymentObject, unixId: unixTimeStamp },
          },
        },
        { merge: true }
      );
    }

    // MERGE TRUE ADDS "PAYMENTHISTORY" OR WHATEVER OBJECT YOU ARE ADDING THAT DOES NOT ALREADY EXIST
    // OTHERWISE IT WILL THROW AN ERROR AND YOU'LL NEED TO CONDITIONALLY ADD THE KEY WHICH IS LESS IDEAL

    res.status(200).json({
      status: 200,
      message: `A payment of ${body.amount} was made on unit ${body.unitAddress}.`,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Something went wrong while processing the payment",
      error: e.message,
    });
  }
};

module.exports = {
  processRentPayment,
};
