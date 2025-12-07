/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, Edit, Image as ImageIcon, Users, Factory, Briefcase } from "lucide-react";
import Image from "next/image";

const DEFAULT_GALLERY = {
    teamMembers: [
        { name: "Arjun Mehra", role: "Head of Manufacturing", image: "" },
        { name: "Riya Kapoor", role: "Operations Manager", image: "" }
    ],
    factoryLocations: [
        { title: "Delhi Manufacturing Unit", image: "", desc: "Primary production facility." }
    ],
    workCulture: [
        { title: "Creative Workspace", image: "", desc: "Collaborative space for designers." }
    ]
};

export default function AdminGallery() {
    const [data, setData] = useState<any>(DEFAULT_GALLERY);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("team"); // team, factory, culture

    // Temp States
    const [newItem, setNewItem] = useState({ name: "", role: "", title: "", desc: "", image: "" });
    const [isEditing, setIsEditing] = useState<number | null>(null);

    // 1. Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/gallery"));
                if (snap.exists()) {
                    // Merge to ensure structure
                    setData({ ...DEFAULT_GALLERY, ...snap.val() });
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
        try {
            await set(ref(rtdb, "settings/gallery"), data);
            alert("Gallery page updated!");
        } catch (error) {
            alert("Failed to save.");
        }
    };

    // Generic Add/Edit Handler
    const handleAddOrUpdate = (sectionKey: string) => {
        const list = [...(data[sectionKey] || [])];

        if (isEditing !== null) {
            list[isEditing] = newItem;
            setIsEditing(null);
        } else {
            list.push(newItem);
        }

        setData({ ...data, [sectionKey]: list });
        setNewItem({ name: "", role: "", title: "", desc: "", image: "" });
    };

    const handleDelete = (sectionKey: string, index: number) => {
        if (!confirm("Delete this item?")) return;
        const list = [...data[sectionKey]];
        list.splice(index, 1);
        setData({ ...data, [sectionKey]: list });
    };

    const prepareEdit = (item: any, index: number) => {
        setNewItem(item);
        setIsEditing(index);
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Gallery...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Gallery Manager</h2>
                    <p className="text-sm text-gray-500">Manage Team, Factories, and Culture sections.</p>
                </div>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md font-bold transition">
                    <Save className="w-5 h-5" /> Publish
                </button>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-8 border-b pb-2">
                <button onClick={() => { setActiveSection("team"); setIsEditing(null); setNewItem({ name: "", role: "", title: "", desc: "", image: "" }); }} className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 ${activeSection === 'team' ? 'bg-white border-x border-t text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Users className="w-4 h-4" /> Team Members
                </button>
                <button onClick={() => { setActiveSection("factory"); setIsEditing(null); setNewItem({ name: "", role: "", title: "", desc: "", image: "" }); }} className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 ${activeSection === 'factory' ? 'bg-white border-x border-t text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Factory className="w-4 h-4" /> Factories
                </button>
                <button onClick={() => { setActiveSection("culture"); setIsEditing(null); setNewItem({ name: "", role: "", title: "", desc: "", image: "" }); }} className={`px-4 py-2 rounded-t-lg font-bold flex items-center gap-2 ${activeSection === 'culture' ? 'bg-white border-x border-t text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                    <Briefcase className="w-4 h-4" /> Work Culture
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm">

                {/* --- TEAM SECTION --- */}
                {activeSection === "team" && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg">Manage Team Members</h3>

                        {/* Editor */}
                        <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Name</label>
                                <input type="text" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Role</label>
                                <input type="text" value={newItem.role} onChange={e => setNewItem({ ...newItem, role: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="Manager" />
                            </div>
                            <div>
                                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Image URL</label>
                                <input type="text" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="https://..." />
                            </div>
                            <button onClick={() => handleAddOrUpdate("teamMembers")} className="bg-gray-900 text-white py-2 px-4 rounded text-sm font-bold h-fit md:col-span-3 hover:bg-gray-800">
                                {isEditing !== null ? "Update Member" : "Add Member"}
                            </button>
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.teamMembers?.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-3 border rounded-lg hover:shadow-sm transition bg-white">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden shrink-0 border">
                                        {item.image ? <Image src={item.image} alt={item.name} width={48} height={48} className="object-cover w-full h-full" /> : <ImageIcon className="w-6 h-6 m-3 text-gray-400" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-800 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{item.role}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => prepareEdit(item, idx)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete("teamMembers", idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- FACTORY / CULTURE SECTIONS (Shared Logic) --- */}
                {(activeSection === "factory" || activeSection === "culture") && (
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg">Manage {activeSection === "factory" ? "Factories" : "Work Culture"}</h3>

                        {/* Editor */}
                        <div className="bg-gray-50 p-4 rounded-lg border grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Title</label>
                                <input type="text" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} className="w-full p-2 border rounded text-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Description</label>
                                <textarea value={newItem.desc} onChange={e => setNewItem({ ...newItem, desc: e.target.value })} className="w-full p-2 border rounded text-sm h-16" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Image URL</label>
                                <input type="text" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} className="w-full p-2 border rounded text-sm" placeholder="https://..." />
                            </div>
                            <button onClick={() => handleAddOrUpdate(activeSection === "factory" ? "factoryLocations" : "workCulture")} className="bg-gray-900 text-white py-2 px-4 rounded text-sm font-bold md:col-span-2 hover:bg-gray-800">
                                {isEditing !== null ? "Update Item" : "Add Item"}
                            </button>
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-1 gap-3">
                            {data[activeSection === "factory" ? "factoryLocations" : "workCulture"]?.map((item: any, idx: number) => (
                                <div key={idx} className="flex gap-4 p-3 border rounded-lg hover:shadow-sm transition bg-white items-start">
                                    <div className="w-20 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0 border relative">
                                        {item.image ? <Image src={item.image} alt={item.title} fill className="object-cover" /> : <ImageIcon className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.desc}</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => prepareEdit(item, idx)} className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"><Edit className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(activeSection === "factory" ? "factoryLocations" : "workCulture", idx)} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}