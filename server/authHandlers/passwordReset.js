const { initializeApp } = require("firebase/app");
const { getAuth, sendPasswordResetEmail } = require("firebase/auth");
const { firebaseConfig } = require("../firebaseConfig");

const passwordReset = async (req, res) => {
  const app = initializeApp(firebaseConfig);
  const email = req.params.email;

  const auth = getAuth();

  try {
    await sendPasswordResetEmail(auth, email);

    res.status(200).json({
      status: "200",
      message: "an email has been sent to reset your password",
    });
  } catch (e) {
    console.error(e);
    res.status(400).json({ status: 400, message: e });
  }
};

module.exports = { passwordReset };
