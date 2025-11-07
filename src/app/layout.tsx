
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { app } from '@/lib/firebase'; // Ensure Firebase is initialized
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: 'SyncSenta',
  description: 'AI-powered Kenyan education ecosystem',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script>
          {`
            // Prevent MetaMask console errors during development
            if (typeof window !== "undefined") {
              Object.defineProperty(window, 'ethereum', {
                get() { return undefined },
                set(_) { console.warn("MetaMask wallet injection blocked.") },
              });
            }
          `}
        </script>
        <script src='https://meet.jit.si/external_api.js' async></script>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={cn("font-body antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ThemeToggleButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
