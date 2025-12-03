/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, ChevronDown, ChevronRight, Link as LinkIcon, Image as ImageIcon, Upload } from "lucide-react";
import Image from "next/image";

export default function AdminNavbar() {
    const [loading, setLoading] = useState(true);

    // --- STATE ---
    const [logo, setLogo] = useState({ src: "", href: "/", alt: "Modulae" });
    const [menus, setMenus] = useState<any[]>([]);

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/navbar_v2"));
                if (snap.exists()) {
                    const data = snap.val();
                    setLogo(data.logo || { src: "", href: "/", alt: "Modulae" });
                    setMenus(data.menus || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // --- SAVE DATA ---
    const handleSave = async () => {
        try {
            await set(ref(rtdb, "settings/navbar_v2"), { logo, menus });
            alert("Navbar updated successfully!");
        } catch (error) {
            alert("Failed to save settings.");
        }
    };

    // --- LOGO HANDLERS ---
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500000) return alert("File too large! Max 500KB."); // 500KB limit for Base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo({ ...logo, src: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    // --- MENU HANDLERS ---

    // Level 1: Main Menus
    const addMenu = () => setMenus([...menus, { title: "New Menu", type: "dropdown", href: "", children: [] }]);
    const updateMenu = (index: number, field: string, value: any) => {
        const updated = [...menus];
        updated[index][field] = value;
        // Reset children if switching to link
        if (field === 'type' && value === 'link') updated[index].children = [];
        setMenus(updated);
    };
    const deleteMenu = (index: number) => {
        if (confirm("Delete this menu?")) setMenus(menus.filter((_, i) => i !== index));
    };

    // Level 2: Categories
    const addCategory = (menuIndex: number) => {
        const updated = [...menus];
        if (!updated[menuIndex].children) updated[menuIndex].children = [];
        updated[menuIndex].children.push({ title: "New Category", type: "list", href: "", items: [] });
        setMenus(updated);
    };
    const updateCategory = (menuIndex: number, catIndex: number, field: string, value: any) => {
        const updated = [...menus];
        updated[menuIndex].children[catIndex][field] = value;
        setMenus(updated);
    };
    const deleteCategory = (menuIndex: number, catIndex: number) => {
        const updated = [...menus];
        updated[menuIndex].children.splice(catIndex, 1);
        setMenus(updated);
    };

    // Level 3: Sub-Items
    const addItem = (menuIndex: number, catIndex: number) => {
        const updated = [...menus];
        if (!updated[menuIndex].children[catIndex].items) updated[menuIndex].children[catIndex].items = [];
        updated[menuIndex].children[catIndex].items.push({ title: "New Item", href: "/shop" });
        setMenus(updated);
    };
    const updateItem = (menuIndex: number, catIndex: number, itemIndex: number, field: string, value: any) => {
        const updated = [...menus];
        updated[menuIndex].children[catIndex].items[itemIndex][field] = value;
        setMenus(updated);
    };
    const deleteItem = (menuIndex: number, catIndex: number, itemIndex: number) => {
        const updated = [...menus];
        updated[menuIndex].children[catIndex].items.splice(itemIndex, 1);
        setMenus(updated);
    };

    if (loading) return <div className="p-10 text-center">Loading Editor...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-gray-100 pt-4 pb-4 z-10">
                <h2 className="text-3xl font-bold text-gray-800">Navbar Manager</h2>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md font-bold">
                    <Save className="w-5 h-5" /> Publish
                </button>
            </div>

            {/* 1. Logo Configuration */}
            <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
                <h3 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">Logo Settings</h3>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Image Preview */}
                    <div className="w-32 h-32 bg-gray-100 border rounded-lg flex items-center justify-center overflow-hidden relative group">
                        {logo.src ? (
                            <Image src={logo.src} alt="Logo Preview" width={100} height={100} className="object-contain w-full h-full" />
                        ) : (
                            <span className="text-xs text-gray-400 text-center p-2">No Logo</span>
                        )}
                        <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition">
                            <Upload className="w-6 h-6 mb-1" />
                            <span className="text-[10px]">Change</span>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-4 w-full">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alt Text (Name)</label>
                            <input type="text" value={logo.alt} onChange={(e) => setLogo({ ...logo, alt: e.target.value })} className="w-full p-2 border rounded outline-orange-500" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Redirection Link</label>
                            <input type="text" value={logo.href} onChange={(e) => setLogo({ ...logo, href: e.target.value })} className="w-full p-2 border rounded outline-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Menu Builder */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h3 className="font-bold text-lg text-gray-800">Menu Structure</h3>
                    <button onClick={addMenu} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-gray-700">
                        <Plus className="w-4 h-4" /> Add Menu
                    </button>
                </div>

                {menus.map((menu, mIdx) => (
                    <div key={mIdx} className="bg-white rounded-xl border shadow-sm overflow-hidden">

                        {/* Level 1: Menu Header */}
                        <div className="p-4 bg-gray-50 border-b flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                <input
                                    type="text"
                                    value={menu.title}
                                    onChange={(e) => updateMenu(mIdx, "title", e.target.value)}
                                    className="p-2 border rounded font-bold"
                                    placeholder="Menu Title"
                                />

                                <select
                                    value={menu.type}
                                    onChange={(e) => updateMenu(mIdx, "type", e.target.value)}
                                    className="p-2 border rounded bg-white"
                                >
                                    <option value="dropdown">Dropdown Menu</option>
                                    <option value="link">Direct Link</option>
                                </select>

                                {menu.type === "link" && (
                                    <input
                                        type="text"
                                        value={menu.href}
                                        onChange={(e) => updateMenu(mIdx, "href", e.target.value)}
                                        className="p-2 border rounded text-blue-600"
                                        placeholder="/shop"
                                    />
                                )}
                            </div>
                            <button onClick={() => deleteMenu(mIdx)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-5 h-5" /></button>
                        </div>

                        {/* Level 2: Categories (Only if Dropdown) */}
                        {menu.type === "dropdown" && (
                            <div className="p-6 bg-white space-y-6">
                                {menu.children?.map((cat: any, cIdx: number) => (
                                    <div key={cIdx} className="border rounded-lg p-4 bg-gray-50/50">
                                        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center border-b pb-3 border-gray-200">
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                                                <input
                                                    type="text"
                                                    value={cat.title}
                                                    onChange={(e) => updateCategory(mIdx, cIdx, "title", e.target.value)}
                                                    className="p-2 border rounded text-sm font-semibold"
                                                    placeholder="Category Name"
                                                />
                                                <select
                                                    value={cat.type}
                                                    onChange={(e) => updateCategory(mIdx, cIdx, "type", e.target.value)}
                                                    className="p-2 border rounded bg-white text-sm"
                                                >
                                                    <option value="list">Sub-Category List</option>
                                                    <option value="link">Direct Link</option>
                                                </select>
                                                {cat.type === "link" && (
                                                    <input
                                                        type="text"
                                                        value={cat.href}
                                                        onChange={(e) => updateCategory(mIdx, cIdx, "href", e.target.value)}
                                                        className="p-2 border rounded text-blue-600 text-sm"
                                                        placeholder="/category-link"
                                                    />
                                                )}
                                            </div>
                                            <button onClick={() => deleteCategory(mIdx, cIdx)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                        </div>

                                        {/* Level 3: Items (Only if List) */}
                                        {cat.type === "list" && (
                                            <div className="pl-4 border-l-2 border-gray-300 space-y-2">
                                                {cat.items?.map((item: any, iIdx: number) => (
                                                    <div key={iIdx} className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            value={item.title}
                                                            onChange={(e) => updateItem(mIdx, cIdx, iIdx, "title", e.target.value)}
                                                            className="p-1.5 border rounded text-xs flex-1"
                                                            placeholder="Item Name"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={item.href}
                                                            onChange={(e) => updateItem(mIdx, cIdx, iIdx, "href", e.target.value)}
                                                            className="p-1.5 border rounded text-xs flex-1 text-blue-600"
                                                            placeholder="/item-link"
                                                        />
                                                        <button onClick={() => deleteItem(mIdx, cIdx, iIdx)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addItem(mIdx, cIdx)} className="text-xs text-orange-600 font-bold hover:underline mt-2">+ Add Item</button>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                <button onClick={() => addCategory(mIdx)} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 font-bold hover:bg-gray-50 hover:border-gray-400 transition">
                                    + Add Category
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}