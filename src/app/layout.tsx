
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { app } from '@/lib/firebase'; // Ensure Firebase is initialized
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
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
