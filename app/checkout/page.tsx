/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue, remove, set } from "firebase/database";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { CreditCard, QrCode, Smartphone, Truck, Lock, AlertCircle, Edit2 } from "lucide-react";

export default function CheckoutPage() {
    const router = useRouter();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // --- Form States ---
    const [selectedMethod, setSelectedMethod] = useState("qr");
    const [error, setError] = useState<string | null>(null);

    // Address State
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [address, setAddress] = useState({
        name: "",
        street: "",
        city: "",
        zip: "",
        phone: ""
    });

    // Payment Inputs State
    const [upiId, setUpiId] = useState("");
    const [cardDetails, setCardDetails] = useState({
        number: "",
        expiry: "",
        cvv: ""
    });

    // Calculations
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalMRP = cartItems.reduce((acc, item) => acc + item.mrp * item.qty, 0);
    const discount = totalMRP - totalAmount;

    // 1. Auth & Cart Fetch
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/auth/login");
                return;
            }
            setUser(currentUser);

            // Pre-fill generic name/phone from Auth if available
            setAddress(prev => ({
                ...prev,
                name: currentUser.displayName || "",
                phone: currentUser.phoneNumber || "" // Often null in Firebase unless linked
            }));

            const cartRef = ref(rtdb, `carts/${currentUser.uid}`);
            onValue(cartRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    setCartItems(Object.keys(data).map((key) => ({ slug: key, ...data[key] })));
                } else {
                    setCartItems([]);
                }
                setLoading(false);
            });
        });
        return () => unsubscribe();
    }, [router]);

    // --- VALIDATION LOGIC ---
    const validateOrder = () => {
        // 1. Validate Address
        if (!address.name || !address.street || !address.city || !address.zip || !address.phone) {
            setError("Please fill in all Shipping Address fields.");
            setIsEditingAddress(true); // Open the form so they see what's missing
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }

        // 2. Validate Payment
        if (selectedMethod === 'upi') {
            if (!upiId.includes('@')) {
                setError("Please enter a valid UPI ID (e.g., user@okaxis).");
                return false;
            }
        } else if (selectedMethod === 'card') {
            if (cardDetails.number.length < 16 || cardDetails.cvv.length < 3 || !cardDetails.expiry) {
                setError("Please enter valid Card Details.");
                return false;
            }
        }

        setError(null);
        return true;
    };

    // --- HANDLE ORDER ---
    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) return;

        if (!validateOrder()) return; // Stop if validation fails

        setIsProcessing(true);

        // Simulate Gateway Delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        try {
            const orderId = `ORD-${Date.now()}`;

            await set(ref(rtdb, `orders/${user.uid}/${orderId}`), {
                items: cartItems,
                total: totalAmount,
                method: selectedMethod,
                shippingAddress: address, // Save the address
                paymentDetails: selectedMethod === 'upi' ? { upiId } : selectedMethod === 'card' ? { cardLast4: cardDetails.number.slice(-4) } : {},
                date: new Date().toISOString(),
                status: "Processing"
            });

            await remove(ref(rtdb, `carts/${user.uid}`));
            router.push("/order-success?id=" + orderId);
        } catch (error) {
            // FAILED
            console.error(error);
            router.push("/order-failed");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading Checkout...</div>;

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen py-10">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* --- SECTION 1: ADDRESS --- */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border transition-all">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <Truck className="text-orange-500" /> Shipping Address
                                </h2>
                                {!isEditingAddress && (
                                    <button onClick={() => setIsEditingAddress(true)} className="text-sm text-orange-600 font-semibold flex items-center gap-1">
                                        <Edit2 className="w-4 h-4" /> Edit
                                    </button>
                                )}
                            </div>

                            {isEditingAddress ? (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} className="p-3 border rounded-lg w-full" />
                                        <input type="text" placeholder="Phone Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} className="p-3 border rounded-lg w-full" />
                                    </div>
                                    <input type="text" placeholder="Street Address / Flat No." value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} className="p-3 border rounded-lg w-full" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="p-3 border rounded-lg w-full" />
                                        <input type="text" placeholder="Zip Code" value={address.zip} onChange={e => setAddress({ ...address, zip: e.target.value })} className="p-3 border rounded-lg w-full" />
                                    </div>
                                    <button onClick={() => setIsEditingAddress(false)} className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-bold">
                                        Save Address
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                    {address.name ? (
                                        <div className="text-sm text-gray-700 space-y-1">
                                            <p className="font-bold text-gray-900 text-lg">{address.name}</p>
                                            <p>{address.street}</p>
                                            <p>{address.city}, {address.zip}</p>
                                            <p>Phone: {address.phone}</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic">Please add a shipping address.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* --- SECTION 2: PAYMENT --- */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                            <div className="space-y-3">
                                {/* 1. QR Code */}
                                <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === 'qr' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="pay" value="qr" checked={selectedMethod === 'qr'} onChange={() => setSelectedMethod('qr')} className="accent-orange-600 w-5 h-5" />
                                        <div className="font-semibold flex gap-2 items-center"><QrCode className="w-5 h-5" /> Scan QR Code</div>
                                    </div>
                                    {selectedMethod === 'qr' && (
                                        <div className="mt-4 flex flex-col items-center bg-white p-4 rounded border w-fit mx-auto animate-fade-in">
                                            <Image src="/qr.png" alt="QR" width={140} height={140} />
                                            <p className="text-xs text-gray-500 mt-2">Scan with GPay, Paytm, PhonePe</p>
                                        </div>
                                    )}
                                </label>

                                {/* 2. UPI ID */}
                                <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="pay" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} className="accent-orange-600 w-5 h-5" />
                                        <div className="font-semibold flex gap-2 items-center"><Smartphone className="w-5 h-5" /> UPI ID</div>
                                    </div>
                                    {selectedMethod === 'upi' && (
                                        <div className="mt-4 pl-8 animate-fade-in">
                                            <input
                                                type="text"
                                                placeholder="e.g. mobile-number@okaxis"
                                                className="w-full p-3 border rounded-lg text-sm outline-orange-500"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">A payment request will be sent to this ID.</p>
                                        </div>
                                    )}
                                </label>

                                {/* 3. Credit/Debit Card */}
                                <label className={`flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <input type="radio" name="pay" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} className="accent-orange-600 w-5 h-5" />
                                        <div className="font-semibold flex gap-2 items-center"><CreditCard className="w-5 h-5" /> Credit / Debit Card</div>
                                    </div>
                                    {selectedMethod === 'card' && (
                                        <div className="mt-4 pl-8 space-y-3 animate-fade-in">
                                            <input
                                                type="text"
                                                placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                                                className="w-full p-3 border rounded-lg text-sm outline-orange-500"
                                                maxLength={19}
                                                value={cardDetails.number}
                                                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                            />
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    placeholder="MM/YY"
                                                    className="w-1/2 p-3 border rounded-lg text-sm outline-orange-500"
                                                    maxLength={5}
                                                    value={cardDetails.expiry}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="CVV"
                                                    className="w-1/2 p-3 border rounded-lg text-sm outline-orange-500"
                                                    maxLength={3}
                                                    value={cardDetails.cvv}
                                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </label>

                                {/* 4. Pay Later (Disabled) */}
                                <label className="flex items-center gap-3 p-4 border bg-gray-50 rounded-xl opacity-60 cursor-not-allowed">
                                    <input type="radio" disabled className="w-5 h-5" />
                                    <div className="flex-1 flex justify-between">
                                        <span className="font-semibold flex gap-2 text-gray-500"><AlertCircle className="w-5 h-5" /> Modulae Pay Later</span>
                                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Coming Soon</span>
                                    </div>
                                </label>

                                {/* 5. COD */}
                                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}>
                                    <input type="radio" name="pay" value="cod" checked={selectedMethod === 'cod'} onChange={() => setSelectedMethod('cod')} className="accent-orange-600 w-5 h-5" />
                                    <div className="font-semibold">Cash On Delivery</div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-24">
                            <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                            <div className="space-y-3 pb-4 border-b text-sm text-gray-600">
                                <div className="flex justify-between"><span>Items Total</span><span>₹{totalMRP}</span></div>
                                <div className="flex justify-between text-green-600"><span>Discount</span><span>- ₹{discount}</span></div>
                                <div className="flex justify-between"><span>Delivery</span><span className="text-green-600">FREE</span></div>
                            </div>
                            <div className="flex justify-between pt-4 mb-6 text-xl font-bold text-gray-900">
                                <span>Total Payable</span>
                                <span>₹{totalAmount}</span>
                            </div>

                            {/* Error Message Area */}
                            {error && (
                                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4 flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {error}
                                </div>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold hover:bg-orange-700 disabled:bg-gray-400 flex justify-center gap-2 transition-colors"
                            >
                                {isProcessing ? (
                                    <div className="flex items-center gap-2">
                                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                                        Processing...
                                    </div>
                                ) : (
                                    "Place Order"
                                )}
                            </button>

                            <div className="mt-4 text-center flex justify-center gap-1 text-gray-400 text-xs">
                                <Lock className="w-3 h-3" /> Secure SSL Transaction
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}