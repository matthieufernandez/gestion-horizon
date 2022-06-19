const { initializeApp } = require("firebase/app");
const { getFirestore, doc, getDoc, updateDoc } = require("firebase/firestore");
const { firebaseConfig } = require("../firebaseConfig");

const paymentUpdate = async (req, res) => {
  initializeApp(firebaseConfig);

  const paymentObject = {
    id: req.body.id, // transaction ID
    type: req.body.type, // status of payment
    amount: req.body.amount,
    source: req.body.tenantId, //tenant email
    rentalId: req.body.unitId,
  };

  const db = getFirestore();

  // LOOK FOR CORRECT RENTAL
  const docRef = doc(db, "rentals", req.body.unitId);
  const docSnap = await getDoc(docRef);
  let docData = await docSnap.data();

  let updateDocRef = null;
  let created = null;

  // LOOK THROUGH PAYMENT HISTORY FOR A PAYMENT THAT MATCHES THE REQUEST'S
  Object.entries(docData.balanceHistory).forEach((entry) => {
    // change to balanceHistory when on final page
    const [key, value] = entry;
    if (value.id === req.body.id) {
      // THIS PROVIDES THE TIMESTAMP USED TO UPDATE THE REFERENCED DOCUMENT
      updateDocRef = entry[0];
      created = entry[1].created;
    }
  });

  // CHANGE THE PAYMENT TYPE TO THE CORRECT TYPE BASED ON WEBHOOK EVENT

  if (updateDocRef && req.body.type === "Payment") {
    console.log("payment updating...");
    const response = await updateDoc(
      docRef,
      {
        rentOwed: Number(docData.rentOwed) - Number(req.body.amount),
        balanceHistory: {
          ...docData.balanceHistory,
          [updateDocRef]: {
            ...paymentObject,
            type: req.body.type,
            unixId: Number(updateDocRef),
            created: created,
          },
        },
      },
      { merge: true }
    );
    res.status(200).json({ status: 200, message: "payment status updated" });
  } else if (updateDocRef && req.body.type === "Failed") {
    const response = await updateDoc(
      docRef,
      {
        balanceHistory: {
          ...docData.balanceHistory,
          [updateDocRef]: {
            ...paymentObject,
            type: req.body.type,
            unixId: Number(updateDocRef),
            created: created,
          },
        },
      },
      { merge: true }
    );
    res
      .status(200)
      .json({ status: 200, message: "payment status updated to FAILED" });
  } else {
    res.status(202).json({ status: 202 });
  }

  //UPDATE BALANCE IN CASE OF FAILED TRANSACTION
};

module.exports = { paymentUpdate };
