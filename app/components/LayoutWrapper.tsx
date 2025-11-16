// app/components/LayoutWrapper.tsx

"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";


// --- Define the pages where you DON'T want the navbar ---
const noNavPages = ["/login", "/register"];

export default function LayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    // Check if the current page is one of the no-nav pages
    const hideNavbar = noNavPages.includes(pathname);

    return (
        <>
            {/* If hideNavbar is false, show the Navbar */}
            {!hideNavbar && (
                <Suspense fallback={<div className="h-[88px] w-full border-b" />}>

                </Suspense>
            )}
            {/* Then, render the page content */}
            <main>{children}</main>
        </>
    );
}