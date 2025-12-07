/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set, remove, push } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, Edit, User, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

const DEFAULT_EXPERT = {
    id: "",
    name: "",
    title: "",
    image: "",
    content: ""
};

export default function AdminExperts() {
    const [experts, setExperts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_EXPERT);

    // 1. Fetch Experts
    const fetchExperts = async () => {
        setLoading(true);
        try {
            const snap = await get(ref(rtdb, "settings/experts"));
            if (snap.exists()) {
                const data = snap.val();
                const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setExperts(list);
            } else {
                setExperts([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExperts(); }, []);

    // 2. Save Expert
    const handleSave = async () => {
        if (!formData.name || !formData.title) return alert("Name and Title are required");

        try {
            if (formData.id) {
                // Update
                await set(ref(rtdb, `settings/experts/${formData.id}`), formData);
            } else {
                // Create
                const newRef = push(ref(rtdb, "settings/experts"));
                const newData = { ...formData, id: newRef.key };
                await set(newRef, newData);
            }
            alert("Expert profile saved!");
            setIsEditing(false);
            fetchExperts();
        } catch (error) {
            alert("Failed to save.");
        }
    };

    // 3. Delete Expert
    const handleDelete = async (id: string) => {
        if (confirm("Remove this expert?")) {
            await remove(ref(rtdb, `settings/experts/${id}`));
            fetchExperts();
        }
    };

    const resetForm = () => {
        setFormData({ id: "", name: "", title: "", image: "", content: "" });
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Experts...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Experts Manager</h2>
                    <p className="text-sm text-gray-500">Manage the profiles shown on the Meet Experts page.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-700 shadow-md transition"
                >
                    <Plus className="w-4 h-4" /> Add Expert
                </button>
            </div>

            {/* --- LIST VIEW --- */}
            <div className="grid gap-6">
                {experts.map((exp) => (
                    <div key={exp.id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row gap-6 items-start">
                        {/* Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border shrink-0 relative">
                            {exp.image ? (
                                <Image src={exp.image} alt={exp.name} fill className="object-cover" />
                            ) : (
                                <User className="w-10 h-10 text-gray-400" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900">{exp.name}</h3>
                            <p className="text-sm font-semibold text-orange-600 mb-2">{exp.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{exp.content}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button onClick={() => { setFormData(exp); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded border"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(exp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded border"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}

                {experts.length === 0 && !isEditing && (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">
                        No experts found. Add one to get started.
                    </div>
                )}
            </div>

            {/* --- EDITOR MODAL --- */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{formData.id ? "Edit Expert" : "Add New Expert"}</h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-2 border rounded focus:border-orange-500 outline-none" placeholder="Dr. Name Surname" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title / Designation</label>
                                    <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded focus:border-orange-500 outline-none" placeholder="Senior Wood Technologist" />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Photo URL</label>
                                <div className="flex gap-2">
                                    <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-2 border rounded focus:border-orange-500 outline-none" placeholder="https://..." />
                                    {formData.image && <div className="w-10 h-10 relative rounded-full overflow-hidden border shrink-0"><Image src={formData.image} alt="Preview" fill className="object-cover" /></div>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bio / Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full p-3 border rounded h-40 focus:border-orange-500 outline-none resize-none text-sm leading-relaxed"
                                    placeholder="Write about their expertise here..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2 border rounded hover:bg-gray-100 transition">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded font-bold hover:bg-orange-700 transition shadow-md">Save Expert</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}