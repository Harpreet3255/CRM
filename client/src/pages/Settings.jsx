import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Building2, 
  Bell, 
  Shield, 
  Palette
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    usage: true,
    billing: true,
    updates: false
  });

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-slate-600">
            Manage your organization preferences and configurations
          </p>
        </div>
      </motion.div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1">
          <TabsTrigger value="organization">
            <Building2 className="w-4 h-4 mr-2" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Update your company information</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input id="company_name" defaultValue="Acme Corporation" />
                </div>
                <div>
                  <Label htmlFor="domain">Domain</Label>
                  <Input id="domain" defaultValue="acme.com" />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" defaultValue="Travel Agency" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" defaultValue="United States" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input id="contact_email" type="email" defaultValue="contact@acme.com" />
                </div>
              </div>
              <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-cyan-500">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">Email Notifications</p>
                    <p className="text-sm text-slate-500">Receive updates via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">Usage Alerts</p>
                    <p className="text-sm text-slate-500">Get notified when reaching credit limits</p>
                  </div>
                  <Switch
                    checked={notifications.usage}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, usage: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">Billing Notifications</p>
                    <p className="text-sm text-slate-500">Payment and invoice updates</p>
                  </div>
                  <Switch
                    checked={notifications.billing}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, billing: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-900">Product Updates</p>
                    <p className="text-sm text-slate-500">News about new features and improvements</p>
                  </div>
                  <Switch
                    checked={notifications.updates}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, updates: checked })}
                  />
                </div>
              </div>
              <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-cyan-500">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage access and authentication</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 mt-2">
                    <p className="text-sm text-slate-600">Add an extra layer of security</p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
                <div>
                  <Label>Single Sign-On (SSO)</Label>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 mt-2">
                    <p className="text-sm text-slate-600">Configure SSO with your identity provider</p>
                    <Button variant="outline">Configure SSO</Button>
                  </div>
                </div>
                <div>
                  <Label>API Rate Limiting</Label>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-slate-200 mt-2">
                    <p className="text-sm text-slate-600">Current limit: 1000 requests/minute</p>
                    <Button variant="outline">Adjust Limits</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="border-slate-200/60 shadow-lg">
            <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label>Theme</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-lg border-2 border-indigo-600 bg-white cursor-pointer">
                    <p className="font-medium">Light Mode</p>
                    <p className="text-sm text-slate-500">Current theme</p>
                  </div>
                  <div className="p-4 rounded-lg border border-slate-200 bg-slate-900 cursor-pointer">
                    <p className="font-medium text-white">Dark Mode</p>
                    <p className="text-sm text-slate-400">Coming soon</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}