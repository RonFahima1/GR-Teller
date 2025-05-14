"use client";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, User, Mail, Smartphone, ShieldCheck, KeyRound, Bell, Globe, LogOut, Settings } from "lucide-react";
import { ThemeSettings } from "@/components/settings/theme-settings";
import { SSOSettings } from "@/components/settings/sso-settings";

const mockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 555-0123",
  role: "Admin",
  notifications: true,
  darkMode: false,
  twoFactorEnabled: true,
  language: "English"
};

export default function SettingsPage() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);

  function handleSave() {
    setIsEditing(false);
    // In a real app, save to backend
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account, preferences, and application settings</p>
      </div>

      {/* Personal Information */}
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                value={user.name}
                onChange={e => setUser({ ...user, name: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Email</label>
              <Input
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone</label>
              <Input
                value={user.phone}
                onChange={e => setUser({ ...user, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Role</label>
              <Input value={user.role} disabled />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={user.twoFactorEnabled}
              onCheckedChange={checked => setUser({ ...user, twoFactorEnabled: checked })}
            />
          </div>
          <Button variant="outline" className="w-full">Change Password</Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-muted-foreground">Receive notifications about important updates</p>
            </div>
            <Switch
              checked={user.notifications}
              onCheckedChange={checked => setUser({ ...user, notifications: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance & Theme */}
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5 text-yellow-500" /> Appearance & Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSettings />
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" /> Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <select
              className="border rounded px-3 py-2"
              value={user.language}
              onChange={e => setUser({ ...user, language: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Hebrew">Hebrew</option>
              <option value="French">French</option>
              <option value="Spanish">Spanish</option>
            </select>
            <span className="text-sm text-muted-foreground">Select your preferred language</span>
          </div>
        </CardContent>
      </Card>

      {/* SSO Settings */}
      <Card className="mb-6 card-ios">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Single Sign-On (SSO)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SSOSettings />
        </CardContent>
      </Card>

      {/* Log Out */}
      <div className="flex justify-center mt-8">
        <Button variant="destructive" className="h-12 px-8">
          <LogOut className="h-5 w-5 mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
} 