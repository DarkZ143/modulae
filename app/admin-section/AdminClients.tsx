/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, Image as ImageIcon, Edit } from "lucide-react";
import Image from "next/image";

const DEFAULT_CLIENT = {
    id: 0,
    name: "",
    imageUrl: "",
    alt: ""
};

export default function AdminClients() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState(DEFAULT_CLIENT);
    const [isEditing, setIsEditing] = useState(false);

    // 1. Fetch Clients
    const fetchClients = async () => {
        setLoading(true);
        try {
            const snap = await get(ref(rtdb, "settings/clients"));
            if (snap.exists()) {
                const data = snap.val();
                if (Array.isArray(data)) setClients(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClients(); }, []);

    // 2. Save
    const handleSave = async () => {
        if (!formData.imageUrl) return alert("Logo URL is required");

        let updatedList = [...clients];

        if (isEditing && formData.id) {
            updatedList = updatedList.map(c => c.id === formData.id ? formData : c);
        } else {
            updatedList.push({ ...formData, id: Date.now() });
        }

        try {
            await set(ref(rtdb, "settings/clients"), updatedList);
            setClients(updatedList);
            setIsEditing(false);
            setFormData(DEFAULT_CLIENT);
            alert("Clients list updated!");
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Failed to save.");
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Remove this client logo?")) {
            const updated = clients.filter(c => c.id !== id);
            await set(ref(rtdb, "settings/clients"), updated);
            setClients(updated);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Clients...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Client Logos</h2>
                    <p className="text-sm text-gray-500">Manage the partner logos displayed in the footer area.</p>
                </div>
                <button
                    onClick={() => { setFormData(DEFAULT_CLIENT); setIsEditing(true); }}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-800 shadow-md"
                >
                    <Plus className="w-4 h-4" /> Add Client
                </button>
            </div>

            {/* --- EDITOR FORM --- */}
            {isEditing && (
                <div className="bg-white p-6 rounded-xl border shadow-lg mb-8 animate-fade-in">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2 text-gray-800">
                        {formData.id ? "Edit Client" : "New Client"}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold mb-1 uppercase text-gray-500">Logo Image URL</label>
                            <input
                                type="text"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                placeholder="https://..."
                                className="w-full p-2 border rounded text-sm focus:border-orange-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1 uppercase text-gray-500">Client Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Furni Style"
                                className="w-full p-2 border rounded text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold mb-1 uppercase text-gray-500">Alt Text</label>
                            <input
                                type="text"
                                value={formData.alt}
                                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                                placeholder="Logo Description"
                                className="w-full p-2 border rounded text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded text-sm hover:bg-gray-100 font-medium">Cancel</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded text-sm font-bold hover:bg-orange-700 flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>
            )}

            {/* --- LIST VIEW --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {clients.map((client) => (
                    <div key={client.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col items-center p-4">
                        <div className="relative w-full h-16 mb-2">
                            {client.imageUrl ? (
                                <Image src={client.imageUrl} alt={client.alt} fill className="object-contain" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                            )}
                        </div>
                        <p className="text-xs font-bold text-gray-700 mb-3">{client.name}</p>

                        <div className="flex gap-2 w-full">
                            <button
                                onClick={() => { setFormData(client); setIsEditing(true); }}
                                className="flex-1 py-1.5 text-blue-600 hover:bg-blue-50 rounded border text-xs font-bold"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(client.id)}
                                className="flex-1 py-1.5 text-red-600 hover:bg-red-50 rounded border text-xs font-bold"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {clients.length === 0 && !isEditing && (
                    <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No clients added yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}