"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LatestProducts from "../components/LatestProduct";
import BlogSection from "../components/blog";
import CategoryHeader from "../components/CategoryHeader";

// ----------------------------
// STORE LOCATION DATA
// ----------------------------
const storeLocations = [
    {
        state: "Delhi",
        cities: ["Connaught Place", "Karol Bagh", "Dwarka", "Lajpat Nagar", "Saket"]
    },
    {
        state: "Uttar Pradesh",
        cities: ["Lucknow", "Kanpur", "Noida", "Ghaziabad", "Varanasi"]
    },
    {
        state: "Maharashtra",
        cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"]
    },
    {
        state: "Rajasthan",
        cities: ["Jaipur", "Udaipur", "Jodhpur", "Kota", "Ajmer"]
    },
    {
        state: "Gujarat",
        cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"]
    },
    {
        state: "Karnataka",
        cities: ["Bengaluru", "Mysuru", "Mangalore", "Hubli", "Belagavi"]
    },
    {
        state: "Tamil Nadu",
        cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruppur"]
    },
    {
        state: "West Bengal",
        cities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"]
    },
    {
        state: "Punjab",
        cities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali"]
    },
    {
        state: "Telangana",
        cities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"]
    },
    {
        state: "Haryana",
        cities: ["Gurgaon", "Faridabad", "Rohtak", "Hisar", "Panipat"]
    },
];

export default function StoreLocatorPage() {
    const [search, setSearch] = useState("");

    // Filter states & cities based on search
    const filteredData = storeLocations
        .map((item) => ({
            ...item,
            cities: item.cities.filter((city) =>
                city.toLowerCase().includes(search.toLowerCase())
            ),
        }))
        .filter(
            (item) =>
                item.state.toLowerCase().includes(search.toLowerCase()) ||
                item.cities.length > 0
        );

    return (
        <>
        
            <Navbar />
            <CategoryHeader title="Store Locations" />

            {/* PAGE WRAPPER */}
            <div className="max-w-6xl mx-auto px-6 py-10">

                <h1 className="text-4xl font-bold text-gray-900 mb-6">Store Locator</h1>

                {/* SEARCH BAR */}
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search state or city..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-3  rounded-lg shadow-lg focus:ring-2  focus:ring-orange-500"
                    />
                </div>

                {/* LOCATION LIST */}
                <div className="space-y-6">
                    {filteredData.length === 0 && (
                        <p className="text-gray-500">No locations found.</p>
                    )}

                    {filteredData.map((item, index) => (
                        <div key={index} className="bg-white  rounded-xl p-6 shadow-lg hover:shadow-orange-400 transition ">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {item.state}
                            </h2>

                            <div className="mt-3 flex flex-wrap gap-3">
                                {item.cities.map((city, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() =>
                                            window.open(
                                                `https://www.google.com/maps/search/${encodeURIComponent(
                                                    city + ", " + item.state
                                                )}`,
                                                "_blank"
                                            )
                                        }
                                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium cursor-pointer hover:bg-orange-200 transition"
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* EXISTING COMPONENTS */}
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
