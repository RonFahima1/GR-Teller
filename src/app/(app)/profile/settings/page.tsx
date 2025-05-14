'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sun, Moon, User, Lock, LogOut, Mail, Smartphone, ShieldCheck, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const mockUser = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '+1 555-123-4567',
  role: 'Teller',
  avatar: '',
};

export default function ProfileSettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Profile Settings</h1>
      <p className="text-gray-600">Manage your personal settings here.</p>
    </div>
  );
} 