/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function HelpAndAdvicePage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [topic, setTopic] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const helpTopics = [
        "Order Status",
        "Delivery Information",
        "Product Warranty",
        "Returns & Replacements",
        "Assembly Support",
        "Custom Furniture Inquiry",
        "Payments & Billing",
        "Account Support",
    ];

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, "helpAndAdvice"), {
                name,
                email,
                topic,
                message,
                createdAt: serverTimestamp(),
            });

            setSubmitted(true);
            setName("");
            setEmail("");
            setTopic("");
            setMessage("");
        } catch (err) {
            console.error("Error saving inquiry:", err);
            alert("Failed to submit. Please try again.");
        }
    };

    return (
        <>
            
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* HELP TOPICS */}
                <h2 className="text-3xl font-bold text-gray-900 mt-14 mb-6">
                    Browse Help Topics
                </h2>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {helpTopics.map((topic, idx) => (
                        <div
                            key={idx}
                            className="group bg-white p-6 rounded-xl shadow-md border border-gray-200 
            hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 flex items-center justify-center bg-orange-100 
                rounded-full text-orange-600 text-2xl group-hover:bg-orange-500 
                group-hover:text-white transition">
                                💬
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition">
                                {topic}
                            </h3>

                            {/* CTA */}
                            <p className="text-sm text-gray-500 mt-1">
                                Learn more
                            </p>
                        </div>
                    ))}
                </div>


                {/* -------------------- FORM -------------------- */}
                <div className="bg-white border-2 border-orange-400 rounded-2xl shadow-lg p-8 mt-16">

                    <h2 className="text-3xl font-bold mb-6">Need Personal Help?</h2>
                    <p className="text-gray-600 mb-6">Fill the form and our support team will contact you within 24 hours.</p>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* NAME */}
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

                            {/* EMAIL */}
                            <div>
                                <label className="font-semibold">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border p-3 rounded-lg mt-1"
                                />
                            </div>

                            {/* TOPIC */}
                            <div>
                                <label className="font-semibold">Topic</label>
                                <select
                                    required
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    className="w-full border p-3 rounded-lg mt-1 bg-white"
                                >
                                    <option value="">Select topic</option>
                                    {helpTopics.map((t, idx) => (
                                        <option key={idx} value={t}>{t}</option>
                                    ))}
                                </select>
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <label className="font-semibold">Your Message</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Explain your issue or question..."
                                    className="w-full border p-3 rounded-lg mt-1"
                                ></textarea>
                            </div>

                            {/* SUBMIT BTN */}
                            <button
                                type="submit"
                                className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition"
                            >
                                Submit Request
                            </button>
                        </form>
                    ) : (
                        <div className="text-center p-10">
                            <h3 className="text-2xl font-bold text-green-600">
                                Request Submitted Successfully!
                            </h3>
                            <p className="text-gray-700 mt-2">
                                Our support team will reach out to you soon.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Existing Components */}
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
