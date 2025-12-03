// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalRouteLoader from "./components/GlobalRouteLoader";
import { AuthProvider } from "./context/AuthContext";
import { Suspense } from "react";

// --- Import your wrappers and components ---
import LayoutWrapper from "./components/LayoutWrapper";
import ChatBot from "./components/ChatBot";

// ✅ IMPORT LOCATION CONTEXT & BAR
import { LocationProvider } from "./context/LocationContext";
import PincodeBar from "./components/PincodeBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Modulae - Fantastic collections of Furnitures and Modular Items",
  description: "Curate and explore collections of modular furniture items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {/* Suspense wraps client components to handle useSearchParams/usePathname */}
          <Suspense>
            <GlobalRouteLoader />

            {/* ✅ Wrap everything in LocationProvider */}
            <LocationProvider>
              <LayoutWrapper>
                {/* ✅ PincodeBar goes here so it appears just below the Navbar (rendered by LayoutWrapper) */}
                <PincodeBar />

                {children}

                <ChatBot />
              </LayoutWrapper>
            </LocationProvider>

          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}