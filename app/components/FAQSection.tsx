"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
    {
        question: "What is Modulae Furniture?",
        answer:
            "Modulae is a modern furniture brand providing premium, long-lasting and aesthetically designed furniture for living rooms, bedrooms, dining areas, and workspaces. We focus on durability, sustainability and timeless design.",
        image: "/faq/furniture.jpg",
    },
    {
        question: "Do you provide home delivery?",
        answer:
            "Yes! We offer secure and fast home delivery across India. All orders are carefully packed with shock-proof materials to ensure your furniture arrives safely.",
        image: "/faq/homedelivery.jpg",
    },
    {
        question: "Is installation included?",
        answer:
            "Absolutely. For products that require assembly such as beds, wardrobes, dining tables or TV units, we provide **FREE professional installation** by certified technicians.",
        image: "/faq/installation.jpg",
    },
    {
        question: "How long does delivery take?",
        answer:
            "Depending on your location, delivery takes **3–9 business days** on average. Metro cities like Delhi, Mumbai, Bangalore receive most orders within 3–4 days.",
        image: "/faq/time.jpg",
    },
    {
        question: "Do you offer returns or replacements?",
        answer:
            "Yes, we provide a **7-day return/replacement window** for damaged, defective or severely mismatched products. Our team will inspect and arrange a pickup or replacement at no extra cost.",
        image: "/faq/return.jpg",
    },
    {
        question: "Which materials do you use?",
        answer:
            "Our furniture is made using premium materials such as Sheesham wood, Engineered hardwood, High-density foam, Tempered glass and durable metal frames. All materials go through strict quality checks.",
        image: "/faq/materials.jpg",
    },
    {
        question: "Is Cash-on-Delivery available?",
        answer:
            "Currently, we support **online payments only** (UPI, Debit/Credit Cards, Net Banking). COD will be added soon.",
        image: "/faq/cod.jpg",
    },
    {
        question: "Do the products have warranty?",
        answer:
            "Yes! All Modulae products come with a **1-year structural warranty** covering manufacturing defects.",
        image: "/faq/warranty.jpg",
    },
];

export default function FAQSection() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="max-w-6xl mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className="border-none bg-white rounded-xl shadow-sm shadow-orange-300 overflow-hidden"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full flex justify-between items-center px-6 py-5 text-left"
                        >
                            <span className="text-lg font-semibold text-gray-900">
                                {faq.question}
                            </span>

                            <motion.span
                                animate={{
                                    rotate: activeIndex === index ? 180 : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-2xl text-gray-600"
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
                                    transition={{ duration: 0.4 }}
                                    className="px-6 pb-6 flex flex-col md:flex-row gap-6"
                                >
                                    {/* LEFT: Answer Text */}
                                    <div className="flex-1 text-gray-700 text-base leading-relaxed">
                                        {faq.answer}
                                    </div>

                                    {/* RIGHT: Illustration */}
                                    <div className="shrink-0 w-full md:w-40">
                                        <Image
                                            src={faq.image}
                                            alt="FAQ illustration"
                                            width={500}
                                            height={400}
                                            className="w-full object-contain"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </section>
    );
}
