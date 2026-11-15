import { createContext, useContext, useEffect, useState, useRef } from "react";
import { TRANSLATIONS } from "../i18n/translations.js";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("matthew_lang");
      if (saved === "id" || saved === "en") return saved;
    }
    return "id";
  });
  const [isChangingLang, setIsChangingLang] = useState(false);
  const transitionTimerRef = useRef(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("matthew_lang", lang);
  }, [lang]);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, []);

  const setLang = (newLang) => {
    if (newLang === lang) return;

    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.add("lang-transitioning", "lang-fade-out");
      root.classList.remove("lang-fade-in");
      setIsChangingLang(true);

      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);

      transitionTimerRef.current = setTimeout(() => {
        setLangState(newLang);
        root.classList.remove("lang-fade-out");
        root.classList.add("lang-fade-in");

        transitionTimerRef.current = setTimeout(() => {
          root.classList.remove("lang-transitioning", "lang-fade-in");
          setIsChangingLang(false);
        }, 280);
      }, 160);
    } else {
      setLangState(newLang);
    }
  };

  const t = (key, fallback = "") => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.id;
    return dict[key] ?? fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, isChangingLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
