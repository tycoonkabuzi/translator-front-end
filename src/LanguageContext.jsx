import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Initialize with defaults or empty strings
  const [userALang, setUserALang] = useState("en");
  const [userBLang, setUserBLang] = useState("fr");

  return (
    <LanguageContext.Provider
      value={{ userALang, setUserALang, userBLang, setUserBLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguages() {
  return useContext(LanguageContext);
}
