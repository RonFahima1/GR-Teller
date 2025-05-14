"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, Shield, Bell, Moon, Sun, Home, Send, RefreshCw, Users, DollarSign, List, CreditCard, Settings, Cog } from "lucide-react";

const mockUser = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  phone: "+1 555-0123",
  role: "Admin",
  notifications: true,
  darkMode: false,
  twoFactorEnabled: true
};

const navLinks = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/send-money", label: "Send Money", icon: Send },
  { href: "/currency-exchange", label: "Currency Exchange", icon: RefreshCw },
  { href: "/client-balance", label: "Client Balance", icon: Users },
  { href: "/cash-register", label: "Cash Register", icon: DollarSign },
  {
    label: "Transactions",
    icon: List,
    children: [
      { href: "/transactions/remittance", label: "Remittance" },
      // ... other transaction links ...
    ]
  },
  { href: "/payout", label: "Payout", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/admin", label: "Administration", icon: Cog }, // Always visible!
  // ... other links ...
];

export default function ProfileSettings() {
  const [user, setUser] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);

  function handleSave() {
    setIsEditing(false);
    // In a real app, save to backend
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      {/* Personal Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
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
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferences
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
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <Switch
              checked={user.darkMode}
              onCheckedChange={checked => setUser({ ...user, darkMode: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 