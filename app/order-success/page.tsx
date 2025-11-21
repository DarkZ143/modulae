"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { CheckCircle, Package, ArrowRight, MapPin } from "lucide-react";
import LatestProducts from "../components/LatestProduct";

export default function OrderSuccessPage() {
    // 1. Capture the Order ID passed from the Checkout Page
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <>
            <Navbar />
            <div className="min-h-[75vh] bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
                
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-green-100 max-w-lg w-full text-center animate-slide-up">
                    
                    {/* Success Icon */}
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600 animate-bounce" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-6">
                        Thank you for your purchase. Your order has been received.
                    </p>

                    {/* Order ID Badge */}
                    {orderId && (
                        <div className="bg-gray-100 inline-block px-4 py-2 rounded-lg text-sm font-mono text-gray-700 mb-8 border border-gray-200">
                            Order ID: <span className="font-bold text-black">{orderId}</span>
                        </div>
                    )}

                    <div className="space-y-3">
                        {/* ✅ BUTTON 1: Go to Order Tracking */}
                        <Link 
                            href={orderId ? `/order-tracking?id=${orderId}` : '/profile'} 
                            className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-200"
                        >
                            <MapPin className="w-5 h-5" /> Track Your Order
                        </Link>
                        
                        {/* BUTTON 2: Go to Profile */}
                        <Link 
                            href="/profile" 
                            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                        >
                            <Package className="w-5 h-5" /> View All Orders
                        </Link>

                        <Link 
                            href="/" 
                            className="flex items-center justify-center gap-2 w-full text-sm text-gray-500 font-semibold hover:text-gray-800 transition mt-4"
                        >
                            Continue Shopping <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

            </div>
            <LatestProducts />
            <Footer />
        </>
    );
}