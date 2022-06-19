const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../firebaseConfig");
const { getFirestore, doc, getDoc } = require("firebase/firestore");

const getUser = async (req, res) => {
  initializeApp(firebaseConfig);

  const email = req.params.email;

  const db = getFirestore();
  const docRef = await doc(db, "users", email);

  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(200).json({ status: 200, data: docSnap.data() });
    } else {
      res.status(400).json({ status: 400, message: "user doesn't exist" });
    }
  } catch (e) {
    const code = e.code;
    const message = e.message;
    res.status(code).json({ code, message });
    console.error(e);
  }
};

module.exports = { getUser };
