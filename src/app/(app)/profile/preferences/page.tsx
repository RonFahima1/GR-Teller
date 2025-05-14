'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon } from 'lucide-react';

export default function ProfilePreferencesPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Profile Preferences</h1>
      <p className="text-gray-600">Manage your preferences here.</p>
      <Card className="card-ios mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-500">Light Mode</span>
            </div>
            <Switch checked={theme === 'light'} onCheckedChange={v => setTheme(v ? 'light' : 'dark')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-500">Dark Mode</span>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={v => setTheme(v ? 'dark' : 'light')} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 