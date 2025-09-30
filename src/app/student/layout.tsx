
import type { ReactNode } from "react";
import Link from 'next/link';

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
      <div className="bg-muted/40 dark:bg-background flex flex-col min-h-screen">
          <main className="flex-grow">
              {children}
          </main>
          <footer className="p-4 text-center text-xs text-muted-foreground">
            © 2025 dantedone All rights reserved. | <Link href="/terms" className="hover:underline">Terms & Conditions</Link>
          </footer>
      </div>
  );
}
