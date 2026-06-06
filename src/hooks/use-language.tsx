"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { en } from "@/lib/locales/en";
import { ar } from "@/lib/locales/ar";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

const LOCALES = { en, ar };
const STORAGE_KEY = "wapigrow.language";
const DEFAULT_LANGUAGE: Language = "ar"; // default to Arabic per user preference

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: Direction;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getNestedValue(obj: any, path: string): string {
  const parts = path.split(".");
  let current = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") {
      return path;
    }
    current = current[part];
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "ar") return stored;
    } catch {
      // Ignore localStorage read errors in sandbox/private mode
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    }
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore localStorage write errors
    }
  }, []);

  // Sync lang & dir attributes with document element on mount and state changes
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    }
  }, [language]);

  const t = useCallback(
    (key: string): string => {
      const dictionary = LOCALES[language];
      return getNestedValue(dictionary, key);
    },
    [language]
  );

  const dir: Direction = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Return a fallback context if called outside provider
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (key) => {
        const dict = LOCALES[DEFAULT_LANGUAGE];
        return getNestedValue(dict, key);
      },
      dir: DEFAULT_LANGUAGE === "ar" ? "rtl" : "ltr",
    };
  }
  return ctx;
}
