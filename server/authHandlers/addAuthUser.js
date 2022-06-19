const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const { firebaseConfig } = require("../firebaseConfig");
const { v4: uuidv4 } = require("uuid");

const addAuthUser = async (req, res) => {
  const app = initializeApp(firebaseConfig);

  const email = req.body.email;
  const password = uuidv4();
  // const password = "Wings123";

  const auth = getAuth();

  try {
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //sign-in
        const user = userCredential.user;
        console.log("successfully added user!");
        res.status(201).json({
          status: 201,
          message: "auth user successfully added!",
          userEmail: user.email,
        });
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        res.status(400).json({ status: errorCode, message: errorMessage });
        console.log(errorCode, errorMessage);
      });

    return;
  } catch (e) {
    console.error("there was an error");
  }
};
module.exports = { addAuthUser };
