import { useEffect } from "react";
import useChatStore from "../store/useChatStore";

const useTheme = () => {
  const { themeMode, setThemeMode } = useChatStore();

  useEffect(() => {
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  };

  return { theme: themeMode, toggleTheme };
};

export default useTheme;
