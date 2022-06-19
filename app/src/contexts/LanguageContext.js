import React, { createContext, useState } from "react";

///// CONTEXT TO HOLD LANGUAGE ACROSS THE WHOLE APP /////
export const LanguageContext = createContext(null);

export const LanguageContextProvider = ({ children }) => {
  const [language, setLanguage] = useState("FR");
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
