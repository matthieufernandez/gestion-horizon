import React, { createContext, useState } from "react";

///// CONTEXT TO HOLD USER AUTHORIZATIONS /////
export const AllUsersContext = createContext(null);

export const AllUsersContextProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  return (
    <AllUsersContext.Provider value={{ allUsers, setAllUsers }}>
      {children}
    </AllUsersContext.Provider>
  );
};
