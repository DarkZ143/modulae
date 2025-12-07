/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, ShieldCheck, CheckCircle, XCircle } from "lucide-react";

const DEFAULT_DATA = {
    hero: {
        title: "Purchase Protection & Warranty Assurance",
        subtitle: "Every order is verified, protected, and backed by clear service processes.",
        mainHeading: "Your Furniture, Fully Protected",
        mainDesc: "We treat every purchase like a long-term relationship. From verification to warranty support, we ensure what you buy is safe and genuine."
    },
    categories: [
        "Product Verification", "Warranty Validation", "Damage Inspection", "Assembly & Fitting", "Return / Replacement"
    ],
    verificationSteps: [
        { title: "1. Product Verification", desc: "Matched with order details before leaving warehouse." },
        { title: "2. Quality Check", desc: "QC team inspects joints, finish, and hardware." }
    ],
    warranty: {
        title: "How Warranty & Papers Are Verified",
        description: "Your product warranty is digitally linked to your order. Invoice and warranty terms are validated upon delivery.",
        covered: [
            "Structural damage due to manufacturing defects.",
            "Peeling of laminate or polish within warranty period."
        ],
        notCovered: [
            "Damage due to misuse or rough handling.",
            "Water damage or direct sunlight exposure."
        ]
    },
    outOfWarranty: {
        title: "Support Even After Warranty Ends",
        description: "We continue to offer paid service support with transparent charges and genuine parts.",
        steps: [
            "Raise a service request from My Orders.",
            "Technician visit is scheduled.",
            "Repair estimate provided for approval."
        ]
    },
    checklist: [
        "Inspect product at delivery.",
        "Report visible damage within 24-48 hours.",
        "Do not self-modify hardware."
    ]
};

export default function AdminPurchaseProtection() {
    const [data, setData] = useState<any>(DEFAULT_DATA);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState("hero");

    // Temp states for list additions
    const [newCategory, setNewCategory] = useState("");
    const [newStep, setNewStep] = useState({ title: "", desc: "" });
    const [newCovered, setNewCovered] = useState("");
    const [newNotCovered, setNewNotCovered] = useState("");
    const [newOOWStep, setNewOOWStep] = useState("");
    const [newChecklist, setNewChecklist] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/purchase_protection"));
                if (snap.exists()) setData(snap.val());
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        try {
            await set(ref(rtdb, "settings/purchase_protection"), data);
            alert("Page updated successfully!");
        } catch (error) { alert("Failed to save."); }
    };

    // --- GENERIC LIST HANDLERS ---
    const addItem = (listName: string, value: any, setter: any, clearValue: any) => {
        if (!value) return;
        const currentList = data[listName] || [];
        setData({ ...data, [listName]: [...currentList, value] });
        setter(clearValue);
    };

    const removeItem = (listName: string, index: number) => {
        const updated = [...data[listName]];
        updated.splice(index, 1);
        setData({ ...data, [listName]: updated });
    };

    // Specific Nested Handlers
    const addNestedItem = (parent: string, listName: string, value: any, setter: any) => {
        if (!value) return;
        const currentList = data[parent]?.[listName] || [];
        setData({ ...data, [parent]: { ...data[parent], [listName]: [...currentList, value] } });
        setter("");
    };

    const removeNestedItem = (parent: string, listName: string, index: number) => {
        const updated = [...data[parent][listName]];
        updated.splice(index, 1);
        setData({ ...data, [parent]: { ...data[parent], [listName]: updated } });
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Content...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Protection Page Manager</h2>
                    <p className="text-sm text-gray-500">Edit content for the Purchase Protection page.</p>
                </div>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md font-bold transition">
                    <Save className="w-5 h-5" /> Publish
                </button>
            </div>

            {/* TABS */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {["hero", "verification", "warranty", "support"].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveSection(tab)}
                        className={`px-4 py-2 rounded-lg font-bold capitalize whitespace-nowrap transition ${activeSection === tab ? 'bg-orange-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* --- SECTION 1: HERO --- */}
            {activeSection === "hero" && (
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Header & Hero</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Page Title</label>
                            <input type="text" value={data.hero.title} onChange={e => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                            <input type="text" value={data.hero.subtitle} onChange={e => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} className="w-full p-2 border rounded" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Hero Heading</label>
                            <input type="text" value={data.hero.mainHeading} onChange={e => setData({ ...data, hero: { ...data.hero, mainHeading: e.target.value } })} className="w-full p-2 border rounded font-bold text-lg" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-500 uppercase">Hero Description</label>
                            <textarea value={data.hero.mainDesc} onChange={e => setData({ ...data, hero: { ...data.hero, mainDesc: e.target.value } })} className="w-full p-2 border rounded h-24" />
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Top Tags (Categories)</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {data.categories.map((tag: string, i: number) => (
                                <span key={i} className="bg-orange-50 text-orange-700 px-2 py-1 rounded text-xs border border-orange-200 flex items-center gap-1">
                                    {tag} <button onClick={() => removeItem("categories", i)}><XCircle className="w-3 h-3 text-red-400" /></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New Tag" className="border p-2 rounded text-sm w-40" />
                            <button onClick={() => addItem("categories", newCategory, setNewCategory, "")} className="bg-gray-800 text-white px-3 rounded text-xs">Add</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION 2: VERIFICATION STEPS --- */}
            {activeSection === "verification" && (
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2">Verification Steps</h3>
                    <div className="space-y-3">
                        {data.verificationSteps?.map((step: any, i: number) => (
                            <div key={i} className="bg-gray-50 p-3 rounded-lg border flex gap-3">
                                <span className="font-bold text-gray-400 text-lg">{i + 1}.</span>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{step.title}</p>
                                    <p className="text-xs text-gray-600">{step.desc}</p>
                                </div>
                                <button onClick={() => removeItem("verificationSteps", i)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg flex flex-col gap-2 border">
                        <input type="text" placeholder="Step Title" className="border p-2 rounded text-sm" value={newStep.title} onChange={e => setNewStep({ ...newStep, title: e.target.value })} />
                        <textarea placeholder="Step Description" className="border p-2 rounded text-sm" value={newStep.desc} onChange={e => setNewStep({ ...newStep, desc: e.target.value })} />
                        <button onClick={() => addItem("verificationSteps", newStep, setNewStep, { title: "", desc: "" })} className="bg-gray-900 text-white py-2 rounded text-sm font-bold">Add Step</button>
                    </div>
                </div>
            )}

            {/* --- SECTION 3: WARRANTY --- */}
            {activeSection === "warranty" && (
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                        <h3 className="font-bold text-lg border-b pb-2">Warranty Intro</h3>
                        <input type="text" value={data.warranty.title} onChange={e => setData({ ...data, warranty: { ...data.warranty, title: e.target.value } })} className="w-full p-2 border rounded font-bold" />
                        <textarea value={data.warranty.description} onChange={e => setData({ ...data, warranty: { ...data.warranty, description: e.target.value } })} className="w-full p-2 border rounded h-20" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <h4 className="text-green-800 font-bold mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Covered</h4>
                            <ul className="space-y-2 mb-3">
                                {data.warranty.covered?.map((item: string, i: number) => (
                                    <li key={i} className="text-sm text-green-900 flex justify-between gap-2 border-b border-green-200 pb-1">
                                        <span>• {item}</span>
                                        <button onClick={() => removeNestedItem("warranty", "covered", i)}><XCircle className="w-4 h-4 text-green-400" /></button>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-2">
                                <input type="text" value={newCovered} onChange={e => setNewCovered(e.target.value)} placeholder="Add point" className="flex-1 p-2 rounded border text-sm" />
                                <button onClick={() => addNestedItem("warranty", "covered", newCovered, setNewCovered)} className="bg-green-600 text-white px-3 rounded text-xs">Add</button>
                            </div>
                        </div>

                        <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                            <h4 className="text-red-800 font-bold mb-3 flex items-center gap-2"><XCircle className="w-4 h-4" /> Not Covered</h4>
                            <ul className="space-y-2 mb-3">
                                {data.warranty.notCovered?.map((item: string, i: number) => (
                                    <li key={i} className="text-sm text-red-900 flex justify-between gap-2 border-b border-red-200 pb-1">
                                        <span>• {item}</span>
                                        <button onClick={() => removeNestedItem("warranty", "notCovered", i)}><XCircle className="w-4 h-4 text-red-400" /></button>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex gap-2">
                                <input type="text" value={newNotCovered} onChange={e => setNewNotCovered(e.target.value)} placeholder="Add point" className="flex-1 p-2 rounded border text-sm" />
                                <button onClick={() => addNestedItem("warranty", "notCovered", newNotCovered, setNewNotCovered)} className="bg-red-600 text-white px-3 rounded text-xs">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECTION 4: SUPPORT --- */}
            {activeSection === "support" && (
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                    <h3 className="font-bold text-lg border-b pb-2">Post-Warranty Support</h3>
                    <div className="grid gap-4">
                        <input type="text" value={data.outOfWarranty.title} onChange={e => setData({ ...data, outOfWarranty: { ...data.outOfWarranty, title: e.target.value } })} className="w-full p-2 border rounded font-bold" />
                        <textarea value={data.outOfWarranty.description} onChange={e => setData({ ...data, outOfWarranty: { ...data.outOfWarranty, description: e.target.value } })} className="w-full p-2 border rounded h-16" />
                    </div>

                    <div className="border-t pt-4">
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Process Steps</label>
                        <ul className="space-y-2 mb-3 list-decimal list-inside bg-gray-50 p-4 rounded-lg">
                            {data.outOfWarranty.steps?.map((step: string, i: number) => (
                                <li key={i} className="text-sm text-gray-700 flex justify-between items-center group">
                                    <span>{step}</span>
                                    <button onClick={() => removeNestedItem("outOfWarranty", "steps", i)} className="text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-2">
                            <input type="text" value={newOOWStep} onChange={e => setNewOOWStep(e.target.value)} placeholder="Add process step" className="flex-1 p-2 border rounded text-sm" />
                            <button onClick={() => addNestedItem("outOfWarranty", "steps", newOOWStep, setNewOOWStep)} className="bg-gray-800 text-white px-3 rounded text-xs">Add</button>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-bold text-orange-600 mb-2 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Customer Checklist</h4>
                        <ul className="space-y-2 mb-3">
                            {data.checklist?.map((item: string, i: number) => (
                                <li key={i} className="text-sm text-gray-600 flex justify-between border-b pb-1">
                                    <span>• {item}</span>
                                    <button onClick={() => removeItem("checklist", i)}><XCircle className="w-4 h-4 text-gray-400" /></button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex gap-2">
                            <input type="text" value={newChecklist} onChange={e => setNewChecklist(e.target.value)} placeholder="Add checklist item" className="flex-1 p-2 border rounded text-sm" />
                            <button onClick={() => addItem("checklist", newChecklist, setNewChecklist, "")} className="bg-orange-600 text-white px-3 rounded text-xs">Add</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}