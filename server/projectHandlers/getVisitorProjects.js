const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const getVisitorProjects = async (req, res) => {
  try {
    const admin = require("firebase-admin");

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    const snapshot = await db.collection("rentals").get();

    const data = snapshot.docs.map((doc) => doc.data());

    const finalData = data.map((unit) => {
      return {
        projectName: unit?.projectName,
        streetNumber: unit.streetNumber,
        streetName: unit.streetName,
        streetPrefix: unit.streetPrefix,
        apartment: unit.apartment,
        city: unit.city,
        province: unit.province,
        postalCode: unit.postalCode,
        size: unit.size,
        monthlyRent: unit.monthlyRent,
        // pictures
        // associated strings etc ...
      };
    });

    res.status(200).json({
      status: 200,
      message: "Filtered project data retrieved.",
      data: finalData,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Something went wrong while retrieving Visitor Projects",
      error: e,
    });
  }
};

module.exports = { getVisitorProjects };
