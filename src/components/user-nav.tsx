
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/context/language-context";

export function UserNav() {
  const { t } = useLanguage();

  const translations = {
      admin: { en: "Admin", bn: "অ্যাডমিন" },
      profile: { en: "Profile", bn: "প্রোফাইল" },
      billing: { en: "Billing", bn: "বিলিং" },
      settings: { en: "Settings", bn: "সেটিংস" },
      logout: { en: "Log out", bn: "লগ আউট" },
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-full justify-start gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/40x40.png" alt="@shadcn" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="text-left">
              <p className="text-sm font-medium">Jane Doe</p>
              <p className="text-xs text-muted-foreground">{t(translations.admin)}</p>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Jane Doe</p>
            <p className="text-xs leading-none text-muted-foreground">
              jane.doe@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>{t(translations.profile)}</DropdownMenuItem>
          <DropdownMenuItem>{t(translations.billing)}</DropdownMenuItem>
          <DropdownMenuItem>{t(translations.settings)}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{t(translations.logout)}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
