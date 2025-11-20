"use client";

import TopOfferBar from "../../components/TopOfferBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";
import Image from "next/image";
import CategoryHeader from "@/app/components/CategoryHeader";

const vouchers = [
    {
        title: "₹500 Cashback Voucher",
        image: "/vouchers/cashbacks.png",
        desc: "Get flat ₹500 cashback on your next purchase above ₹2,999. Valid for all furniture categories.",
        tag: "Cashback Offer",
        color: "from-orange-500 to-red-500",
    },
    {
        title: "Zomato Food Voucher",
        image: "/vouchers/zomato.png",
        desc: "Enjoy delicious meals with a ₹300 Zomato food gift card. Perfect for family and friends.",
        tag: "Food & Dining",
        color: "from-red-500 to-pink-500",
    },
    {
        title: "Swiggy Money Voucher",
        image: "/vouchers/swiggy.png",
        desc: "Get a ₹250 Swiggy Money voucher on every furniture order above ₹5,000.",
        tag: "Food Delivery",
        color: "from-yellow-500 to-orange-500",
    },
    {
        title: "Amazon Shopping Voucher",
        image: "/vouchers/amazon.png",
        desc: "Shop electronics, fashion, appliances, and more with this ₹500 Amazon shopping gift card.",
        tag: "E-Commerce",
        color: "from-indigo-500 to-purple-500",
    },
    {
        title: "MakeMyTrip Travel Voucher",
        image: "/vouchers/makemytrip.png",
        desc: "₹1,000 off on flights, hotels, and holiday bookings through MakeMyTrip.",
        tag: "Travel & Hotels",
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Myntra Fashion Voucher",
        image: "/vouchers/myntra.png",
        desc: "₹400 Myntra fashion voucher for clothing, shoes, accessories, and more.",
        tag: "Fashion & Lifestyle",
        color: "from-pink-500 to-purple-500",
    },
    {
        title: "Gift Card – Modulae Store",
        image: "/vouchers/giftcard.png",
        desc: "Send love with a Modulae Gift Card. Redeemable on all furniture items in-store and online.",
        tag: "Store Voucher",
        color: "from-orange-600 to-yellow-500",
    },
    {
        title: "Flipkart SuperCard",
        image: "/vouchers/flipkart.png",
        desc: "₹300 Flipkart SuperCard usable across millions of products online.",
        tag: "Shopping",
        color: "from-blue-600 to-blue-400",
    },
];

export default function GiftVouchersPage() {
    return (
        <>
            <TopOfferBar />
            <Navbar />
            <CategoryHeader title="Gift Vouchers" />

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* PAGE TITLE */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
                    Exclusive <span className="text-orange-600 underline decoration-orange-400">Gift Vouchers</span>
                </h1>

                <p className="text-center text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
                    Choose from our curated list of vouchers — perfect for gifting and personal rewards.
                </p>

                {/* VOUCHER GRID */}
                <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {vouchers.map((card, index) => (
                        <div
                            key={index}
                            className="
                                bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition
                                border border-gray-100
                            "
                        >
                            {/* Gradient Top Section */}
                            <div className={`p-6 bg-linear-to-r ${card.color} text-white`}>
                                <h3 className="text-xl font-bold">{card.title}</h3>
                                <p className="text-sm opacity-90 mt-1">{card.tag}</p>
                            </div>

                            {/* IMAGE */}
                            <div className="p-6 flex justify-center">
                                <Image
                                    src={card.image}
                                    alt={card.title}
                                    width={160}
                                    height={120}
                                    className="object-contain drop-shadow-lg"
                                />
                            </div>

                            {/* DESCRIPTION */}
                            <div className="px-6 pb-6">
                                <p className="text-gray-700 text-sm leading-relaxed">
                                    {card.desc}
                                </p>

                                <button
                                    className="
                                        mt-4 w-full bg-orange-600 text-white py-2.5 rounded-lg
                                        font-semibold hover:bg-orange-700 transition
                                    "
                                >
                                    Get Voucher
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
