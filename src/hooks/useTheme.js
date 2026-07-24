import { useCallback, useEffect, useMemo, useRef } from "react";
import useChatStore from "../store/useChatStore";

function getSystemPref() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode) {
  if (mode === "system") return getSystemPref();
  return mode;
}

function applyTheme(resolved) {
  const root = document.documentElement;
  if (resolved === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

const useTheme = () => {
  const themeMode = useChatStore((s) => s.themeMode);
  const setThemeMode = useChatStore((s) => s.setThemeMode);
  const mediaRef = useRef(null);

  const resolved = useMemo(() => resolveTheme(themeMode), [themeMode]);

  useEffect(() => {
    applyTheme(resolved);
  }, [resolved]);

  useEffect(() => {
    if (themeMode !== "system") {
      if (mediaRef.current) {
        mediaRef.current.removeEventListener("change", mediaRef.current._handler);
        mediaRef.current = null;
      }
      return;
    }
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => applyTheme(e.matches ? "dark" : "light");
    mq._handler = handler;
    mq.addEventListener("change", handler);
    mediaRef.current = mq;
    return () => {
      mq.removeEventListener("change", handler);
      delete mq._handler;
      mediaRef.current = null;
    };
  }, [themeMode]);

  const setTheme = useCallback(
    (mode) => {
      setThemeMode(mode);
    },
    [setThemeMode]
  );

  const cycleTheme = useCallback(() => {
    const order = ["dark", "light", "system"];
    const idx = order.indexOf(themeMode);
    setThemeMode(order[(idx + 1) % order.length]);
  }, [themeMode, setThemeMode]);

  return {
    theme: resolved,
    themeMode,
    setTheme,
    cycleTheme,
    isDark: resolved === "dark",
  };
};

export default useTheme;
