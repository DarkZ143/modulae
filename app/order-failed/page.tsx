"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { XCircle, RotateCcw, Home } from "lucide-react";

export default function OrderFailedPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-[75vh] bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
                
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-red-100 max-w-lg w-full text-center animate-slide-up">
                    
                    {/* Icon */}
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <XCircle className="w-12 h-12 text-red-600" />
                    </div>

                    {/* Text */}
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-gray-500 mb-6">
                        Oops! Something went wrong with your transaction. No money was deducted, or it will be refunded automatically within 3-5 days.
                    </p>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Link 
                            href="/checkout" 
                            className="flex items-center justify-center gap-2 w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
                        >
                            <RotateCcw className="w-5 h-5" /> Retry Payment
                        </Link>
                        
                        <Link 
                            href="/" 
                            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                        >
                            <Home className="w-5 h-5" /> Back to Home
                        </Link>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}