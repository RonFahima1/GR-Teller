'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ShieldCheck, KeyRound, Lock } from 'lucide-react';

export default function ProfileSecurityPage() {
  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Profile Security</h1>
      <p className="text-gray-600">Manage your security settings here.</p>
      <Card className="card-ios mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Security Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-500">Two-Factor Authentication</span>
            </div>
            <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-500">Biometric Login</span>
            </div>
            <Switch checked={biometric} onCheckedChange={setBiometric} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <Button variant="outline" className="h-10 px-6">Change Password</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 