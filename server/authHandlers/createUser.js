const { firestore } = require("firebase-admin");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
// const { firestore } = require("firebase");

const serviceAccount = require("../serviceAccountKey.json");

const createUser = async (req, res) => {
  try {
    const admin = require("firebase-admin");

    const { id } = req.params;
    const userForm = req.body;

    !admin.apps.length
      ? initializeApp({
          credential: cert(serviceAccount),
          databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com",
        })
      : admin.app();

    const db = getFirestore();

    const userRef = await db.collection("users").doc(id);
    const doc = await userRef.get();

    if (doc.exists)
      return res.status(409).json({
        status: 409,
        error: `User with email ${id} already exists.`,
      });

    await db
      .collection("users")
      .doc(id)
      .set({ ...userForm, id: id });

    res.status(200).json({
      status: 200,
      message: `Successfully created account for user ${id}`,
      data: { ...userForm, id },
    });
  } catch (e) {
    console.error(e);
    res.status(404).json({
      status: 404,
      message: `Something went wrong.`,
      error: e,
    });
  }
};

module.exports = { createUser };
