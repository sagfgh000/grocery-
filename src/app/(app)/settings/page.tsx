
"use client";

import * as React from "react";
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
import { Upload, Download } from "lucide-react";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();
  const { clearAllData, exportData, importData, products, orders } = useData();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [deleteConfirmText, setDeleteConfirmText] = React.useState("");
  const importInputRef = React.useRef<HTMLInputElement>(null);

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
      clearDataConfirmationTitle: { en: "Are you absolutely sure?", bn: "আপনি কি পুরোপুরি নিশ্চিত?" },
      clearDataConfirmationDesc: { 
        en: "This action cannot be undone. This will permanently delete all data. Please type 'delete' to confirm.", 
        bn: "এই কাজটি ফিরিয়ে আনা যাবে না। এটি স্থায়ীভাবে সমস্ত ডেটা মুছে ফেলবে। নিশ্চিত করতে 'delete' টাইপ করুন।"
      },
      cancel: { en: "Cancel", bn: "বাতিল করুন" },
      confirm: { en: "Confirm", bn: "নিশ্চিত করুন" },
      dataManagement: { en: "Data Management", bn: "ডেটা ম্যানেজমেন্ট" },
      exportData: { en: "Export Data", bn: "ডেটা এক্সপোর্ট করুন" },
      exportDataDesc: { en: "Export all your application data (products, orders, settings) into a single JSON file.", bn: "আপনার সমস্ত অ্যাপ্লিকেশন ডেটা (পণ্য, অর্ডার, সেটিংস) একটি একক JSON ফাইলে এক্সপোর্ট করুন।" },
      importData: { en: "Import Data", bn: "ডেটা ইম্পোর্ট করুন" },
      importDataDesc: { en: "Import data from a backup file. This will overwrite all current data.", bn: "একটি ব্যাকআপ ফাইল থেকে ডেটা ইম্পোর্ট করুন। এটি বর্তমান সমস্ত ডেটা ওভাররাইট করবে।" },
      importSuccess: { en: "Import Successful", bn: "ইম্পোর্ট সফল হয়েছে" },
      importSuccessDesc: { en: "Data has been imported successfully. The app will now reload.", bn: "ডেটা সফলভাবে ইম্পোর্ট করা হয়েছে। অ্যাপটি এখন পুনরায় লোড হবে।" },
      importError: { en: "Import Failed", bn: "ইম্পোর্ট ব্যর্থ হয়েছে" },
      importErrorDesc: { en: "The selected file is not a valid backup file.", bn: "নির্বাচিত ফাইলটি একটি বৈধ ব্যাকআপ ফাইল নয়।" },
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

  const handleClearData = () => {
    clearAllData();
    setDeleteConfirmText("");
  }

  const handleExport = () => {
    const dataToExport = exportData();
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grocerease_backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text === 'string') {
            const parsedData = JSON.parse(text);
            if (importData(parsedData)) {
              toast({
                title: t(translations.importSuccess),
                description: t(translations.importSuccessDesc),
              });
              setTimeout(() => window.location.reload(), 2000);
            } else {
              throw new Error("Invalid data structure");
            }
          }
        } catch (error) {
          toast({
            title: t(translations.importError),
            description: t(translations.importErrorDesc),
            variant: "destructive"
          });
        }
      };
      reader.readAsText(file);
    }
    // Reset file input to allow importing the same file again
    if(importInputRef.current) {
        importInputRef.current.value = "";
    }
  };

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
          <CardContent className="space-y-6">
              <div>
                  <h3 className="font-semibold">{t(translations.dataManagement)}</h3>
                  <div className="mt-2 flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                          <CardDescription>{t(translations.exportDataDesc)}</CardDescription>
                          <Button onClick={handleExport} variant="secondary" className="mt-2"><Download className="mr-2" /> {t(translations.exportData)}</Button>
                      </div>
                      <div className="flex-1">
                          <CardDescription>{t(translations.importDataDesc)}</CardDescription>
                          <Button onClick={handleImportClick} variant="secondary" className="mt-2"><Upload className="mr-2" /> {t(translations.importData)}</Button>
                          <input type="file" ref={importInputRef} onChange={handleFileChange} className="hidden" accept=".json" />
                      </div>
                  </div>
              </div>
              <Separator />
               <div>
                  <h3 className="font-semibold">{t(translations.clearAppData)}</h3>
                  <CardDescription>{t(translations.clearAppDataDesc)}</CardDescription>
                  <AlertDialog onOpenChange={() => setDeleteConfirmText("")}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="mt-2">{t(translations.clearAppData)}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t(translations.clearDataConfirmationTitle)}</AlertDialogTitle>
                        <AlertDialogDescription>{t(translations.clearDataConfirmationDesc)}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="py-2">
                          <Input 
                              id="delete-confirm"
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="delete"
                          />
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t(translations.cancel)}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearData} disabled={deleteConfirmText !== 'delete'}>{t(translations.confirm)}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
               </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
