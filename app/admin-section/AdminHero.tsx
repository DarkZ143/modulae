/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Save, Plus, Trash2, Image as ImageIcon, Link as LinkIcon, ExternalLink, Edit } from "lucide-react";
import Image from "next/image";

const DEFAULT_SLIDE = {
    id: 0,
    image: "", // The Banner Image
    link: "/shop" // Where the button goes
};

export default function AdminHero() {
    const [slides, setSlides] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(DEFAULT_SLIDE);
    const [isEditing, setIsEditing] = useState(false);

    // 1. Fetch Slides
    const fetchSlides = async () => {
        setLoading(true);
        try {
            const snap = await get(ref(rtdb, "settings/hero_slider"));
            if (snap.exists()) {
                const data = snap.val();
                setSlides(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    // 2. Save / Update
    const handleSave = async () => {
        if (!formData.image) return alert("Image URL is required");

        let updatedSlides = [...slides];

        if (isEditing && formData.id) {
            updatedSlides = updatedSlides.map(s => s.id === formData.id ? formData : s);
        } else {
            updatedSlides.push({ ...formData, id: Date.now() });
        }

        try {
            await set(ref(rtdb, "settings/hero_slider"), updatedSlides);
            setSlides(updatedSlides);
            setIsEditing(false);
            setFormData(DEFAULT_SLIDE);
            alert("Slider updated!");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Failed to save.");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Delete this slide?")) {
            const updated = slides.filter(s => s.id !== id);
            await set(ref(rtdb, "settings/hero_slider"), updated);
            setSlides(updated);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Slider Settings...</div>;

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Hero Slider</h2>
                    <p className="text-sm text-gray-500">Add banner images and their destination links.</p>
                </div>
                <button
                    onClick={() => { setFormData(DEFAULT_SLIDE); setIsEditing(true); }}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-800 shadow-md"
                >
                    <Plus className="w-4 h-4" /> Add Slide
                </button>
            </div>

            {/* --- EDITOR FORM --- */}
            {isEditing && (
                <div className="bg-white p-6 rounded-xl border shadow-lg mb-8 animate-fade-in">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2 text-gray-800">
                        {formData.id ? "Edit Slide" : "New Slide"}
                    </h3>

                    <div className="space-y-4">
                        {/* Image Input */}
                        <div>
                            <label className="block text-xs font-bold mb-1 uppercase text-gray-500">Banner Image URL</label>
                            <div className="flex gap-2">
                                <div className="bg-gray-100 p-2 rounded border">
                                    <ImageIcon className="w-5 h-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://example.com/banner.jpg"
                                    className="flex-1 p-2 border rounded text-sm focus:border-orange-500 outline-none"
                                />
                            </div>
                            {formData.image && (
                                <div className="mt-2 relative h-32 w-full rounded-lg overflow-hidden border">
                                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                </div>
                            )}
                        </div>

                        {/* Link Input */}
                        <div>
                            <label className="block text-xs font-bold mb-1 uppercase text-gray-500">Target Link</label>
                            <div className="flex gap-2">
                                <div className="bg-gray-100 p-2 rounded border">
                                    <LinkIcon className="w-5 h-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.link}
                                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                    placeholder="/shop"
                                    className="flex-1 p-2 border rounded text-sm text-blue-600 focus:border-orange-500 outline-none font-mono"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">Example: /shop, /chairs, /products/woolen-chair</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-100 font-medium">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded text-sm font-bold hover:bg-orange-700 flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Slide
                        </button>
                    </div>
                </div>
            )}

            {/* --- LIST VIEW --- */}
            <div className="space-y-4">
                {slides.map((slide, index) => (
                    <div key={slide.id} className="bg-white border rounded-xl overflow-hidden shadow-sm group flex flex-col sm:flex-row h-auto sm:h-32 transition hover:shadow-md">

                        {/* Image Thumbnail */}
                        <div className="relative w-full sm:w-48 h-32 sm:h-full bg-gray-100 shrink-0">
                            {slide.image ? (
                                <Image src={slide.image} alt="Slide" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                            )}
                            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                                #{index + 1}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-4 flex-1 flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-400 uppercase">Link:</span>
                                <span className="text-sm font-medium text-blue-600 truncate">{slide.link}</span>
                            </div>
                            <p className="text-xs text-gray-500">
                                Users clicking this banner will be redirected to <span className="font-mono bg-gray-100 px-1 rounded">{slide.link}</span>.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="p-4 flex sm:flex-col items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l bg-gray-50">
                            <button
                                onClick={() => { setFormData(slide); setIsEditing(true); }}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded border bg-white transition"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(slide.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded border bg-white transition"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {slides.length === 0 && !isEditing && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-2">No slides configured.</p>
                        <p className="text-sm text-gray-400">Click &quot;Add Slide&quot; to upload a banner.</p>
                    </div>
                )}
            </div>
        </div>
    );
}