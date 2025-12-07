/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Your Original Data as Fallback
const DEFAULT_FAQS = [
    {
        question: "What is Modulae Furniture?",
        answer: "Modulae is a modern furniture brand providing premium, long-lasting and aesthetically designed furniture for living rooms, bedrooms, dining areas, and workspaces.",
        image: "/faq/furniture.jpg",
    },
    {
        question: "Do you provide home delivery?",
        answer: "Yes! We offer secure and fast home delivery across India. All orders are carefully packed with shock-proof materials to ensure your furniture arrives safely.",
        image: "/faq/homedelivery.jpg",
    },
    {
        question: "Is installation included?",
        answer: "Absolutely. For products that require assembly such as beds, wardrobes, dining tables or TV units, we provide **FREE professional installation** by certified technicians.",
        image: "/faq/installation.jpg",
    },
    {
        question: "How long does delivery take?",
        answer: "Depending on your location, delivery takes **3–9 business days** on average. Metro cities like Delhi, Mumbai, Bangalore receive most orders within 3–4 days.",
        image: "/faq/time.jpg",
    },
    {
        question: "Do you offer returns or replacements?",
        answer: "Yes, we provide a **7-day return/replacement window** for damaged, defective or severely mismatched products. Our team will inspect and arrange a pickup or replacement at no extra cost.",
        image: "/faq/return.jpg",
    },
    {
        question: "Which materials do you use?",
        answer: "Our furniture is made using premium materials such as Sheesham wood, Engineered hardwood, High-density foam, Tempered glass and durable metal frames. All materials go through strict quality checks.",
        image: "/faq/materials.jpg",
    },
    {
        question: "Is Cash-on-Delivery available?",
        answer: "Currently, we support **online payments only** (UPI, Debit/Credit Cards, Net Banking). COD will be added soon.",
        image: "/faq/cod.jpg",
    },
    {
        question: "Do the products have warranty?",
        answer: "Yes! All Modulae products come with a **1-year structural warranty** covering manufacturing defects.",
        image: "/faq/warranty.jpg",
    },
];

export default function FAQSection() {
    const [faqs, setFaqs] = useState<any[]>(DEFAULT_FAQS);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    // Fetch Data
    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/faq"));
                if (snap.exists()) {
                    const data = snap.val();
                    if (Array.isArray(data) && data.length > 0) {
                        setFaqs(data);
                    }
                }
            } catch (error) {
                console.error("Error loading FAQs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, []);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-10">
                Frequently Asked Questions
            </h2>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse"></div>)}
                </div>
            ) : (
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border-none bg-white rounded-xl shadow-sm shadow-orange-100 overflow-hidden border border-gray-100"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex justify-between items-center px-6 py-5 text-left bg-white hover:bg-gray-50 transition-colors"
                            >
                                <span className="text-lg font-semibold text-gray-900 pr-4">
                                    {faq.question}
                                </span>

                                <motion.span
                                    animate={{ rotate: activeIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="text-2xl text-gray-400 shrink-0"
                                >
                                    ▾
                                </motion.span>
                            </button>

                            {/* DROPDOWN BODY */}
                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden bg-gray-50/50"
                                    >
                                        <div className="px-6 pb-6 flex flex-col md:flex-row gap-6 pt-4 border-t border-gray-100">
                                            {/* LEFT: Answer Text */}
                                            <div className="flex-1 text-gray-700 text-base leading-relaxed">
                                                {faq.answer}
                                            </div>

                                            {/* RIGHT: Illustration */}
                                            {faq.image && (
                                                <div className="shrink-0 w-full md:w-48 h-32 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white">
                                                    <Image
                                                        src={faq.image}
                                                        alt="FAQ illustration"
                                                        fill
                                                        className="object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none'; // Hide broken images gracefully
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}