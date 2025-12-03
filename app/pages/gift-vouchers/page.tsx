/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import CategoryHeader from "@/app/components/CategoryHeader";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import Image from "next/image";
import { Ticket } from "lucide-react";

// ✅ Helper to truncate description
const truncateWords = (text: string, limit: number) => {
    if (!text) return "";
    const words = text.split(/\s+/);
    if (words.length > limit) {
        return words.slice(0, limit).join(" ") + "...";
    }
    return text;
};

export default function GiftVouchersPage() {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const snap = await get(ref(rtdb, "vouchers"));
                if (snap.exists()) {
                    const data = snap.val();
                    setVouchers(Object.values(data));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    const handleGetVoucher = (voucher: any) => {
        localStorage.setItem("activeVoucher", JSON.stringify(voucher));
        alert(`Voucher Applied! Add items worth ₹${voucher.minSpend} to use it.`);
        router.push("/shop");
    };

    return (
        <>
            <Navbar />
            <CategoryHeader title="Gift Vouchers" />

            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Exclusive <span className="text-orange-600 underline decoration-orange-400">Offers</span>
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Unlock special discounts and partner offers. Click &quot;Get Voucher&quot; to start shopping.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-72 bg-gray-200 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">No vouchers available right now.</div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {vouchers.map((card, index) => (
                                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition border border-gray-100 group flex flex-col">

                                    <div className={`h-32 bg-linear-to-r ${card.color || "from-gray-700 to-gray-900"} p-6 text-white relative`}>
                                        <h3 className="text-xl font-bold truncate pr-4">{card.title}</h3>
                                        <p className="text-sm opacity-90 mt-1 font-medium">{card.tag}</p>
                                        {card.minSpend > 0 && (
                                            <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-xs px-2 py-1 rounded font-mono">
                                                Min: ₹{card.minSpend}
                                            </span>
                                        )}
                                    </div>

                                    <div className="px-6 pb-6 flex-1 flex flex-col relative pt-12">
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-white z-10">
                                            {card.image ? (
                                                <Image src={card.image} alt={card.title} width={80} height={80} className="object-cover w-full h-full" />
                                            ) : (
                                                <Ticket className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>

                                        {/* ✅ Applied truncation and ensured padding */}
                                        <p className="text-gray-700 text-sm leading-relaxed text-center mb-4 flex-1 px-2">
                                            {truncateWords(card.desc, 30)}
                                        </p>

                                        <button
                                            onClick={() => handleGetVoucher(card)}
                                            className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition shadow-md active:scale-95"
                                        >
                                            Get Voucher
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}