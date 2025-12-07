/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// Fallback Data (To ensure page isn't empty on first load)
const DEFAULT_DATA = {
    hero: {
        title: "Purchase Protection & Warranty Assurance",
        subtitle: "Every order is verified, protected, and backed by clear service processes.",
        mainHeading: "Your Furniture, Fully Protected",
        mainDesc: "We treat every purchase like a long-term relationship. From product verification at warehouse to warranty support at your doorstep, our purchase protection ensures that what you buy is exactly what you get."
    },
    categories: [
        "Product Verification", "Warranty Validation", "Damage Inspection", "Assembly & Fitting", "Return / Replacement"
    ],
    verificationSteps: [
        { title: "1. Product & Model Verification", desc: "Each item is matched with your order details." },
        { title: "2. Physical Quality Check", desc: "Our QC team inspects joints, welds, and finish." }
    ],
    warranty: {
        title: "How Warranty & Papers Are Verified",
        description: "Your product warranty is digitally linked to your order.",
        covered: ["Structural damage", "Peeling of laminate"],
        notCovered: ["Damage due to misuse", "Water damage"]
    },
    outOfWarranty: {
        title: "Support Even After Warranty Ends",
        description: "We continue to offer paid service support with transparent charges.",
        steps: ["Raise service request", "Technician visit", "Repair completed"]
    },
    checklist: ["Inspect product at delivery", "Report damage in 48h"]
};

export default function PurchaseProtectionPage() {
    const [data, setData] = useState<any>(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/purchase_protection"));
                if (snap.exists()) setData(snap.val());
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <>
            <Navbar />

            {/* HEADER */}
            <section className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Home / Help & Support / Purchase Protection</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">{data.hero.title}</h1>
                        <p className="text-sm md:text-base text-gray-600 mt-1">{data.hero.subtitle}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                        {data.categories.map((item: string, i: number) => (
                            <span key={i} className="px-3 py-1 text-xs md:text-sm rounded-full bg-white border border-orange-100 text-orange-600 font-medium shadow-sm">
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <main className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

                    {/* Hero Section */}
                    <section className="grid gap-8 md:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{data.hero.mainHeading}</h2>
                            <p className="mt-4 text-gray-600 text-sm md:text-base">{data.hero.mainDesc}</p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-white border border-orange-100 p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-orange-500 uppercase">Before Delivery</p>
                                    <p className="mt-1 text-sm text-gray-700">Multi-stage QC and model verification.</p>
                                </div>
                                <div className="rounded-xl bg-white border border-green-100 p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-green-600 uppercase">After Delivery</p>
                                    <p className="mt-1 text-sm text-gray-700">Guided installation and dedicated support.</p>
                                </div>
                            </div>
                        </div>

                        {/* Static Protection Card (Design Element) */}
                        <div className="relative">
                            <div className="rounded-3xl bg-linear-to-br from-orange-500 via-amber-400 to-rose-500 p-0.5 shadow-lg">
                                <div className="rounded-3xl bg-white p-6 h-full">
                                    <h3 className="text-lg font-semibold text-gray-900">🛡️ Purchase Protection Promise</h3>
                                    <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                        <li>• Product authenticity verification</li>
                                        <li>• Warranty documents mapping</li>
                                        <li>• Safe packaging assurance</li>
                                        <li>• Priority support for claims</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Verification Steps */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How We Verify Every Product</h2>
                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            {data.verificationSteps.map((step: any, i: number) => (
                                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                                    <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Warranty Section */}
                    <section className="grid gap-8 md:grid-cols-2 items-start">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900">{data.warranty.title}</h2>
                            <p className="mt-3 text-sm md:text-base text-gray-600">{data.warranty.description}</p>
                            <p className="mt-4 text-xs text-gray-500 italic">* Invoice copy required for claims.</p>
                        </div>

                        <div className="grid gap-4">
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                                <h3 className="text-lg font-semibold text-green-700">✅ Covered</h3>
                                <ul className="mt-3 space-y-2 text-sm text-green-900">
                                    {data.warranty.covered.map((p: string, i: number) => <li key={i}>• {p}</li>)}
                                </ul>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                                <h3 className="text-lg font-semibold text-red-700">❌ Not Covered</h3>
                                <ul className="mt-3 space-y-2 text-sm text-red-900">
                                    {data.warranty.notCovered.map((p: string, i: number) => <li key={i}>• {p}</li>)}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Support & Checklist */}
                    <section className="grid gap-8 md:grid-cols-[1.3fr,1fr] items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{data.outOfWarranty.title}</h2>
                            <p className="mt-2 text-sm md:text-base text-gray-600">{data.outOfWarranty.description}</p>
                            <ol className="mt-4 space-y-3 text-sm text-gray-700 list-decimal list-inside">
                                {data.outOfWarranty.steps.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ol>
                        </div>

                        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
                            <h3 className="text-lg font-semibold text-gray-900">Quick Checklist (For You)</h3>
                            <ul className="mt-3 space-y-2 text-sm text-gray-700">
                                {data.checklist.map((c: string, i: number) => <li key={i}>• {c}</li>)}
                            </ul>
                        </div>
                    </section>

                </div>
            </main>

            <Footer />
        </>
    );
}