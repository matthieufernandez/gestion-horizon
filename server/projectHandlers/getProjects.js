const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("../serviceAccountKey.json");

const getProjects = async (req, res) => {
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

    res.status(200).json({
      status: 200,
      message: `Successfully retrieved project.`,
      data,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Project retrieval failed",
      error: e,
    });
  }
};

module.exports = { getProjects };
