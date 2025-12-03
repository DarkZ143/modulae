/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Package, ShoppingCart, LogOut, Star, MessageSquare, Menu, X, LayoutGrid, Ticket, LayoutTemplate, ImageIcon, Megaphone } from "lucide-react";

// Import Components
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminReviews from "./AdminReviews";
import AdminSupport from "./AdminSupport";
import AdminExplore from "./AdminExplore"; // ✅ Ensure this file exists
import AdminVouchers from "./AdminVouchers";
import AdminNavbar from "./AdminNavbar";
import AdminHero from "./AdminHero";
import AdminAds from "./AdminAds";

// ✅ SECURITY: List of allowed Admin Emails
const ALLOWED_ADMINS = [
    "themodulae@gmail.com",
    "therbsound@gmail.com"
];

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("products");
    const [loading, setLoading] = useState(true);

    // Mobile Sidebar State
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin-section/login");
            }
            // ✅ Check if email exists in the allowed array
            else if (!ALLOWED_ADMINS.includes(currentUser.email || "")) {
                alert("Security Alert: Unauthorized Access.");
                signOut(auth);
                router.push("/admin-section/login");
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/admin-section/login");
    };

    // Helper to close sidebar on mobile selection
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setIsSidebarOpen(false);
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Loading Modulae HQ...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">

            {/* --- MOBILE HEADER (Visible only on small screens) --- */}
            <div className="lg:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
                <h1 className="text-xl font-bold text-orange-500">Modulae<span className="text-white text-xs ml-1 border px-1 rounded">HQ</span></h1>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-800">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* --- SIDEBAR OVERLAY (Mobile only) --- */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* --- SIDEBAR --- */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:h-screen
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-orange-500">Modulae<span className="text-white text-xs ml-1 border px-1 rounded">HQ</span></h1>
                    {/* Close button for mobile */}
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <button onClick={() => handleTabChange("products")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <Package className="w-5 h-5" /> Products
                    </button>

                    <button onClick={() => handleTabChange("orders")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <ShoppingCart className="w-5 h-5" /> Orders
                    </button>

                    <button onClick={() => handleTabChange("reviews")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'reviews' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <Star className="w-5 h-5" /> Reviews
                    </button>

                    <button onClick={() => handleTabChange("support")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'support' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <MessageSquare className="w-5 h-5" /> Support
                    </button>

                    {/* ✅ FIXED: Using "explore" as the key to match render logic below */}
                    <button onClick={() => handleTabChange("explore")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'explore' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <LayoutGrid className="w-5 h-5" /> Explore Section
                    </button>

                    <button onClick={() => handleTabChange("vouchers")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'vouchers' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <Ticket className="w-5 h-5" /> Vouchers
                    </button>

                    <button onClick={() => handleTabChange("navbar")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'navbar' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <LayoutTemplate className="w-5 h-5" /> Navbar Manager
                    </button>

                    <button onClick={() => handleTabChange("hero")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'hero' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <ImageIcon className="w-5 h-5" /> Hero Slider
                    </button>

                    <button onClick={() => handleTabChange("ads")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'ads' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <Megaphone className="w-5 h-5" /> Promo Ads
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <p className="text-xs text-gray-500 mb-2 text-center truncate">{user.email}</p>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] lg:h-screen">
                {activeTab === "products" && <AdminProducts />}
                {activeTab === "orders" && <AdminOrders />}
                {activeTab === "reviews" && <AdminReviews />}
                {activeTab === "support" && <AdminSupport />}
                {/* ✅ FIXED: Matching the "explore" key */}
                {activeTab === "explore" && <AdminExplore />}
                {activeTab === "vouchers" && <AdminVouchers />} {/* ✅ Render Here */}
                {activeTab === "navbar" && <AdminNavbar />} {/* ✅ Render */}
                {activeTab === "hero" && <AdminHero />} {/* ✅ Render */}

                {activeTab === "ads" && <AdminAds />} {/* ✅ Render Here */}
            </main>
        </div>
    );
}