/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set, push, remove } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, Edit, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

const DEFAULT_BRAND = {
    id: "",
    name: "",
    image: "",
    description: ""
};

export default function AdminBrands() {
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_BRAND);

    // 1. Fetch Brands
    const fetchBrands = async () => {
        setLoading(true);
        try {
            const snap = await get(ref(rtdb, "settings/brands"));
            if (snap.exists()) {
                const data = snap.val();
                const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setBrands(list);
            } else {
                setBrands([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBrands(); }, []);

    // 2. Save
    const handleSave = async () => {
        if (!formData.name || !formData.image) return alert("Name and Logo URL are required");

        try {
            if (formData.id) {
                // Update
                await set(ref(rtdb, `settings/brands/${formData.id}`), formData);
            } else {
                // Create
                const newRef = push(ref(rtdb, "settings/brands"));
                const newData = { ...formData, id: newRef.key };
                await set(newRef, newData);
            }
            alert("Brand saved successfully!");
            setIsEditing(false);
            fetchBrands();
        } catch (error) {
            alert("Failed to save.");
        }
    };

    // 3. Delete
    const handleDelete = async (id: string) => {
        if (confirm("Delete this brand?")) {
            await remove(ref(rtdb, `settings/brands/${id}`));
            fetchBrands();
        }
    };

    const resetForm = () => {
        setFormData({ id: "", name: "", image: "", description: "" });
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Brands...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Brands Manager</h2>
                    <p className="text-sm text-gray-500">Manage partner brands shown on the website.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-700 shadow-md transition"
                >
                    <Plus className="w-4 h-4" /> Add Brand
                </button>
            </div>

            {/* --- LIST VIEW --- */}
            <div className="space-y-6">
                {brands.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">No brands found. Add one!</div>
                ) : (
                    brands.map((brand) => (
                        <div key={brand.id} className="bg-white border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
                            {/* Logo */}
                            <div className="w-32 h-20 bg-gray-50 rounded-lg border flex items-center justify-center relative overflow-hidden shrink-0">
                                {brand.image ? (
                                    <Image src={brand.image} alt={brand.name} fill className="object-contain p-2" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-300" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-xl font-bold text-gray-900">{brand.name}</h3>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{brand.description}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button onClick={() => { setFormData(brand); setIsEditing(true); }} className="text-blue-600 bg-blue-50 p-2 rounded hover:bg-blue-100 transition"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(brand.id)} className="text-red-600 bg-red-50 p-2 rounded hover:bg-red-100 transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* --- EDITOR MODAL --- */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-lg text-gray-800">{formData.id ? "Edit Brand" : "New Brand"}</h3>
                            <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Brand Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:border-orange-500 outline-none transition"
                                    placeholder="e.g. UrbanWood"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 items-center gap-1"><ImageIcon className="w-3 h-3" /> Logo URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="flex-1 p-3 border rounded-lg text-sm focus:border-orange-500 outline-none transition"
                                        placeholder="https://..."
                                    />
                                    {formData.image && (
                                        <div className="w-12 h-12 relative border rounded overflow-hidden shrink-0 bg-gray-50">
                                            <Image src={formData.image} alt="Preview" fill className="object-contain p-1" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full p-3 border rounded-lg h-32 focus:border-orange-500 outline-none resize-none transition"
                                    placeholder="Write a short description..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2 border rounded-lg hover:bg-gray-50 font-medium transition">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition shadow-md">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}