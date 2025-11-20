"use client";

import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Clock, RefreshCw, HelpCircle } from "lucide-react";

export default function OrderPendingPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-[75vh] bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
                
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-yellow-100 max-w-lg w-full text-center animate-slide-up">
                    
                    {/* Icon */}
                    <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <Clock className="w-12 h-12 text-yellow-600" />
                    </div>

                    {/* Text */}
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Payment Processing</h1>
                    <p className="text-gray-500 mb-6">
                        We have received your request, but we are waiting for confirmation from your bank. This usually takes a few minutes.
                    </p>

                    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm p-4 rounded-xl mb-8">
                        <strong>Note:</strong> Please do not press back or close this window if you have already completed the payment.
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button 
                            onClick={() => window.location.reload()} 
                            className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-white font-bold py-4 rounded-xl hover:bg-yellow-600 transition shadow-lg shadow-yellow-200"
                        >
                            <RefreshCw className="w-5 h-5" /> Check Status
                        </button>
                        
                        <Link 
                            href="/pages/contact-us" 
                            className="flex items-center justify-center gap-2 w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 transition"
                        >
                            <HelpCircle className="w-5 h-5" /> Contact Support
                        </Link>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
}