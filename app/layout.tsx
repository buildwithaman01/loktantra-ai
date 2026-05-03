import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Loktantra AI — Your Civic Command Center",
  description:
    "Personalized Indian election guide for first-time voters. Powered by Gemini AI.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Loktantra AI",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import Header from "./components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 bg-orange-600 text-white p-2 rounded shadow-lg"
        >
          Skip to main content
        </a>
        
        <Header />

        <main id="main-content" className="min-h-[calc(100vh-80px)]">
          {children}
        </main>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                  }, function(err) {
                  });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
