"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function AccountSidebar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const [open, setOpen] = useState(false);

    const menu = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "My Orders", href: "/my-orders" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Saved Addresses", href: "/addresses" },
        { label: "Edit Profile", href: "/edit-profile" },
        { label: "Settings", href: "/settings" },
    ];

    return (
        <>
            {/* ---------- MOBILE HEADER BUTTON ---------- */}
            <div className="lg:hidden flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">My Account</h2>
                <button
                    onClick={() => setOpen(!open)}
                    className="px-3 py-1.5 rounded-lg bg-orange-500 text-white"
                >
                    {open ? "Close Menu" : "Menu"}
                </button>
            </div>

            {/* ---------- SIDEBAR ---------- */}
            <aside
                className={`
                    bg-white rounded-xl border shadow-sm p-6 space-y-6 
                    h-fit 
                    lg:sticky lg:top-28 

                    /* Mobile Slide Down Animation */
                    lg:block 
                    ${open ? "block" : "hidden"} 
                `}
            >
                {/* User Info */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800">My Account</h2>
                    <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <nav className="space-y-3 text-gray-700">
                    {menu.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`block p-3 rounded-lg font-medium 
                                    ${active
                                        ? "bg-orange-100 text-orange-600"
                                        : "hover:bg-gray-100"
                                    }
                                `}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
