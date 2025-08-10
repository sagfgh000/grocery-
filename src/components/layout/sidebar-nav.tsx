
"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  ScrollText,
  Settings,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/context/language-context";
import { useSettings } from "@/context/settings-context";

const links = [
  { 
    href: "/dashboard", 
    icon: LayoutDashboard, 
    label: { en: "Dashboard", bn: "ড্যাশবোর্ড" } 
  },
  { 
    href: "/inventory", 
    icon: Boxes, 
    label: { en: "Inventory", bn: "ইনভেন্টরি" } 
  },
  { 
    href: "/billing", 
    icon: ShoppingCart, 
    label: { en: "Billing", bn: "বিলিং" },
    badge: { en: "POS", bn: "POS" }
  },
  { 
    href: "/orders", 
    icon: ScrollText, 
    label: { en: "Orders", bn: "অর্ডার" } 
  },
  { 
    href: "/settings", 
    icon: Settings, 
    label: { en: "Settings", bn: "সেটিংস" } 
  },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { settings } = useSettings();

  return (
    <>
      <SidebarHeader className="hidden md:flex">
        <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
                <ShoppingCart className="w-7 h-7 text-primary" />
            </div>
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold font-headline tracking-tight">
                    {settings.shopName}
                </h2>
            </div>
            <div className="ml-auto">
                <SidebarTrigger />
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === link.href}
                className="justify-start"
              >
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                  <span>{t(link.label)}</span>
                  {link.badge && <SidebarMenuBadge>{t(link.badge)}</SidebarMenuBadge>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <LanguageToggle />
      </SidebarFooter>
    </>
  );
}
