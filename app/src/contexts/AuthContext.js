import React, { createContext, useState, useContext, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/auth";

///// FIREBASE APP FOR CLIENT AUTHENTICATION /////
const app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PROJECT_ID,
  projectId: process.env.REACT_APP_STORAGE_BUCKET,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSENGER_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
});

///// CONTEXT TO HOLD USER AUTHORIZATIONS /////
export const AuthContext = React.createContext();

//Adding User to Auth//

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [userData, setUserData] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [message, setMessage] = useState();
  const [data, setData] = useState();
  const [projectData, setProjectData] = useState();

  // listen for auth context changes

  // temporary user context persistence
  useEffect(() => {
    if (Object.keys(sessionStorage).includes("currentUser") && !data) {
      setLoading(true);
      // pull user info from session when data is lost, then repopulate data
      const storedUser = sessionStorage.getItem("currentUser");
      const storedPermissions = sessionStorage.getItem("isAdmin");
      setCurrentUser({
        email: storedUser,
        isAdmin: storedPermissions || false,
      });
      getUserData(storedUser);
    }
  }, [data]);

  const getUserData = async (email) => {
    try {
      const res = await fetch(`/api/users/getUser/${email}`);
      const json = await res.json();
      // store user data in storage for post-refresh referencing
      sessionStorage.setItem("currentUser", json.data.email);
      sessionStorage.setItem("isAdmin", json.data?.isAdmin || false);
      setData(json.data);
      if (json.data?.isAdmin === false) {
        console.log("getting tenant data");
        const resTenant = await fetch(`/api/users/getTenantUnit/${email}`);
        const jsonTenant = await resTenant.json();
        setProjectData(jsonTenant.data);
        return setLoading(false);
      }
      if (json.data?.isAdmin === true) {
        const resAdmin = await fetch(`api/projects/getProjects`);
        const jsonAdmin = await resAdmin.json();
        setProjectData(jsonAdmin.data);
        return setLoading(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const registerUser = async (
    email,
    password,
    fName,
    lName,
    phone,
    isAdmin
  ) => {
    try {
      {
        !error &&
          (await fetch("/api/users/registerUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              password,
              fName,
              lName,
              phone,
              isAdmin,
            }),
          })
            .then((res) => res.json())
            .then((res) => console.log(res)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const adminAddUser = async (
    email,
    password,
    fName,
    lName,
    phone,
    isAdmin
  ) => {
    setLoading(true);
    //authorize user//
    try {
      await fetch("/api/users/addAuthUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 201) {
            console.log(res);
            registerUser(email, password, fName, lName, phone, isAdmin);
          } else {
            setError(res.message);
            console.error(error);
          }
        });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const authLogin = async (email, password) => {
    setLoading(true);
    try {
      await fetch("/api/users/loginAuth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.loggedIn) {
            setCurrentUser(res.loggedIn);
            getUserData(email);
          } else {
            setError(res.message);
          }
        });
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const authLogout = async () => {
    setLoading(true);
    try {
      await fetch("/api/users/logout", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => console.log(res));

      setCurrentUser();
      setData();
      // remove user info from local storage when window is closed
      sessionStorage.removeItem("currentUser");
      sessionStorage.removeItem("isAdmin");
    } catch (e) {
      setError(e.message);
      console.log(e);
    }
    setLoading(false);
  };

  const authPasswordReset = async (email) => {
    setLoading(true);
    try {
      await fetch(`/api/users/password-reset/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.status === 400) {
            setError(res.message.code);
          } else if (res.status === 200) {
            setMessage(res.message);
          }
        });
    } catch (e) {
      setError(e);
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        adminAddUser,
        authLogin,
        authLogout,
        userData,
        currentUser,
        authPasswordReset,
        error,
        setError,
        loading,
        setLoading,
        data,
        message,
        setMessage,
        projectData,
        setProjectData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
