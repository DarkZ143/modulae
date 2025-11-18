/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopOfferBar from "../components/TopOfferBar";
import AccountSidebar from "../components/AccountSidebar";

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

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
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                setAddresses(snap.data().addresses || []);
            }
        };

        fetchAddress();
    }, [user]);

    // Save new address
    const handleSaveAddress = async () => {
        if (!user) return; // <-- TypeScript safety

        if (!village || !city || !state || !pincode) {
            alert("Please fill all fields");
            return;
        }

        const newAddress = { village, city, state, pincode, landmark };

        const userRef = doc(db, "users", user.uid); // now guaranteed safe
        await updateDoc(userRef, {
            addresses: [...addresses, newAddress],
        });

        setAddresses((prev) => [...prev, newAddress]);

        setVillage("");
        setCity("");
        setState("");
        setPincode("");
        setLandmark("");

        setShowModal(false);
    };


    // Delete address
    const handleDeleteAddress = async (index: number) => {
        const updated = addresses.filter((_, i) => i !== index);
        if (!user) return;
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { addresses: updated });

        setAddresses(updated);
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <>
            <TopOfferBar />
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
                <AccountSidebar />

                <div className="flex-1 bg-white rounded-xl shadow-sm p-6 border">
                    <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>

                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                    >
                        + Add New Address
                    </button>

                    <div className="mt-6 space-y-4">
                        {addresses.length === 0 ? (
                            <p className="text-gray-600 mt-4">No addresses saved.</p>
                        ) : (
                            addresses.map((addr, i) => (
                                <div key={i} className="relative border p-4 rounded-lg bg-gray-50 shadow-sm">

                                    {/* DELETE BUTTON */}
                                    <button
                                        onClick={() => handleDeleteAddress(i)}
                                        className="absolute top-3 right-3 text-red-500 text-sm hover:underline"
                                    >
                                        Delete
                                    </button>

                                    <p><strong>House No:</strong> {addr.houseNo}</p>
                                    <p><strong>Village/Colony:</strong> {addr.village}</p>
                                    {addr.landmark && (
                                        <p><strong>Landmark:</strong> {addr.landmark}</p>
                                    )}
                                    <p><strong>City:</strong> {addr.city}</p>
                                    <p><strong>State:</strong> {addr.state}</p>
                                    <p><strong>Pincode:</strong> {addr.pincode}</p>
                                </div>
                            ))

                        )}
                    </div>
                </div>
            </div>

            <Footer />

            {/* ------------------ Modal ------------------ */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">Add New Address</h3>

                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="House / Plot Number"
                                className="w-full border p-2 rounded"
                                value={houseNo}
                                onChange={(e) => setHouseNo(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Village / Colony"
                                className="w-full border p-2 rounded"
                                value={village}
                                onChange={(e) => setVillage(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Landmark (Optional)"
                                className="w-full border p-2 rounded"
                                value={landmark}
                                onChange={(e) => setLandmark(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="City"
                                className="w-full border p-2 rounded"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="State"
                                className="w-full border p-2 rounded"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Pincode"
                                className="w-full border p-2 rounded"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSaveAddress}
                                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
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
