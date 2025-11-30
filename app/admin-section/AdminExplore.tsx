/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set, query, limitToFirst } from "firebase/database"; // ✅ Added query & limitToFirst
import { rtdb } from "@/lib/firebase";
import { Save, Eye, EyeOff, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

const DEFAULT_CATEGORIES = [
    "chairs", "dining", "furniture", "kitchen",
    "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

export default function AdminExplore() {
    const [categories, setCategories] = useState<string[]>([]);
    const [exploreData, setExploreData] = useState<Record<string, any>>({});
    // ✅ New State to hold the auto-fetched images
    const [previewImages, setPreviewImages] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [newCategory, setNewCategory] = useState("");

    // 1. Fetch Data
    const fetchData = async () => {
        setLoading(true);
        try {
            // A. Get Categories List
            const catRef = ref(rtdb, 'settings/categories');
            const catSnap = await get(catRef);

            let activeCategories = DEFAULT_CATEGORIES;
            if (catSnap.exists()) {
                activeCategories = catSnap.val();
            } else {
                await set(catRef, DEFAULT_CATEGORIES);
            }
            setCategories(activeCategories);

            // B. Get Explore Config
            const exploreRef = ref(rtdb, 'settings/explore_config');
            const exploreSnap = await get(exploreRef);
            if (exploreSnap.exists()) {
                setExploreData(exploreSnap.val());
            } else {
                const initialData: any = {};
                activeCategories.forEach((c) => {
                    initialData[c] = { visible: true, customImage: "" };
                });
                setExploreData(initialData);
            }

            // ✅ C. Auto-Fetch First Product Image for each Category (Preview Logic)
            const imageMap: Record<string, string> = {};

            const imagePromises = activeCategories.map(async (cat) => {
                // Fetch only the first item to be efficient
                const q = query(ref(rtdb, `${cat}`), limitToFirst(1));
                const snap = await get(q);

                if (snap.exists()) {
                    const data = snap.val();
                    const firstKey = Object.keys(data)[0];
                    const product = data[firstKey];

                    if (product.images && product.images.length > 0) {
                        imageMap[cat] = product.images[0];
                    } else if (product.image) {
                        imageMap[cat] = product.image;
                    }
                }
            });

            await Promise.all(imagePromises);
            setPreviewImages(imageMap); // Save previews to state

        } catch (error) {
            console.error("Error loading explore settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // 2. Handlers
    const toggleVisibility = (cat: string) => {
        setExploreData(prev => ({
            ...prev,
            [cat]: { ...prev[cat], visible: !prev[cat]?.visible }
        }));
    };

    const updateImage = (cat: string, url: string) => {
        setExploreData(prev => ({
            ...prev,
            [cat]: { ...prev[cat], customImage: url }
        }));
    };

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        const slug = newCategory.toLowerCase().replace(/\s+/g, '-');

        if (categories.includes(slug)) {
            alert("Category already exists!");
            return;
        }

        const updatedCategories = [...categories, slug];
        setCategories(updatedCategories);

        await set(ref(rtdb, 'settings/categories'), updatedCategories);

        setExploreData(prev => ({
            ...prev,
            [slug]: { visible: true, customImage: "" }
        }));

        setNewCategory("");
        fetchData(); // Refresh to fetch empty preview for new cat
    };

    const handleDeleteCategory = async (catToDelete: string) => {
        if (!confirm(`Remove "${catToDelete}" from Explore?`)) return;

        const updatedCategories = categories.filter(c => c !== catToDelete);
        setCategories(updatedCategories);

        await set(ref(rtdb, 'settings/categories'), updatedCategories);

        const newExploreData = { ...exploreData };
        delete newExploreData[catToDelete];
        setExploreData(newExploreData);
        await set(ref(rtdb, 'settings/explore_config'), newExploreData);
    };

    const handleSave = async () => {
        try {
            await set(ref(rtdb, 'settings/explore_config'), exploreData);
            alert("Homepage Explore settings updated!");
        } catch (error) {
            alert("Failed to save settings.");
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading settings...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Explore Section Manager</h2>
                    <p className="text-sm text-gray-500">Manage categories visible on the homepage.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition shadow-md font-bold"
                >
                    <Save className="w-5 h-5" /> Save Changes
                </button>
            </div>

            {/* Add Category */}
            <div className="bg-white p-4 rounded-xl border shadow-sm mb-8 flex gap-3 items-end max-w-md">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Add New Category</label>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="e.g. Gaming Chairs"
                        className="w-full p-2 border rounded-lg outline-none focus:border-orange-500"
                    />
                </div>
                <button
                    onClick={handleAddCategory}
                    disabled={!newCategory}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 flex items-center gap-2 h-[42px]"
                >
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => {
                    const data = exploreData[cat] || { visible: true, customImage: "" };

                    // ✅ LOGIC: Use custom image OR auto-fetched image from state
                    const displayImage = data.customImage || previewImages[cat] || "";

                    return (
                        <div key={cat} className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${!data.visible ? 'opacity-60 border-gray-200' : 'border-orange-200 ring-1 ring-orange-100'}`}>

                            {/* Card Header */}
                            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                                <h3 className="font-bold text-lg capitalize text-gray-800">{cat.replace(/-/g, ' ')}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleVisibility(cat)}
                                        className={`p-2 rounded-full transition ${data.visible ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}
                                        title={data.visible ? "Visible" : "Hidden"}
                                    >
                                        {data.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCategory(cat)}
                                        className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition"
                                        title="Remove Category"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 space-y-4">
                                {/* Image Preview */}
                                <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center group">
                                    {displayImage ? (
                                        <Image
                                            src={displayImage}
                                            alt={cat}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="text-center text-gray-400 flex flex-col items-center gap-2">
                                            <ImageIcon className="w-8 h-8" />
                                            <span className="text-xs">No products found</span>
                                        </div>
                                    )}

                                    {/* Badge to show source */}
                                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded text-[10px] font-bold bg-black/70 text-white backdrop-blur-sm">
                                        {data.customImage ? "Custom Image" : "Auto-Fetched"}
                                    </div>
                                </div>

                                {/* Image Input */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cover Image URL</label>
                                    <input
                                        type="text"
                                        value={data.customImage || ""}
                                        onChange={(e) => updateImage(cat, e.target.value)}
                                        placeholder="https://..."
                                        className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Leave empty to auto-fetch from the first product.</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}