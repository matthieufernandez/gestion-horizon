const { initializeApp } = require("firebase/app");
const {
  getAuth,
  signInWithEmailAndPassword,
  currentUser,
} = require("firebase/auth");
const { firebaseConfig } = require("../firebaseConfig");

const loginAuthUser = async (req, res) => {
  const app = initializeApp(firebaseConfig);

  const email = req.body.email;
  const password = req.body.password;

  const auth = getAuth();

  try {
    await signInWithEmailAndPassword(auth, email, password).then(
      (currentUser) => {
        //sign-in
        const user = auth.currentUser;
        auth.onAuthStateChanged((user) => {
          if (user) {
            // console.log(user);
            res.status(200).json({
              status: 200,
              message: "success",
              loggedIn: user.email,
            });
          } else {
            console.log("error");
          }
        });
        // res
        //   .status(200)
        //   .json({ status: 200, message: "success!", loggedIn: user });
      }
    );

    // try {
    //   setPersistence(auth, browserSessionPersistence).then(() => {
    //     signInWithEmailAndPassword(auth, email, password).then(
    //       (userCredential) => {
    //         //sign-in
    //         const user = userCredential.user;
    //         res
    //           .status(200)
    //           .json({ status: 200, message: "success!", loggedIn: user });
    //       }
    //     );
    //   });

    // this catch isn't required since it goes to the "try"'s catch if there's an error by default
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;

    //   res.status(400).json({ status: errorCode, message: errorMessage });
    //   console.log(errorCode, errorMessage);
    // });
  } catch (e) {
    console.error("there was an error! : ", e);
    res.status(404).json({
      status: e.code,
      error: e.message,
    });
  }
};
module.exports = { loginAuthUser };
