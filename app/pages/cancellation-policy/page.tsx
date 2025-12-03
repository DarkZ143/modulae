"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";


export default function Page() {
    return (
        <>
          
            <Navbar />

            <div className="max-w-5xl mx-auto px-6 py-10">
                <h1 className="text-3xl font-bold mb-6">Cancellation Policy</h1>

                <p className="text-gray-700 leading-relaxed">
                    Orders can be cancelled before they are shipped. Once shipped, cancellation
                    converts into a return request.
                </p>
            </div>

            <Footer />
        </>
    );
}
