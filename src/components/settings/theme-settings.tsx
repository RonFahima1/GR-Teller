"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const [isDemoMode, setIsDemoMode] = React.useState(false);

  React.useEffect(() => {
    // Load saved demo mode setting
    const savedDemoMode = localStorage.getItem("demoMode");
    if (savedDemoMode) {
      setIsDemoMode(JSON.parse(savedDemoMode));
    }
  }, []);

  const handleThemeChange = (value: string) => {
    setTheme(value);
    toast.success(`Theme changed to ${value} mode`);
  };

  const handleDemoModeChange = (checked: boolean) => {
    setIsDemoMode(checked);
    localStorage.setItem("demoMode", JSON.stringify(checked));
    toast.success(`Demo mode ${checked ? "enabled" : "disabled"}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Customize the appearance of your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Theme Mode</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="demo-mode"
                checked={isDemoMode}
                onCheckedChange={handleDemoModeChange}
              />
              <Label htmlFor="demo-mode">Demo Mode</Label>
            </div>

            {isDemoMode && (
              <div className="rounded-lg border p-4 bg-muted">
                <p className="text-sm text-muted-foreground">
                  Demo mode is enabled. This will show sample data and allow you to test features without affecting real data.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 