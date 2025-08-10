
"use client";

import * as React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ShoppingCart } from "lucide-react";
import { useSettings } from "@/context/settings-context";
import { useLanguage } from "@/context/language-context";
import { format } from "date-fns";
import { bn, enUS } from "date-fns/locale";

export function MobileHeader() {
    const { settings } = useSettings();
    const { language } = useLanguage();
    const [time, setTime] = React.useState<Date | null>(null);

    React.useEffect(() => {
        // Set initial time on client-side to avoid hydration mismatch
        setTime(new Date());

        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const locale = language === 'bn' ? bn : enUS;

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:hidden">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div className="flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-primary" />
                    <h1 className="text-lg font-semibold font-headline">{settings.shopName}</h1>
                </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
                {time ? format(time, "PPpp", { locale }) : 'Loading time...'}
            </div>
      </header>
    );
}
