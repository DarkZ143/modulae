/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Image as ImageIcon, Link as LinkIcon, MousePointer2 } from "lucide-react";
import Image from "next/image";

// Default layout configuration (Fixed structure)
const DEFAULT_ADS = [
    { id: 1, title: "Main Banner (Wide)", type: "Wide (2:1)", imageUrl: "", href: "/shop", gridSpan: "lg:col-span-2", aspectClass: "aspect-[2/1]" },
    { id: 2, title: "Side Banner Top (Square)", type: "Square (1:1)", imageUrl: "", href: "/shop", gridSpan: "lg:col-span-1", aspectClass: "aspect-square" },
    { id: 3, title: "Side Banner Bottom (Square)", type: "Square (1:1)", imageUrl: "", href: "/shop", gridSpan: "lg:col-span-1", aspectClass: "aspect-square" }
];

export default function AdminAds() {
    const [ads, setAds] = useState<any[]>(DEFAULT_ADS);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/ads"));
                if (snap.exists()) {
                    const data = snap.val();
                    // Ensure we have 3 slots even if DB has partial data
                    const merged = DEFAULT_ADS.map((def, idx) => data[idx] || def);
                    setAds(merged);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Handle Change
    const handleChange = (index: number, field: string, value: string) => {
        const updated = [...ads];
        updated[index][field] = value;
        setAds(updated);
    };

    // 3. Save
    const handleSave = async () => {
        try {
            await set(ref(rtdb, "settings/ads"), ads);
            alert("Ads updated successfully!");
        } catch (error) {
            alert("Failed to save.");
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Ad Manager...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Promo Ads Manager</h2>
                    <p className="text-sm text-gray-500">Manage the 3 grid images on the homepage.</p>
                </div>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md font-bold transition">
                    <Save className="w-5 h-5" /> Publish Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preview Section (Visual Layout) */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 mb-2">Live Preview Layout</h3>
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 rounded-xl border border-gray-200">
                        {ads.map((ad, i) => (
                            <div
                                key={ad.id}
                                className={`relative bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm ${ad.gridSpan} ${ad.aspectClass}`}
                            >
                                {ad.imageUrl ? (
                                    <Image src={ad.imageUrl} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                        <ImageIcon className="w-8 h-8 mb-1" />
                                        <span className="text-[10px] uppercase font-bold">Slot {i + 1}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/10 hover:bg-black/0 transition"></div>
                                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                                    {ad.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editors */}
                <div className="space-y-6">
                    {ads.map((ad, index) => (
                        <div key={ad.id} className="bg-white p-5 rounded-xl border shadow-sm">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <h4 className="font-bold text-gray-800">Slot {index + 1}: <span className="text-orange-600">{ad.title}</span></h4>
                                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">{ad.type}</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 items-center gap-1"><ImageIcon className="w-3 h-3" /> Image URL</label>
                                    <input
                                        type="text"
                                        value={ad.imageUrl}
                                        onChange={(e) => handleChange(index, "imageUrl", e.target.value)}
                                        className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 items-center gap-1"><MousePointer2 className="w-3 h-3" /> Destination Link</label>
                                    <input
                                        type="text"
                                        value={ad.href}
                                        onChange={(e) => handleChange(index, "href", e.target.value)}
                                        className="w-full p-2 border rounded text-sm text-blue-600 focus:border-orange-500 outline-none"
                                        placeholder="/shop"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alt Text (SEO)</label>
                                    <input
                                        type="text"
                                        value={ad.alt || ""}
                                        onChange={(e) => handleChange(index, "alt", e.target.value)}
                                        className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                                        placeholder="Ad description"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}