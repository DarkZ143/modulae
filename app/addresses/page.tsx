/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { User, Package, Heart, MapPin, Settings, Plus, Trash2 } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";



export default function AddressesPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [addresses, setAddresses] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);

    // Form fields
    const [houseNo, setHouseNo] = useState("");
    const [village, setVillage] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");

    // Redirect if user not logged in
    useEffect(() => {
        if (!loading && !user) router.push("/auth/login");
    }, [loading, user]);

    // Fetch user addresses from Firestore
    useEffect(() => {
        if (!user) return;

        const fetchAddress = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const snap = await getDoc(userRef);

                if (snap.exists()) {
                    setAddresses(snap.data().addresses || []);
                } else {
                    setAddresses([]);
                }
            } catch (error) {
                console.error("Firestore offline / fetch failed:", error);
                // ✅ Fallback: do NOT crash UI
                setAddresses([]);
            }
        };

        fetchAddress();
    }, [user]);


    // Save new address
    const handleSaveAddress = async () => {
        if (!user) return;

        if (!village || !city || !state || !pincode) {
            alert("Please fill all fields");
            return;
        }

        const newAddress = { houseNo, village, city, state, pincode, landmark };
        const userRef = doc(db, "users", user.uid);

        try {
            const snap = await getDoc(userRef);

            if (!snap.exists()) {
                await setDoc(userRef, {
                    addresses: [newAddress],
                    email: user.email || "",
                    createdAt: new Date(),
                });
            } else {
                await updateDoc(userRef, {
                    addresses: [...addresses, newAddress],
                });
            }

            setAddresses((prev) => [...prev, newAddress]);
            setShowModal(false);

            // reset form
            setHouseNo("");
            setVillage("");
            setCity("");
            setState("");
            setPincode("");
            setLandmark("");
        } catch (error) {
            alert("Network issue. Please check your internet connection.");
            console.error("Save address failed:", error);
        }
    };



    // Delete address
    const handleDeleteAddress = async (index: number) => {
        if (!user) return;

        const updated = addresses.filter((_, i) => i !== index);
        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, { addresses: updated });
        setAddresses(updated);
    };


   


    // ========================= Sidebar Component =========================
    const Sidebar = () => (
        <aside className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 h-fit lg:sticky lg:top-24 w-full lg:w-72 shrink-0">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm text-gray-500">Hello,</p>
                    <h2 className="text-lg font-bold text-gray-800 truncate">{user?.displayName || "User"}</h2>
                </div>
            </div>

            <nav className="space-y-1">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <User className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/my-orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <Package className="w-5 h-5" /> My Orders
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <Heart className="w-5 h-5" /> My Wishlist
                </Link>
                {/* Active Link */}
                <Link href="/addresses" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 font-semibold rounded-lg transition-colors">
                    <MapPin className="w-5 h-5" /> Saved Addresses
                </Link>
                {<Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <Settings className="w-5 h-5" /> Settings
                </Link>}
                
            </nav>
        </aside>
    );


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    return (
        <>

            <Navbar />

            <div className="bg-gray-50 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">

                    {/* Use the local Sidebar component */}
                    <Sidebar />

                    <div className="flex-1 bg-white rounded-xl shadow-sm p-6 border border-gray-100 min-h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Add New Address
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            {addresses.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <MapPin className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No addresses saved yet.</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {addresses.map((addr, i) => (
                                        <div key={i} className="relative border border-gray-200 p-5 rounded-xl bg-white hover:shadow-md transition group">

                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDeleteAddress(i)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                                    title="Delete Address"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="space-y-1 text-sm text-gray-600">
                                                {addr.houseNo && <p className="font-semibold text-gray-900">{addr.houseNo}</p>}
                                                <p>{addr.village}</p>
                                                {addr.landmark && (
                                                    <p className="text-xs text-gray-500">Near {addr.landmark}</p>
                                                )}
                                                <p>{addr.city}, {addr.state} - <span className="font-semibold text-gray-900">{addr.pincode}</span></p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            {/* ------------------ Modal ------------------ */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md animate-slide-up">
                        <h3 className="text-xl font-bold mb-6 text-gray-800">Add New Address</h3>

                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="House / Plot Number"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                value={houseNo}
                                onChange={(e) => setHouseNo(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Area / Street / Village"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                value={village}
                                onChange={(e) => setVillage(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Landmark (Optional)"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />

                                <input
                                    type="text"
                                    placeholder="State"
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                />
                            </div>

                            <input
                                type="number" // Changed to number for mobile keyboard
                                placeholder="Pincode"
                                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveAddress}
                                className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium shadow-md transition"
                            >
                                Save Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}