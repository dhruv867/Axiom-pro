import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import clsx from 'clsx';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { Providers } from '@/components/Providers';
import { HeaderSkeleton } from '@/components/skeletons';

import './globals.css';
import { Analytics } from '@vercel/analytics/next';

const interSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const Header = dynamic(
  async () => {
    const mod = await import('@/components/organisms/Header');
    return mod.Header;
  },
  {
    ssr: true,
    loading: () => <HeaderSkeleton />,
  }
);

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#06070b',
};

export const metadata: Metadata = {
  title: {
    default: 'Axiom Trade - Pulse',
    template: '%s | Axiom Trade - Pulse',
  },
  description: 'Real-time token discovery and trading platform on Solana',
  keywords: ['Solana', 'DEX', 'Token', 'Trading', 'DeFi', 'Crypto'],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Axiom Trade - Pulse',
    description: 'Real-time token discovery and trading platform on Solana',
    type: 'website',
    url: 'https://axiom.trade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Axiom Trade - Pulse',
    description: 'Real-time token discovery and trading platform on Solana',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
  },
};

const bodyClass = clsx(
  interSans.variable,
  jetbrainsMono.variable,
  'dark font-sans antialiased min-h-screen bg-[#06070b] overflow-hidden'
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={bodyClass}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <div className="shrink-0">
              <Suspense fallback={<HeaderSkeleton />}>
                <Header />
              </Suspense>
            </div>

            <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
          </div>
        </Providers>

        <Analytics />
      </body>
    </html>
  );
}
