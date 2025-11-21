/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set, remove } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Trash2, Plus, Edit, Image as ImageIcon, X, ChevronDown, ChevronRight, Folder } from "lucide-react";
import Image from "next/image";

const CATEGORIES = [
    "products", "chairs", "dining", "furniture", "kitchen", 
    "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

export default function AdminProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    
    // Tree View State
    const [expandedCategory, setExpandedCategory] = useState<string | null>("products");

    // --- FORM STATE ---
    const [formData, setFormData] = useState({
        category: "products",
        slug: "",
        title: "",
        price: 0,
        mrp: 0,
        stock: 10,
        description: "",
        rating: 4.5,
        reviews: 0,
        images: [] as string[],
        specifications: {} as Record<string, string>
    });
    const [newImageUrl, setNewImageUrl] = useState("");
    const [newSpecKey, setNewSpecKey] = useState("");
    const [newSpecValue, setNewSpecValue] = useState("");

    // --- FETCH ALL PRODUCTS ---
    const fetchProducts = async () => {
        setLoading(true);
        let combined: any[] = [];
        for (const cat of CATEGORIES) {
            const snap = await get(ref(rtdb, `${cat}/`));
            if (snap.exists()) {
                const data = snap.val();
                const items = Object.keys(data).map(key => ({
                    id: key,
                    category: cat,
                    ...data[key]
                }));
                combined = [...combined, ...items];
            }
        }
        setProducts(combined);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    // --- HANDLERS ---
    const toggleCategory = (cat: string) => {
        setExpandedCategory(expandedCategory === cat ? null : cat);
    };

    const handleAddImage = () => {
        if (newImageUrl && !formData.images.includes(newImageUrl)) {
            setFormData({ ...formData, images: [...formData.images, newImageUrl] });
            setNewImageUrl("");
        }
    };

    const handleRemoveImage = (urlToRemove: string) => {
        setFormData({ ...formData, images: formData.images.filter(url => url !== urlToRemove) });
    };

    const handleAddSpec = () => {
        if (newSpecKey && newSpecValue) {
            setFormData({ ...formData, specifications: { ...formData.specifications, [newSpecKey]: newSpecValue } });
            setNewSpecKey("");
            setNewSpecValue("");
        }
    };

    const handleRemoveSpec = (keyToRemove: string) => {
        const newSpecs = { ...formData.specifications };
        delete newSpecs[keyToRemove];
        setFormData({ ...formData, specifications: newSpecs });
    };

    const handleSave = async () => {
        if (!formData.slug || !formData.title) return alert("Slug and Title are required");
        if (formData.images.length === 0) return alert("At least one image URL is required");

        const productRef = ref(rtdb, `${formData.category}/${formData.slug}`);
        await set(productRef, {
            title: formData.title,
            price: Number(formData.price),
            mrp: Number(formData.mrp),
            stock: Number(formData.stock),
            description: formData.description,
            rating: Number(formData.rating),
            reviews: Number(formData.reviews),
            images: formData.images,
            specifications: formData.specifications
        });

        alert("Product Saved Successfully!");
        setIsEditing(false);
        fetchProducts();
    };

    const handleDelete = async (category: string, id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        await remove(ref(rtdb, `${category}/${id}`));
        fetchProducts();
    };

    const resetForm = () => {
        setFormData({
            category: expandedCategory || "products", 
            slug: "", title: "", price: 0, mrp: 0, stock: 10, description: "",
            rating: 4.5, reviews: 0, images: [], specifications: {}
        });
        setNewImageUrl("");
        setNewSpecKey("");
        setNewSpecValue("");
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-100 pt-2 pb-4 z-10">
                <h2 className="text-3xl font-bold text-gray-800">Inventory Tree</h2>
                <button 
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition shadow-md"
                >
                    <Plus className="w-4 h-4" /> Add New Product
                </button>
            </div>

            {/* --- TREE STRUCTURE --- */}
            <div className="space-y-4 pb-20">
                {loading ? (
                    <p className="text-gray-500 text-center py-10 animate-pulse">Loading your catalog...</p>
                ) : (
                    CATEGORIES.map((categoryName) => {
                        const categoryProducts = products.filter(p => p.category === categoryName);
                        const isOpen = expandedCategory === categoryName;

                        return (
                            <div key={categoryName} className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all shadow-sm hover:shadow-md">
                                
                                {/* Category Header */}
                                <button 
                                    onClick={() => toggleCategory(categoryName)}
                                    className={`w-full flex justify-between items-center p-4 text-left transition-colors ${isOpen ? 'bg-orange-50 border-b border-orange-100' : 'bg-white hover:bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        {isOpen ? <ChevronDown className="w-5 h-5 text-orange-600" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
                                        <div className="flex items-center gap-2">
                                            <Folder className={`w-5 h-5 ${isOpen ? 'text-orange-500' : 'text-gray-400'}`} />
                                            <span className="font-bold text-lg capitalize text-gray-800">{categoryName.replace('-', ' ')}</span>
                                        </div>
                                    </div>
                                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                                        {categoryProducts.length} Items
                                    </span>
                                </button>

                                {/* Items Table */}
                                {isOpen && (
                                    <div className="p-0 animate-slide-down">
                                        {categoryProducts.length === 0 ? (
                                            <div className="p-8 text-center text-gray-400 italic bg-gray-50">
                                                No products in this folder yet.
                                            </div>
                                        ) : (
                                            <table className="w-full text-left">
                                                <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
                                                    <tr>
                                                        <th className="p-4 pl-6">Image</th>
                                                        <th className="p-4">Product Details</th>
                                                        <th className="p-4">Price</th>
                                                        <th className="p-4">Stock</th>
                                                        <th className="p-4 text-right pr-6">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {categoryProducts.map((p) => (
                                                        <tr key={p.id} className="hover:bg-orange-50/30 transition">
                                                            <td className="p-4 pl-6 w-20">
                                                                <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center overflow-hidden relative">
                                                                    {p.images?.[0] ? (
                                                                        <Image src={p.images[0]} alt="" fill sizes="48px" className="object-cover" />
                                                                    ) : <ImageIcon className="w-5 h-5 text-gray-400" />}
                                                                </div>
                                                            </td>
                                                            <td className="p-4">
                                                                <p className="font-semibold text-gray-900 text-sm line-clamp-1">{p.title}</p>
                                                                <p className="text-xs text-gray-500 font-mono">{p.id}</p>
                                                            </td>
                                                            <td className="p-4 font-medium text-sm">₹{p.price}</td>
                                                            <td className="p-4">
                                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${p.stock > 5 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                                    {p.stock > 0 ? `${p.stock}` : 'OOS'}
                                                                </span>
                                                            </td>
                                                            <td className="p-4 pr-6 text-right">
                                                                <div className="flex justify-end gap-2">
                                                                    <button 
                                                                        onClick={() => {
                                                                            setFormData({
                                                                                category: p.category, slug: p.id, title: p.title, price: p.price, mrp: p.mrp, stock: p.stock,
                                                                                description: p.description, rating: p.rating || 4.5, reviews: p.reviews || 0,
                                                                                images: p.images || [], specifications: p.specifications || {}
                                                                            });
                                                                            setIsEditing(true);
                                                                        }} 
                                                                        className="p-2 rounded hover:bg-blue-50 text-blue-600 transition"
                                                                    >
                                                                        <Edit className="w-4 h-4" />
                                                                    </button>
                                                                    <button 
                                                                        onClick={() => handleDelete(p.category, p.id)} 
                                                                        className="p-2 rounded hover:bg-red-50 text-red-600 transition"
                                                                    >
                                                                        <Trash2 className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* --- FULL MODAL WITH ALL FIELDS --- */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                        
                        <div className="flex justify-between items-center mb-6 pb-4 border-b">
                            <h3 className="text-xl font-bold text-gray-800">
                                {formData.slug ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setIsEditing(false)} className="p-2 rounded-full hover:bg-gray-100 transition"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-5">
                            {/* 1. Basic Info */}
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Category</label>
                                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border p-2.5 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-100 outline-none transition">
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Unique ID (Slug)</label>
                                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s/g, '-')})} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" placeholder="e.g. modern-sofa"/>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" />
                            </div>

                            {/* 2. Pricing & Stock */}
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Price (₹)</label>
                                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">MRP (₹)</label>
                                <input type="number" value={formData.mrp} onChange={e => setFormData({...formData, mrp: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" />
                            </div>
                            
                            {/* 3. Stock & Ratings */}
                            <div>
                                <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Stock</label>
                                <input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-orange-100 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Rating</label>
                                    <input type="number" step="0.1" value={formData.rating} onChange={e => setFormData({...formData, rating: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Reviews</label>
                                    <input type="number" value={formData.reviews} onChange={e => setFormData({...formData, reviews: Number(e.target.value)})} className="w-full border p-2.5 rounded-lg" />
                                </div>
                            </div>

                            {/* 4. Description */}
                            <div className="col-span-2">
                                <label className="block text-xs font-bold mb-1 text-gray-600 uppercase">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2.5 rounded-lg h-24 focus:ring-2 focus:ring-orange-100 outline-none resize-none"></textarea>
                            </div>

                            {/* 5. Multiple Images */}
                            <div className="col-span-2 border-t pt-4 mt-2">
                                <label className="block text-sm font-bold mb-2 text-gray-800">Product Images</label>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} className="flex-1 border p-2.5 rounded-lg text-sm focus:border-orange-500 outline-none" placeholder="https://example.com/image.jpg" />
                                    <button onClick={handleAddImage} type="button" className="bg-gray-900 text-white px-4 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">Add</button>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {formData.images.map((url, idx) => (
                                        <div key={idx} className="relative w-20 h-20 border rounded-lg overflow-hidden group bg-gray-100">
                                            <Image src={url} alt="preview" fill sizes="80px" className="object-cover" />
                                            <button onClick={() => handleRemoveImage(url)} type="button" className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                <X className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 6. Specifications */}
                            <div className="col-span-2 border-t pt-4">
                                <label className="block text-sm font-bold mb-2 text-gray-800">Specifications</label>
                                <div className="flex gap-2 mb-3">
                                    <input type="text" value={newSpecKey} onChange={e => setNewSpecKey(e.target.value)} className="flex-1 border p-2.5 rounded-lg text-sm" placeholder="Key (e.g. Material)" />
                                    <input type="text" value={newSpecValue} onChange={e => setNewSpecValue(e.target.value)} className="flex-1 border p-2.5 rounded-lg text-sm" placeholder="Value (e.g. Teak Wood)" />
                                    <button onClick={handleAddSpec} type="button" className="bg-gray-900 text-white px-4 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">Add</button>
                                </div>
                                <div className="space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {Object.entries(formData.specifications).map(([key, value]) => (
                                        <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-200 last:border-0">
                                            <span><span className="font-semibold text-gray-700">{key}:</span> {value}</span>
                                            <button onClick={() => handleRemoveSpec(key)} type="button" className="text-red-500 hover:text-red-700"><X className="w-4 h-4"/></button>
                                        </div>
                                    ))}
                                    {Object.keys(formData.specifications).length === 0 && <p className="text-xs text-gray-400 italic text-center">No specifications added.</p>}
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3 mt-8 border-t pt-4">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 border rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200">Save Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}