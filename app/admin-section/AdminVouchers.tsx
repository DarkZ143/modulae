/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set, remove, push } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Trash2, Plus, Edit, Ticket } from "lucide-react";
import Image from "next/image";

const COLORS = [
    "from-orange-500 to-red-500",
    "from-red-500 to-pink-500",
    "from-yellow-500 to-orange-500",
    "from-indigo-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-pink-500 to-purple-500",
    "from-green-500 to-teal-500",
    "from-gray-700 to-gray-900"
];

// ✅ Helper to truncate description
const truncateWords = (text: string, limit: number) => {
    if (!text) return "";
    const words = text.split(/\s+/); // Split by any whitespace
    if (words.length > limit) {
        return words.slice(0, limit).join(" ") + "...";
    }
    return text;
};

export default function AdminVouchers() {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        title: "",
        desc: "",
        tag: "",
        image: "",
        color: COLORS[0],
        minSpend: 0
    });

    const fetchVouchers = async () => {
        setLoading(true);
        const snap = await get(ref(rtdb, "vouchers"));
        if (snap.exists()) {
            const data = snap.val();
            const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            setVouchers(list);
        } else {
            setVouchers([]);
        }
        setLoading(false);
    };

    useEffect(() => { fetchVouchers(); }, []);

    const handleSave = async () => {
        if (!formData.title || !formData.desc) return alert("Title and Description required");

        if (formData.id) {
            await set(ref(rtdb, `vouchers/${formData.id}`), formData);
        } else {
            const newRef = push(ref(rtdb, "vouchers"));
            await set(newRef, { ...formData, id: newRef.key });
        }

        setIsEditing(false);
        fetchVouchers();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this voucher?")) {
            await remove(ref(rtdb, `vouchers/${id}`));
            fetchVouchers();
        }
    };

    const resetForm = () => {
        setFormData({ id: "", title: "", desc: "", tag: "Special Offer", image: "", color: COLORS[0], minSpend: 0 });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Voucher Manager</h2>
                <button onClick={() => { resetForm(); setIsEditing(true); }} className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700">
                    <Plus className="w-4 h-4" /> Add Voucher
                </button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {vouchers.map((v) => (
                        <div key={v.id} className="bg-white rounded-xl shadow-sm border overflow-hidden relative group flex flex-col">
                            <div className={`h-28 bg-linear-to-r ${v.color} p-4 text-white relative`}>
                                <h3 className="font-bold text-lg truncate pr-12">{v.title}</h3>
                                <p className="text-xs opacity-90">{v.tag}</p>
                                <p className="text-xs mt-1 font-mono bg-black/20 w-fit px-2 py-0.5 rounded">Min Spend: ₹{v.minSpend}</p>
                            </div>

                            <div className="px-4 pt-12 pb-4 relative flex-1 flex flex-col">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center overflow-hidden border-4 border-white z-10">
                                    {v.image ? <Image src={v.image} alt="" width={80} height={80} className="object-cover w-full h-full" /> : <Ticket className="w-8 h-8 text-gray-400" />}
                                </div>

                                {/* ✅ Applied truncation and ensured padding */}
                                <p className="text-sm text-gray-600 text-center mt-2 flex-1 px-2">
                                    {truncateWords(v.desc, 30)}
                                </p>

                                <div className="flex justify-center gap-3 mt-4 pt-4 border-t">
                                    <button onClick={() => { setFormData(v); setIsEditing(true); }} className="text-blue-600 hover:bg-blue-50 p-2 rounded"><Edit className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ... (Modal code remains the same) ... */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold mb-4">{formData.id ? "Edit" : "Add"} Voucher</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold mb-1">Title</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full border p-2 rounded" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold mb-1">Tag</label>
                                    <input type="text" value={formData.tag} onChange={e => setFormData({ ...formData, tag: e.target.value })} className="w-full border p-2 rounded" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-1">Min Cart Value (₹)</label>
                                <input type="number" value={formData.minSpend} onChange={e => setFormData({ ...formData, minSpend: Number(e.target.value) })} className="w-full border p-2 rounded" placeholder="e.g. 5000" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-1">Description</label>
                                <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full border p-2 rounded h-20"></textarea>
                            </div>
                            <div>
                                <label className="block text-xs font-bold mb-1">Image URL</label>
                                <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full border p-2 rounded" placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold mb-2">Color Theme</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setFormData({ ...formData, color: c })}
                                            className={`w-8 h-8 rounded-full bg-linear-to-r ${c} ${formData.color === c ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 bg-orange-600 text-white rounded">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}