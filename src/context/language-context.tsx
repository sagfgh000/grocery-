"use client";

import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'bn';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (translations: { [key in Language]: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('bn');

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') {
      setLanguage('en');
    }
  }, []);

  const t = (translations: { [key in Language]: string }) => {
    return translations[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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
