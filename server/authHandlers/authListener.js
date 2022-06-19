const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { firebaseConfig } = require("../firebaseConfig");

const authListener = () => {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
};
