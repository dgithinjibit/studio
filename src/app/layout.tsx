import type { Metadata } from 'next';
import './globals.css';
import { app } from '@/lib/firebase'; // Ensure Firebase is initialized
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { MetaMaskFix } from '@/components/metamask-fix';
import Script from 'next/script';
import { ClientProviders } from '@/components/client-providers';

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'SyncSenta',
  description: 'AI-powered Kenyan education ecosystem',
  icons: {
    icon: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("font-body antialiased", fontSans.variable)}>
        <MetaMaskFix />
        <ClientProviders>
          {children}
        </ClientProviders>
        <Script src='https://meet.jit.si/external_api.js' async />
      </body>
    </html>
  );
}
