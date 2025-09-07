
"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This page now serves as a redirect to the login page.
export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <p>Redirecting to login...</p>
    </div>
  );
}
