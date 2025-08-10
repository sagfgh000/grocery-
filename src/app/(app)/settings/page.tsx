
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/context/settings-context";
import { useData } from "@/context/data-context";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();
  const { clearAllData } = useData();
  const { toast } = useToast();
  const { t } = useLanguage();

  const translations = {
      settings: { en: "Settings", bn: "সেটিংস" },
      shopDetails: { en: "Shop Details", bn: "দোকানের বিবরণ" },
      shopDetailsDesc: { en: "Update your shop's name and address.", bn: "আপনার দোকানের নাম এবং ঠিকানা আপডেট করুন।" },
      shopName: { en: "Shop Name", bn: "দোকানের নাম" },
      address: { en: "Address", bn: "ঠিকানা" },
      save: { en: "Save", bn: "সংরক্ষণ করুন" },
      shopDetailsSaved: { en: "Shop Details Saved", bn: "দোকানের বিবরণ সংরক্ষিত হয়েছে" },
      shopDetailsUpdated: { en: "Your shop name and address have been updated.", bn: "আপনার দোকানের নাম এবং ঠিকানা আপডেট করা হয়েছে।" },
      dangerZone: { en: "Danger Zone", bn: "বিপজ্জনক এলাকা" },
      clearAppData: { en: "Clear App Data", bn: "অ্যাপ ডেটা সাফ করুন" },
      clearAppDataDesc: { en: "This will permanently delete all your products, orders, and settings. This action cannot be undone.", bn: "এটি স্থায়ীভাবে আপনার সমস্ত পণ্য, অর্ডার এবং সেটিংস মুছে ফেলবে। এই কাজটি ফিরিয়ে আনা যাবে না।" },
      clearDataConfirmationTitle: { en: "Are you sure?", bn: "আপনি কি নিশ্চিত?" },
      clearDataConfirmationDesc: { en: "This will permanently delete all your application data.", bn: "এটি স্থায়ীভাবে আপনার সমস্ত অ্যাপ্লিকেশন ডেটা মুছে ফেলবে।" },
      cancel: { en: "Cancel", bn: "বাতিল করুন" },
      confirm: { en: "Confirm", bn: "নিশ্চিত করুন" },
  };

  const handleShopDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({...prev, [id]: value}));
  }
  
  const handleSaveShopDetails = () => {
    toast({
      title: t(translations.shopDetailsSaved),
      description: t(translations.shopDetailsUpdated),
    });
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">{t(translations.settings)}</h2>
      
      <Separator />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t(translations.shopDetails)}</CardTitle>
            <CardDescription>{t(translations.shopDetailsDesc)}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">{t(translations.shopName)}</Label>
              <Input id="shopName" value={settings.shopName} onChange={handleShopDetailsChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopAddress">{t(translations.address)}</Label>
              <Input id="shopAddress" value={settings.shopAddress} onChange={handleShopDetailsChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveShopDetails}>{t(translations.save)}</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">{t(translations.dangerZone)}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{t(translations.clearAppDataDesc)}</CardDescription>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">{t(translations.clearAppData)}</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t(translations.clearDataConfirmationTitle)}</AlertDialogTitle>
                  <AlertDialogDescription>{t(translations.clearDataConfirmationDesc)}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t(translations.cancel)}</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllData}>{t(translations.confirm)}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
