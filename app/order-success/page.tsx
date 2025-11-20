"use client";

import { useSearchParams } from "next/navigation"; // To read Order ID if needed
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function OrderSuccessPage() {
    // Optional: Get Order ID from URL (e.g. /order-success?id=ORD-123)
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    return (
        <>
            <Navbar />
            <div className="min-h-[75vh] bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
                
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-green-100 max-w-lg w-full text-center animate-slide-up">
                    
                    {/* Icon */}
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>

                    {/* Text */}
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-6">
                        Thank you for your purchase. We have received your order and will begin processing it shortly.
                    </p>

                    {/* Order Details Badge */}
                    {orderId && (
                        <div className="bg-gray-100 inline-block px-4 py-2 rounded-lg text-sm font-mono text-gray-700 mb-8">
                            Order ID: <span className="font-bold text-black">{orderId}</span>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Link 
                            href="/profile" 
                            className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition shadow-lg shadow-green-200"
                        >
                            <Package className="w-5 h-5" /> Track Your Order
                        </Link>
                        
                        <Link 
                            href="/" 
                            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                        >
                            Continue Shopping <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}