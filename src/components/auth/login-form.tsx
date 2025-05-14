"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, User, Lock, ArrowRight, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext";
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl md:rounded-2xl rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] overflow-hidden bg-background md:min-h-[350px] min-h-[55vh] mx-4">
      <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-700 text-foreground flex flex-col justify-between p-4 sm:p-8 md:p-14 relative md:rounded-none rounded-t-xl md:rounded-l-3xl shadow-[0_8px_32px_0_rgba(10,132,255,0.1)] backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-3 mb-10 transition-all duration-200 hover:scale-105">
            <div className="relative inline-block transition-transform duration-200">
              <img src="/app-logo.png" alt="Global Remit Logo" className="h-12 w-auto max-w-[96px]" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-foreground">Global Remit</span>
          </div>
          <div className="text-lg font-semibold mb-2 text-foreground">Beyond Banking</div>
          <div className="text-sm text-muted-foreground">Fast, secure international money transfers</div>
          <div className="text-base opacity-90 mb-8 max-w-md">Your trusted partner for fast, secure international money transfers with competitive rates and robust compliance.</div>
        </div>
        <div className="mt-10 min-h-[90px]">
          <div className="italic text-muted-foreground text-base sm:text-lg">
            “Global Remit made it so easy to support my family abroad. I feel secure and valued every step of the way.”
            <div className="mt-2 text-sm font-semibold text-muted-foreground not-italic">— Maria, Customer</div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-14 bg-background">
        <div className="w-full max-w-md mx-auto p-4 sm:p-8 md:p-10 flex flex-col gap-10 transition-all duration-200 relative">
          <div className="flex flex-col items-center gap-2 mb-2">
            <span className="block w-10 h-1 rounded-full bg-gray-400/70 mb-2"></span>
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-foreground text-center">Welcome Back</h2>
            <p className="text-muted-foreground text-center">Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/40 hover:border-border/80 h-14 px-5 rounded-xl"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-input border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary/40 hover:border-border/80 h-14 px-5 rounded-xl"
                />
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-primary hover:text-primary/80 transition">Forgot password?</a>
                </div>
              </div>
            </div>
            <Button type="submit" className="inline-flex items-center justify-center text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 w-full rounded-xl bg-primary text-primary-foreground font-medium py-3 hover:bg-primary/90 active:scale-95 transition-all focus:ring-2 focus:ring-primary/40 shadow-sm hover:shadow-md" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="flex items-center gap-2 my-2">
            <span className="flex-1 h-px bg-border"></span>
            <span className="text-xs text-muted-foreground font-medium">or</span>
            <span className="flex-1 h-px bg-border"></span>
          </div>
          <Button
            type="button"
            className="text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 px-4 w-full rounded-xl bg-secondary text-secondary-foreground border border-primary py-3 hover:bg-secondary/90 active:scale-95 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-primary/40 shadow-sm hover:shadow-md"
            variant="secondary"
            onClick={() => login('demo@example.com', 'demo')}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Try Demo'}
          </Button>
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <span className="text-[10px] text-muted-foreground"> 2025 Global Remit</span>
          </div>
        </div>
      </div>
    </div>
  );
} 