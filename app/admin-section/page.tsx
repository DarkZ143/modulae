/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Package, ShoppingCart, LogOut, Star, MessageSquare } from "lucide-react";

// Import Components
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminReviews from "./AdminReviews";
import AdminSupport from "./AdminSupport"; // ✅ Make sure you created this file from previous steps

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

    if (loading) return <div className="h-screen flex items-center justify-center bg-gray-900 text-white">Loading Modulae HQ...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex">
            
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-bold text-orange-500">Modulae<span className="text-white text-xs ml-1 border px-1 rounded">HQ</span></h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab("products")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <Package className="w-5 h-5" /> Products
                    </button>
                    
                    <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <ShoppingCart className="w-5 h-5" /> Orders
                    </button>

                    <button onClick={() => setActiveTab("reviews")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'reviews' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <Star className="w-5 h-5" /> Reviews
                    </button>

                    {/* ✅ SUPPORT TAB (For Chatbot Queries) */}
                    <button onClick={() => setActiveTab("support")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'support' ? 'bg-orange-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}>
                        <MessageSquare className="w-5 h-5" /> Support
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <p className="text-xs text-gray-500 mb-2 text-center">{user.email}</p>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-600 px-4 py-2 rounded text-sm transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="ml-64 flex-1 p-8 overflow-y-auto">
                {activeTab === "products" && <AdminProducts />}
                {activeTab === "orders" && <AdminOrders />}
                {activeTab === "reviews" && <AdminReviews />}
                {activeTab === "support" && <AdminSupport />}
            </main>
        </div>
    );
}