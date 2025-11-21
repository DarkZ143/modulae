// app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalRouteLoader from "./components/GlobalRouteLoader";
import { AuthProvider } from "./context/AuthContext";
import { Suspense } from "react"; // <-- Import Suspense

// --- [STEP 1] Import your new wrapper ---
import LayoutWrapper from "./components/LayoutWrapper"; // <-- Make sure this path is correct!
import ChatBot from "./components/ChatBot";

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
          {/* --- [STEP 2] Wrap your client components in Suspense --- */}
          {/* Both GlobalRouteLoader and LayoutWrapper use client hooks,
              so they must be wrapped in Suspense to avoid build errors. */}
          <Suspense>
            <GlobalRouteLoader />
            <LayoutWrapper>{children}
              <ChatBot />
            </LayoutWrapper>
          </Suspense>

        </AuthProvider>
      </body>
    </html>
  );
}