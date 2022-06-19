require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  databaseURL: "https://horizon-test-b7b3d-default-rtdb.firebaseio.com/",
  appId: process.env.appId,
};

module.exports = { firebaseConfig };
