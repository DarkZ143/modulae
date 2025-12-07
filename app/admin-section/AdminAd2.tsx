/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

const DEFAULT_AD2 = {
    imageUrl: "",
    alt: "Promotional banner",
    subtitle: "25% OFF store by Modulae",
    title: "Great Deals On",
    highlight: "Bathrooms",
    buttonText: "Explore Collection",
    link: "/shop",
};

export default function AdminAd2() {
    const [formData, setFormData] = useState(DEFAULT_AD2);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/ad2"));
                if (snap.exists()) {
                    setFormData(snap.val());
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // 2. Save Data
    const handleSave = async () => {
        if (!formData.imageUrl) return alert("Image URL is required");

        try {
            await set(ref(rtdb, "settings/ad2"), formData);
            alert("Banner updated successfully!");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Failed to save.");
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Banner Settings...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Big Banner Manager</h2>
                    <p className="text-sm text-gray-500">Manage the large promotional banner (Section 2).</p>
                </div>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md font-bold transition">
                    <Save className="w-5 h-5" /> Publish Changes
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* --- PREVIEW --- */}
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-700 mb-2">Live Preview</h3>
                    <div className="relative w-full aspect-2/1 sm:aspect-3/1 bg-gray-100 rounded-xl overflow-hidden border border-gray-300 shadow-sm group">
                        {formData.imageUrl ? (
                            <Image
                                src={formData.imageUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <ImageIcon className="w-10 h-10" />
                            </div>
                        )}

                        {/* Overlay Content Preview */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="bg-black/80 text-white p-4 rounded-lg text-center scale-75 sm:scale-100">
                                <p className="text-xs font-light text-gray-300">{formData.subtitle}</p>
                                <h2 className="text-xl font-bold mt-1">{formData.title}</h2>
                                <h2 className="text-2xl font-bold text-orange-500">{formData.highlight}</h2>
                                <span className="inline-block border border-white text-white text-xs font-semibold py-1 px-3 mt-3">
                                    {formData.buttonText}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- EDITOR FORM --- */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-5">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Image URL</label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subtitle (Top)</label>
                            <input
                                type="text"
                                value={formData.subtitle}
                                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Main Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlight Text</label>
                            <input
                                type="text"
                                value={formData.highlight}
                                onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                                className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none font-bold text-orange-600"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Button Text</label>
                            <input
                                type="text"
                                value={formData.buttonText}
                                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3" /> Target Link</label>
                        <input
                            type="text"
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            className="w-full p-2 border rounded text-sm text-blue-600 focus:border-orange-500 outline-none"
                            placeholder="/shop"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}