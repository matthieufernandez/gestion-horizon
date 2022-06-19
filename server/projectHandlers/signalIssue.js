const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("../firebaseConfig");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const { v4: uuidv4 } = require("uuid");

const signalIssue = async (req, res) => {
  const status = "new";
  const submittedBy = req.body.user;
  const phoneNumber = req.body.phone;
  const subject = req.body.subject;
  const rentalId = req.body.rentalId; // this is the unit id
  const id = uuidv4(); // this is the issue id
  const issue = req.body.issue;

  const date = new Date();
  const time =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();

  try {
    initializeApp(firebaseConfig);
    const db = getFirestore();
    const docRef = doc(db, "rentals", rentalId, "issues", id);

    await setDoc(
      docRef,
      {
        status,
        submittedBy,
        phoneNumber,
        subject,
        issue,
        time,
      },
      { merge: true }
    );
    res.status(200).json({ status: 200, message: "issue succesfully logged" });
  } catch (e) {
    console.error(e);
    res.status(e.code).json({ status: e.code, message: e.message });
  }
};

module.exports = { signalIssue };
