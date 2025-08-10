
"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useToast } from './use-toast';
import { useLanguage } from '@/context/language-context';

let backPressedOnce = false;

export const useDoubleBackToExit = (isMobile: boolean) => {
  const pathname = usePathname();
  const { toast } = useToast();
  const { t } = useLanguage();

  const translations = {
    pressBackAgain: { en: "Press back again to exit", bn: "প্রস্থান করতে আবার চাপুন" },
  }

  useEffect(() => {
    // This effect should only run on the client and for mobile devices
    if (typeof window === 'undefined' || !isMobile) {
      return;
    }
    
    const handleBackButton = (event: PopStateEvent) => {
      if (backPressedOnce) {
        // In a Capacitor environment, you'd call `Capacitor.App.exitApp()`.
        // For a web context, going back is the closest we can get.
        window.history.back();
        return;
      }

      backPressedOnce = true;
      toast({ description: t(translations.pressBackAgain) });

      // This is the key part: we push a new state to "catch" the back button press.
      // This prevents the app from navigating back immediately.
      window.history.pushState(null, '', window.location.href);

      setTimeout(() => {
        backPressedOnce = false;
      }, 2000); // 2-second window to press back again
    };

    const onInitialLoad = () => {
        // This listener is for subsequent back button presses
        window.addEventListener('popstate', handleBackButton);
    }
    
    // We add the listener after the component mounts
    const timeoutId = setTimeout(onInitialLoad, 0);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [isMobile, pathname, t, toast]);
};

