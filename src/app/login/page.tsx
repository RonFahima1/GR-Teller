'use client';
import { useRouter } from "next/navigation";
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Banknote } from "lucide-react";
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from "framer-motion";

// Microsoft blue four-square logo (no wordmark)
function MicrosoftIcon({ className = "" }) {
  return (
    <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" fill="#0078D4"/>
      <rect x="13" y="2" width="9" height="9" fill="#0078D4"/>
      <rect x="2" y="13" width="9" height="9" fill="#0078D4"/>
      <rect x="13" y="13" width="9" height="9" fill="#0078D4"/>
    </svg>
  );
}

const QUOTES = [
  {
    id: 1,
    text: "Global Remit made it so easy to support my family abroad. I feel secure and valued every step of the way.",
    author: "Maria, Customer"
  },
  {
    id: 2,
    text: "The interface is so intuitive, I can process transactions in seconds. It feels like using a native iOS app.",
    author: "Alex R., Operations Manager"
  },
  {
    id: 3,
    text: "I love the security and transparency. Global Remit is the gold standard for international transfers.",
    author: "Sam T., Branch Teller"
  }
];

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Quote rotator
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIdx((idx) => (idx + 1) % QUOTES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

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
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#F5F5F7] to-[#E5E5EA] dark:from-gray-900 dark:to-gray-800 pt-8 sm:pt-20 font-['-apple-system','BlinkMacSystemFont','SF Pro Text',sans-serif]">
      <div className="flex flex-col md:flex-row w-full max-w-5xl md:rounded-2xl rounded-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden bg-white/0 md:min-h-[350px] min-h-[55vh] mx-4">
        {/* Left: Blue Panel */}
        <div className="flex-1 bg-gradient-to-br from-[#0A84FF] to-[#007AFF] text-white flex flex-col justify-between p-4 sm:p-8 md:p-14 relative md:rounded-none rounded-t-xl md:rounded-l-3xl shadow-[0_8px_32px_0_rgba(10,132,255,0.1)] backdrop-blur-sm">
          {/* Top: Logo, Motto, Description */}
          <div>
            <div className="flex items-center gap-3 mb-10 transition-all duration-200 hover:scale-105">
              <div className="relative inline-block transition-transform duration-200">
                <img src="/app-logo.png" alt="Global Remit Logo" className="h-12 w-auto max-w-[96px]" />
              </div>
              <span className="font-bold text-2xl tracking-tight">Global Remit</span>
            </div>
            <div className="text-lg font-semibold mb-2">Beyond Banking</div>
            <div className="text-sm text-white/80">Fast, secure international money transfers</div>
            <div className="text-base opacity-90 mb-8 max-w-md">
              Your trusted partner for fast, secure international money transfers with competitive rates and robust compliance.
            </div>
          </div>
          {/* Bottom: Animated Inspiring Quote */}
          <div className="mt-10 min-h-[90px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={QUOTES[quoteIdx].id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="italic text-white/70 text-base sm:text-lg"
              >
                “{QUOTES[quoteIdx].text}”
                <div className="mt-2 text-sm font-semibold opacity-80 not-italic">— {QUOTES[quoteIdx].author}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        {/* Right: Login Form */}
        <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-8 sm:py-12 md:px-12 md:py-14 bg-white dark:bg-gray-900 transition-colors duration-300">
          <div className="w-full max-w-md mx-auto p-4 sm:p-8 md:p-10 flex flex-col gap-10 transition-all duration-200 relative">
            {/* Top divider only (no logo) */}
            <div className="flex flex-col items-center gap-2 mb-2">
              <span className="block w-10 h-1 rounded-full bg-gray-200/70 dark:bg-gray-700/70 mb-2" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Welcome Back</h2>
              <p className="text-gray-500 dark:text-gray-400 text-center">Sign in to your account</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    className="w-full h-14 px-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/40 transition-all text-base font-medium placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-300 dark:hover:border-gray-600 dark:text-white"
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    className="w-full h-14 px-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/40 transition-all text-base font-medium placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-300 dark:hover:border-gray-600 dark:text-white"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="flex justify-end mt-1">
                  <a href="#" className="text-xs text-blue-500 dark:text-blue-400 hover:underline transition">Forgot password?</a>
                </div>
              </div>
              {error && (
                <div className="py-2 px-3 rounded text-red-500 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-center">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full rounded-xl bg-[#0A84FF] text-white font-medium py-3 hover:bg-[#0064d6] active:scale-95 transition-all focus:ring-2 focus:ring-[#007AFF]/40 shadow-sm hover:shadow-md"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Login as Demo User'}
              </Button>
              {/* Divider with or */}
              <div className="flex items-center gap-2 my-2">
                <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">or</span>
                <span className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
              <Button
                type="button"
                className="w-full rounded-xl bg-white dark:bg-gray-800 text-blue-700 dark:text-blue-400 border border-blue-500 dark:border-blue-600 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 focus:ring-2 focus:ring-[#007AFF]/40 shadow-sm hover:shadow-md"
                onClick={() => login('demo@example.com', 'demo')}
                disabled={loading}
              >
                <MicrosoftIcon className="mr-2" />
                Sign in with Microsoft
              </Button>
            </form>
            {/* Footer */}
            <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
              <span className="text-[10px] text-gray-300 dark:text-gray-600"> {new Date().getFullYear()} Global Remit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}