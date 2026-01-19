/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, ChevronDown, Crosshair, X, User, HelpCircle, LogOut, Package, Heart, Settings } from "lucide-react";
import { useLocation } from "../context/LocationContext";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // ✅ Import usePathname

export default function PincodeBar() {
    const { location, updatePincode, updateLiveLocation } = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempPincode, setTempPincode] = useState("");

    const [user, setUser] = useState<any>(null);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const pathname = usePathname(); // ✅ Get current route

    // ✅ LOGIC: HIDE on specific pages
    // If pathname starts with /admin-section, /auth, or /checkout -> Don't render
    const hiddenRoutes = ["/admin-section", "/auth", "/checkout"];
    const shouldHide = hiddenRoutes.some((route) => pathname?.startsWith(route));

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            unsubscribe();
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleApply = () => {
        if (tempPincode.length === 6) {
            updatePincode(tempPincode);
            setIsModalOpen(false);
        } else {
            alert("Please enter a valid 6-digit pincode.");
        }
    };

    const handleGPS = () => {
        updateLiveLocation();
        setIsModalOpen(false);
    };

    const handleLogout = async () => {
        await signOut(auth);
        setIsUserMenuOpen(false);
        router.push("/");
    };

    const getFirstName = (fullName: string | null) => {
        if (!fullName) return "User";
        return fullName.split(" ")[0];
    };

    // ✅ Return NULL if on restricted pages
    if (shouldHide) return null;

    return (
        <>
            {/* --- THE BAR (Amazon Blue-ish Style) --- */}
            <div className="bg-[#232f3e] text-white px-4 py-2.5 flex justify-between items-center text-sm">

                {/* LEFT: Location */}
                <div
                    className="flex items-center gap-1 cursor-pointer hover:text-orange-400 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    <MapPin className="w-4 h-4" />
                    <div className="leading-none">
                        <p className="text-[10px] text-gray-300">Deliver to</p>
                        <p className="font-bold flex items-center gap-1 text-xs md:text-sm whitespace-nowrap">
                            {location.isSet ? location.locationName : "Select your address"}
                            <ChevronDown className="w-3 h-3 opacity-70" />
                        </p>
                    </div>
                </div>

                {/* RIGHT: Links & Account */}
                <div className="flex items-center gap-4 md:gap-6">
                    <Link href="/pages/faq" className="hidden md:flex items-center gap-1 hover:text-orange-400 transition-colors">
                        <HelpCircle className="w-4 h-4" /> FAQ
                    </Link>

                    <div className="relative" ref={userMenuRef}>
                        <button
                            onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : router.push('/auth/login')}
                            className="flex items-center gap-2 hover:text-orange-400 transition-colors focus:outline-none"
                        >
                            <User className="w-4 h-4" />
                            <span className="font-bold truncate max-w-[100px] md:max-w-none">
                                {user ? `Hello, ${getFirstName(user.displayName)}` : "Login / Sign Up"}
                            </span>
                            {user && <ChevronDown className="w-3 h-3" />}
                        </button>

                        {isUserMenuOpen && user && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50 border border-gray-200 animate-fade-in">
                                <div className="px-4 py-2 border-b border-gray-100">
                                    <p className="text-xs text-gray-500">Signed in as</p>
                                    <p className="font-bold truncate">{user.email}</p>
                                </div>
                                <Link
                                    href="/profile"
                                    className=" px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-600  gap-2 flex items-center justify-left"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <User className="w-4 h-4" /> Dashboard
                                </Link>
                                <Link
                                    href="/my-orders"
                                    className=" px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-600  gap-2 flex items-center justify-left"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Package className="w-4 h-4" /> Your Orders
                                </Link>
                                <Link href="/wishlist" className=" px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-600  gap-2 flex items-center justify-left"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Heart className="w-4 h-4" /> Wishlist
                                </Link>
                                <Link href="/addresses" className=" px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-600  gap-2 flex items-center justify-left"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <MapPin className="w-4 h-4" /> Saved Addresses
                                </Link>
                                <Link href="/settings" className=" px-4 py-2 text-sm hover:bg-gray-50 hover:text-orange-600  gap-2 flex items-center justify-left" 
                                onClick={()=> setIsUserMenuOpen(false)}>
                                    <Settings className="w-4 h-4"/> Settings
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 mt-1"
                                >
                                    <LogOut className="w-4 h-4" /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-md rounded-lg shadow-2xl overflow-hidden animate-slide-up">
                        <div className="bg-[#f0f2f2] border-b p-4 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-800">Choose your location</h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <p className="text-sm text-gray-600">
                                Select a delivery location to see product availability and delivery options.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter Pincode"
                                    maxLength={6}
                                    value={tempPincode}
                                    onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                                    className="flex-1 border border-gray-400 rounded-md px-3 py-2 focus:ring-2 focus:ring-orange-400 outline-none"
                                />
                                <button onClick={handleApply} className="bg-white border border-gray-300 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 font-medium">
                                    Apply
                                </button>
                            </div>
                            <div className="relative flex py-1 items-center">
                                <div className="grow border-t border-gray-300"></div>
                                <span className="shrink-0 mx-4 text-gray-400 text-xs">OR</span>
                                <div className="grow border-t border-gray-300"></div>
                            </div>
                            <button onClick={handleGPS} className="w-full flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 text-white py-2.5 rounded-md font-bold shadow-md transition-colors">
                                <Crosshair className="w-5 h-5" /> Use My Current Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}