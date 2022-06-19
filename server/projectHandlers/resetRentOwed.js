const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const resetRentOwed = async (req, res) => {
  try {
    const admin = require("firebase-admin");

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    const rentalsRef = await db.collection("rentals");
    const rentalsSnapshot = await rentalsRef.get();

    const allRentals = rentalsSnapshot.docs.map((doc) => doc.data());

    allRentals.forEach(async (rental) => {
      if (rental?.rentOwed)
        await rentalsRef.doc(rental.id).update({
          ...rental,
          rentOwed: 0,
        });
    });

    res.status(200).json({
      status: 200,
      message: "All rents owed have been reset to 0.",
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Something went wrong while resetting the rents owed",
      error: e,
    });
  }
};

module.exports = { resetRentOwed };
