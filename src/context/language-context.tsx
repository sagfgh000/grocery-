
"use client";

import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'bn';

type TranslationValue = string | ((...args: any[]) => string);

type TranslationObject = { [key in Language]: TranslationValue };

type TranslationFunction = (
  translations: TranslationObject,
  ...args: any[]
) => string;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslationFunction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'grocerEaseLanguage';

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bn');

  useEffect(() => {
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
    if (storedLang) {
      setLanguage(storedLang);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') {
        setLanguage('en');
      }
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }

  const t: TranslationFunction = (translations, ...args) => {
    const translation = translations[language];
    if (typeof translation === 'function') {
      return translation(...args);
    }
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
