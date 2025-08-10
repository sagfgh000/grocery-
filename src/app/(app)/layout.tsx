
"use client";

import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { LanguageProvider } from "@/context/language-context";
import { SettingsProvider } from "@/context/settings-context";
import { DataProvider } from "@/context/data-context";
import { MobileHeader } from "@/components/layout/mobile-header";
import { useDoubleBackToExit } from "@/hooks/use-double-back-to-exit";
import { useIsMobile } from "@/hooks/use-mobile";
import React from "react";

function DoubleBackToExitHandler() {
    // This hook will only run on mobile devices
    const isMobile = useIsMobile();
    useDoubleBackToExit(isMobile);
    return null;
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <SettingsProvider>
      <LanguageProvider>
        <DataProvider>
          <SidebarProvider>
            <Sidebar>
              <SidebarNav />
            </Sidebar>
            <SidebarInset>
              <MobileHeader />
              {children}
            </SidebarInset>
          </SidebarProvider>
          <React.Suspense fallback={null}>
            <DoubleBackToExitHandler />
          </React.Suspense>
        </DataProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}
