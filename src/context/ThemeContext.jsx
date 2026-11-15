import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("matthew_theme");
      if (saved === "light" || saved === "dark") return saved;
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("matthew_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add("theme-transition");
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 350);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

