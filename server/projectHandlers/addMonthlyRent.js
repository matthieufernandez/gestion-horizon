const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const firebase = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("../serviceAccountKey.json");

const addMonthlyRent = async () => {
  const admin = require("firebase-admin");

  !admin.apps.length
    ? initializeApp({
        credential: cert(serviceAccount),
        databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
      })
    : admin.app();

  const db = getFirestore();

  // get all units
  const rentalsRef = await db.collection("rentals");
  const rentalsSnapshot = await rentalsRef.get();

  // turn collection snapshot into iterable array
  const allRentals = rentalsSnapshot.docs.map((doc) => doc.data());

  const unixTimeStamp = new Date().getTime();

  // loop through rentals and update them one at a time
  allRentals.forEach(async (rental) => {
    // only increase rentOwed if there is a tenant
    if (rental?.tenant?.name)
      await rentalsRef.doc(rental.id).set(
        {
          ...rental,
          rentOwed:
            rental?.rentOwed === undefined
              ? rental.price
              : Number(rental.rentOwed) + Number(rental.price),
          balanceHistory: {
            [unixTimeStamp]: {
              unixId: unixTimeStamp,
              id: uuidv4(),
              type: "Rent Renewal",
              amount: rental?.price,
              source: "System",
              created: firebase.firestore.FieldValue.serverTimestamp(),
            },
          },
        },
        { merge: true }
      );
  });

  return console.log("completed monthly rent renewal");
};

module.exports = { addMonthlyRent };
