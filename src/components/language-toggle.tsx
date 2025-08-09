
"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <Button variant="outline" onClick={toggleLanguage} className="w-full">
      {language === 'en' ? 'বাংলা' : 'English'}
    </Button>
  );
}
