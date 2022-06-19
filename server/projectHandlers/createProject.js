const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = require("../serviceAccountKey.json");

const createProject = async (req, res) => {
  try {
    const admin = require("firebase-admin");
    const id = uuidv4();

    const project = {
      id,
      ...req.body,
    };

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    const docRef = await db.collection("rentals").doc(id);

    await docRef.set({ ...project });

    res.status(200).json({
      status: 200,
      message: `Successfully created project.`,
      data: project,
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: "Create project failed",
      error: e,
    });
  }
};

module.exports = { createProject };
