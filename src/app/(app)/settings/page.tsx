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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useSettings } from "@/context/settings-context";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();
  const { toast } = useToast();

  const handleShopDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({...prev, [id]: value}));
  }
  
  const handleSaveShopDetails = () => {
    // In a real app, you'd save this to a backend.
    // Here we just show a toast notification.
    toast({
      title: "Shop Details Saved",
      description: "Your shop name and address have been updated.",
    });
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
      
      <Separator />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Shop Details</CardTitle>
            <CardDescription>
              Update your shop's name and address.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input id="shopName" value={settings.shopName} onChange={handleShopDetailsChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shopAddress">Address</Label>
              <Input id="shopAddress" value={settings.shopAddress} onChange={handleShopDetailsChange} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveShopDetails}>Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financials</CardTitle>
            <CardDescription>
              Configure currency and tax settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="BDT" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax-rate">Tax Rate (%)</Label>
              <Input id="tax-rate" type="number" defaultValue="5" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              Set default values for inventory management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="low-stock-threshold">Low Stock Threshold</Label>
                <Input id="low-stock-threshold" type="number" defaultValue="10" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
