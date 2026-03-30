import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../data/translations.js";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Try to load saved languages or default to English/Thai
  const [uiLang, setUiLang] = useState(() => {
    return localStorage.getItem("intelsense_uilang") || "English";
  });
  
  const [dataLang, setDataLang] = useState(() => {
    return localStorage.getItem("intelsense_datalang") || "Thai";
  });

  // Save to local storage when changed
  useEffect(() => {
    localStorage.setItem("intelsense_uilang", uiLang);
  }, [uiLang]);

  useEffect(() => {
    localStorage.setItem("intelsense_datalang", dataLang);
  }, [dataLang]);

  // Translate function
  const t = (key) => {
    if (!translations[uiLang] || !translations[uiLang][key]) {
      // Fallback to English if translation is missing
      return translations["English"]?.[key] || key;
    }
    return translations[uiLang][key];
  };

  return (
    <LanguageContext.Provider value={{ uiLang, setUiLang, dataLang, setDataLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
