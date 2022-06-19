const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc, getDoc } = require("firebase/firestore");
const { firebaseConfig } = require("../firebaseConfig");

const AuthRegister = async (req, res) => {
  try {
    initializeApp(firebaseConfig);
    const db = getFirestore();

    const docRef = doc(db, "users", req.body.email);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      res.status(409).json({ status: 409, message: "user already registered" });
      return;
    }

    await setDoc(doc(docRef), {
      id: req.body.email,
      email: req.body.email,
      firstName: req.body.fName,
      lastName: req.body.lName,
      phoneNumber: req.body.phone,
      isAdmin: JSON.parse(req.body.isAdmin),
      isOwner: false,
    });
    res.status(201).json({ status: 201, message: "user registered!" });
  } catch (e) {
    const code = e.code;
    const message = e.message;
    res.status(code).json({ code, message });
    console.error(e);
  }
};

module.exports = { AuthRegister };
