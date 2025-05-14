import './globals.css';
import { Inter } from "next/font/google";
import { Providers } from '@/components/providers/Providers';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: 'Global Remit Teller',
  description: 'A teller and compliance platform',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
    other: [
      {
        rel: 'apple-touch-icon',
        url: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        url: '/favicon-32x32.png',
        sizes: '32x32',
      },
      {
        rel: 'icon',
        url: '/favicon-16x16.png',
        sizes: '16x16',
      },
      {
        rel: 'icon',
        url: '/app-logo.png',
        sizes: '48x48',
      },
    ],
  },
  manifest: {
    name: 'Global Remit Teller',
    short_name: 'Global Remit',
    description: 'A teller and compliance platform',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  themeColor: '#111827',
  appleWebApp: {
    title: 'Global Remit Teller',
    statusBarStyle: 'default',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://global-remit-teller.vercel.app',
    siteName: 'Global Remit Teller',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Remit Teller',
    description: 'A teller and compliance platform',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
