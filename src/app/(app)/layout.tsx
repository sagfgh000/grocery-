import { Sidebar, SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { LanguageProvider } from "@/context/language-context";
import { SettingsProvider } from "@/context/settings-context";
import { MobileHeader } from "@/components/layout/mobile-header";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SettingsProvider>
      <LanguageProvider>
        <SidebarProvider>
          <Sidebar>
            <SidebarNav />
          </Sidebar>
          <SidebarInset>
            <MobileHeader />
            {children}
          </SidebarInset>
        </SidebarProvider>
      </LanguageProvider>
    </SettingsProvider>
  );
}
