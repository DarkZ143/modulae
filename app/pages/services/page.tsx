"use client";

import TopOfferBar from "../../components/TopOfferBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";
import Image from "next/image";
import CategoryHeader from "@/app/components/CategoryHeader";

export default function ServicesPage() {
    return (
        <>
            <TopOfferBar />
            <Navbar />
            <CategoryHeader title="Services" />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-wrap items-center gap-2 mb-10">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        Our
                    </h1>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 underline decoration-orange-400 underline-offset-4">
                        Services & Warranty
                    </h1>

                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        Support
                    </h1>
                </div>


                <div className="space-y-16">

                    {/* WARRANTY VERIFICATION */}
                    <section className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl font-semibold mb-4">Warranty Verification</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Every product you purchase from Modulae comes with a verified
                                warranty that ensures quality and peace of mind. Our system allows
                                you to quickly validate your warranty using your phone number,
                                invoice ID or order ID. Once verified, our team automatically
                                checks the product category and assigns the right technician.
                            </p>

                            <ul className="mt-4 space-y-2 text-gray-700 list-decimal ml-6   bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
                                <li>✔ Check warranty status instantly</li>
                                <li>✔ QR code based warranty scanning</li>
                                <li>✔ Auto-assigned support manager</li>
                                <li>✔ 100% digital verification (no paperwork)</li>
                            </ul>
                        </div>

                        <div>
                            <Image
                                src="/services/warranty.jpg"
                                alt="Warranty Check"
                                className="rounded-xl shadow-lg"
                                width={600}
                                height={400}
                            />
                        </div>
                    </section>

                    {/* SERVICE PROCESS FLOW */}
                    <section className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="order-2 md:order-1">
                            <Image
                                src="/services/service.jpg"
                                alt="Service Process"
                                className="rounded-xl shadow-lg"
                                width={600}
                                height={400}
                            />
                        </div>

                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-semibold mb-4">How Our Service Process Works</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Our service workflow is designed to be seamless and quick.
                                Whether the issue is related to installation, repair, or adjustment,
                                our in-house experts ensure hassle-free support.
                            </p>

                            <ol className="mt-4 space-y-2 text-gray-700 list-decimal ml-6   bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg">
                                <li>Raise a request via our customer portal or helpline</li>
                                <li>Issue verified → Technician auto-assigned</li>
                                <li>Technician contacts you within 12 hours</li>
                                <li>Service completed at your location</li>
                                <li>Feedback collected for quality assurance</li>
                            </ol>
                        </div>
                    </section>

                    {/* WORKER ASSIGNMENT & SERVICE CHARGES */}
                    <section className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2 className="text-3xl font-semibold mb-4">Worker Assignment & Charges</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Our system automatically assigns the nearest verified technician.
                                If your warranty is active, the service is free for all eligible issues.
                            </p>

                            <div className="mt-5 bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg">
                                <h3 className="font-semibold text-lg">⚡ Non-Warranty Charges</h3>

                                <ul className="mt-2 text-gray-700 text-sm space-y-1">
                                    <li>• Inspection Charge: ₹149 – ₹199</li>
                                    <li>• Repair Labour: ₹199 – ₹499</li>
                                    <li>• Part Replacement (If Required): As per MRP</li>
                                    <li>• Installation/Reinstallation: ₹249 – ₹999</li>
                                </ul>

                                <p className="text-gray-500 mt-2 text-sm">
                                    *Final charges depend on product category & issue severity.
                                </p>
                            </div>
                        </div>

                        <div>
                            <Image
                                src="/services/technician.jpg"
                                alt="Technician"
                                width={600}
                                height={400}
                                className="rounded-xl shadow-lg"
                            />
                        </div>
                    </section>

                    {/* EXTENDED WARRANTY */}
                    <section className="grid md:grid-cols-2 gap-10 items-center">
                        <div className="order-2 md:order-1">
                            <Image
                                src="/services/extended-warranty.jpg"
                                alt="Extended Warranty"
                                width={600}
                                height={400}
                                className="rounded-xl shadow-lg"
                            />
                        </div>

                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl font-semibold mb-4">Extended Warranty Plans</h2>
                            <p className="text-gray-600 leading-relaxed">
                                Extend your product life with our affordable extended warranty
                                packages. These plans cover repairs, technician visits, and
                                manufacturing defects beyond the standard warranty period.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 mt-5 gap-4">
                                <div className="border p-4 rounded-xl shadow-sm hover:shadow-md transition mt-5 bg-orange-50 border-l-4 border-orange-400 ">
                                    <h3 className="font-semibold text-xl">1 Year Extension</h3>
                                    <p className="text-gray-500 mt-1 text-sm">Starting at ₹299</p>
                                </div>

                                <div className="border p-4 rounded-xl shadow-sm hover:shadow-md transition mt-5 bg-orange-50 border-l-4 border-orange-400 ">
                                    <h3 className="font-semibold text-xl">2 Year Extension</h3>
                                    <p className="text-gray-500 mt-1 text-sm">Starting at ₹499</p>
                                </div>
                            </div>

                            <p className="mt-3 text-gray-600 text-sm">
                                Available for sofas, beds, wardrobes, tables, and chairs.
                            </p>
                        </div>
                    </section>

                </div>
            </div>

            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
