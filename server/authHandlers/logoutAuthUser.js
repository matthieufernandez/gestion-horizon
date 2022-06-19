const { initializeApp } = require("firebase/app");
const { getAuth, signOut } = require("firebase/auth");
const { firebaseConfig } = require("../firebaseConfig");

const logoutAuthUser = async (req, res) => {
  const app = initializeApp(firebaseConfig);

  const auth = getAuth();

  try {
    await auth.signOut();
    res
      .status(200)
      .json({ status: "200", message: "user signed out successfully" });
  } catch (e) {
    console.error(e);
    res.status(400).json({ status: 400, message: e });
  }
};

module.exports = { logoutAuthUser };
