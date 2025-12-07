"use client";

import Script from 'next/script';

export function MetaMaskFix() {
  return (
    <Script id="metamask-fix" strategy="afterInteractive">
      {`
        if (typeof window !== "undefined") {
          Object.defineProperty(window, 'ethereum', {
            get() { return undefined },
            set(_) { console.warn("MetaMask wallet injection blocked.") },
          });
        }
      `}
    </Script>
  );
}
