"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TopOfferBar from "@/app/components/TopOfferBar";

export default function Page() {
    return (
        <>
            <TopOfferBar />
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

                <p className="text-gray-700 leading-relaxed">
                    We ship products within 1–3 business days. Delivery time varies by
                    location. You will receive SMS and Email notifications after shipping.
                </p>
            </div>

            <Footer />
        </>
    );
}
