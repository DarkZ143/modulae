"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Loader from "./Loader";

export default function GlobalRouteLoader() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Trigger loader on route START (deferred to avoid synchronous setState in effect)
        const startTimer = setTimeout(() => {
            setLoading(true);
        }, 0);

        const endTimer = setTimeout(() => {
            setLoading(false);
        }, 500); // smooth fade-out

        return () => {
            clearTimeout(startTimer);
            clearTimeout(endTimer);
        };
    }, [pathname, searchParams]);

    if (!loading) return null;

    return (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-[6px] flex items-center justify-center z-9999 transition-opacity duration-300">
            <Loader />
        </div>
    );
}
