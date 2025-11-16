"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopOfferBar from "../components/TopOfferBar";
import LatestProducts from "../components/LatestProduct";
import BlogSection from "../components/blog";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    // Protect route
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth/login");
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <><TopOfferBar />
            <Navbar />
            <div className="min-h-screen bg-gray-50 px-6 py-10">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Welcome to your Dashboard 👋
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Logged in as <span className="font-semibold">{user.email}</span>
                    </p>

                    {/* ADD ANY DESIGN BELOW */}
                    <div className="mt-8 p-6 bg-white shadow rounded-xl border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Your Dashboard Content
                        </h2>
                        <p className="text-gray-600 mt-2">
                            You can now start designing your ecommerce dashboard UI.
                        </p>
                    </div>
                </div>
            </div>
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
