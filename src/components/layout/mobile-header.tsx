
"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { ShoppingCart } from "lucide-react";
import { useSettings } from "@/context/settings-context";

export function MobileHeader() {
    const { settings } = useSettings();

    return (
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-primary" />
                <h1 className="text-lg font-semibold font-headline">{settings.shopName}</h1>
            </div>
      </header>
    );
}

    