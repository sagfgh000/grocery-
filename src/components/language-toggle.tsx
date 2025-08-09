"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        onClick={() => setLanguage('en')}
      >
        EN
      </Button>
      <Button
        variant={language === 'bn' ? 'default' : 'outline'}
        onClick={() => setLanguage('bn')}
      >
        বাংলা
      </Button>
    </div>
  );
}
