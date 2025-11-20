/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import TopOfferBar from "../../components/TopOfferBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import CategoryHeader from "@/app/components/CategoryHeader";

export default function FurnitureBusinessPage() {
    const [name, setName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [requirements, setRequirements] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "businessInquiries"), {
                name,
                company,
                email,
                phone,
                requirements,
                createdAt: serverTimestamp()
            });

            setSubmitted(true);

            // Clear form
            setName("");
            setCompany("");
            setEmail("");
            setPhone("");
            setRequirements("");
        } catch (error) {
            console.error("Error saving inquiry:", error);
            alert("Failed to submit inquiry. Try again.");
        }
    };

    return (
        <>
            <TopOfferBar />
            <Navbar />
            <CategoryHeader title="Furniture Business" />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* HERO */}
                <div className="bg-linear-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-10 shadow-lg">
                    <h1 className="text-4xl font-bold">Partner With Us – Furniture Business</h1>
                    <p className="text-lg mt-3 opacity-90">
                        We collaborate with hotels, offices, builders, interior designers,
                        and retailers for premium furniture solutions.
                    </p>
                </div>

                {/* WHY PARTNER – Updated UI */}
                <div className="mt-14">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Why Partner With Us?
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Bulk Supply",
                                desc: "We supply furniture for hotels, restaurants, offices & real estate projects.",
                                icon: "🏢"
                            },
                            {
                                title: "Custom Manufacturing",
                                desc: "Custom-made sofas, beds, tables, chairs and corporate interiors.",
                                icon: "🛠️"
                            },
                            {
                                title: "Franchise Partnership",
                                desc: "Launch your own furniture store backed by our catalog & supply chain.",
                                icon: "🏬"
                            },
                            {
                                title: "Interior Contractor",
                                desc: "Work with interior designers for turnkey home & office projects.",
                                icon: "🎨"
                            },
                            {
                                title: "Corporate Clients",
                                desc: "Workspace furniture for offices, startups & co-working spaces.",
                                icon: "💼"
                            },
                            {
                                title: "OEM / Vendor Tie-ups",
                                desc: "Collaborate as suppliers, manufacturers or logistics partners.",
                                icon: "🤝"
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="
                group relative bg-white rounded-2xl p-7  shadow-lg border-transparents 
                hover:shadow-xl hover:border-orange-500 transition-all duration-300 
                overflow-hidden
                "
                            >
                                {/* Gradient Hover Accent */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200 opacity-0 group-hover:opacity-30 rounded-full blur-2xl transition-all duration-300"></div>

                                {/* Icon */}
                                <div className="text-5xl mb-4">{item.icon}</div>

                                {/* Title */}
                                <h3 className="text-xl font-semibold text-gray-900">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-gray-600 mt-2 leading-relaxed">
                                    {item.desc}
                                </p>

                               
                            </div>
                        ))}
                    </div>
                </div>


                {/* BUSINESS FORM */}
                <div className="mt-14 bg-white p-8 rounded-2xl shadow-lg border border-transparent hover:border-orange-500 transition">
                    <h2 className="text-3xl font-bold mb-6">Business Inquiry Form</h2>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* Name */}
                            <div>
                                <label className="font-semibold">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full border p-3 rounded-lg mt-1"
                                />
                            </div>

                            {/* Company */}
                            <div>
                                <label className="font-semibold">Company Name (optional)</label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full border p-3 rounded-lg mt-1"
                                />
                            </div>

                            {/* Email + Phone */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="font-semibold">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full border p-3 rounded-lg mt-1"
                                    />
                                </div>

                                <div>
                                    <label className="font-semibold">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        maxLength={10}
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={phone}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            if (/^\d*$/.test(v)) setPhone(v);
                                        }}
                                        className="w-full border p-3 rounded-lg mt-1"
                                    />
                                </div>
                            </div>

                            {/* Requirements */}
                            <div>
                                <label className="font-semibold">Your Requirements</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={requirements}
                                    onChange={(e) => setRequirements(e.target.value)}
                                    placeholder="Example: Need 50 office chairs, 20 executive tables, custom sofas for hotel."
                                    className="w-full border p-3 rounded-lg mt-1"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
                            >
                                Submit Inquiry
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-10">
                            <h3 className="text-2xl font-bold text-green-600">
                                Thank you for contacting us!
                            </h3>
                            <p className="text-gray-700 mt-2">
                                Our team will reach out within 24 hours.
                            </p>
                        </div>
                    )}
                </div>

                {/* CTA */}
                <div className="mt-14 bg-orange-50 border border-orange-200 p-8 rounded-xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Need bulk pricing?</h2>
                    <p className="text-gray-600 mt-2 mb-4">
                        Contact us for commercial furniture solutions and exclusive B2B rates.
                    </p>
                    <a
                        href="/pages/contact-us"
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
                    >
                        Contact Support
                    </a>
                </div>
            </div>

            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
