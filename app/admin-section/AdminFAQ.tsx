/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, Edit, HelpCircle, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

// Your original data as the default starting point
const DEFAULT_FAQS = [
    {
        id: 1,
        question: "What is Modulae Furniture?",
        answer: "Modulae is a modern furniture brand providing premium, long-lasting and aesthetically designed furniture for living rooms, bedrooms, dining areas, and workspaces.",
        image: "/faq/furniture.jpg",
    },
    {
        id: 2,
        question: "Do you provide home delivery?",
        answer: "Yes! We offer secure and fast home delivery across India. All orders are carefully packed with shock-proof materials to ensure your furniture arrives safely.",
        image: "/faq/homedelivery.jpg",
    },
    {
        id: 3,
        question: "Is installation included?",
        answer: "Absolutely. For products that require assembly such as beds, wardrobes, dining tables or TV units, we provide FREE professional installation by certified technicians.",
        image: "/faq/installation.jpg",
    },
    // ... you can add the rest of your defaults here if you want to reset to them later
];

export default function AdminFAQ() {
    const [faqs, setFaqs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        id: 0,
        question: "",
        answer: "",
        image: ""
    });

    // 1. Fetch FAQs
    const fetchFAQs = async () => {
        setLoading(true);
        try {
            const snap = await get(ref(rtdb, "settings/faq"));
            if (snap.exists()) {
                const data = snap.val();
                setFaqs(Array.isArray(data) ? data : []);
            } else {
                // Initialize with defaults if empty
                await set(ref(rtdb, "settings/faq"), DEFAULT_FAQS);
                setFaqs(DEFAULT_FAQS);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFAQs(); }, []);

    // 2. Save
    const handleSave = async () => {
        if (!formData.question || !formData.answer) return alert("Question and Answer are required");

        let updatedList = [...faqs];

        if (formData.id) {
            // Edit existing
            updatedList = updatedList.map(item => item.id === formData.id ? formData : item);
        } else {
            // Add new
            updatedList.push({ ...formData, id: Date.now() });
        }

        try {
            await set(ref(rtdb, "settings/faq"), updatedList);
            setFaqs(updatedList);
            setIsEditing(false);
            setFormData({ id: 0, question: "", answer: "", image: "" });
            alert("FAQs updated!");
        } catch (error) {
            alert("Failed to save.");
        }
    };

    // 3. Delete
    const handleDelete = async (id: number) => {
        if (confirm("Delete this FAQ?")) {
            const updated = faqs.filter(item => item.id !== id);
            await set(ref(rtdb, "settings/faq"), updated);
            setFaqs(updated);
        }
    };

    // Reset form for adding new
    const openAddModal = () => {
        setFormData({ id: 0, question: "", answer: "", image: "" });
        setIsEditing(true);
    };

    const openEditModal = (item: any) => {
        setFormData(item);
        setIsEditing(true);
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading FAQs...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">FAQ Manager</h2>
                    <p className="text-sm text-gray-500">Update questions, answers, and images.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-gray-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-gray-800 shadow-md"
                >
                    <Plus className="w-4 h-4" /> Add FAQ
                </button>
            </div>

            {/* --- EDITOR MODAL --- */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up border border-gray-200">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-lg text-gray-800">{formData.id ? "Edit FAQ" : "New FAQ"}</h3>
                            <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded-full transition"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Question</label>
                                <input
                                    type="text"
                                    value={formData.question}
                                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                                    className="w-full p-3 border rounded-lg focus:border-orange-500 outline-none transition"
                                    placeholder="e.g. Do you deliver on weekends?"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Answer</label>
                                <textarea
                                    value={formData.answer}
                                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                                    className="w-full p-3 border rounded-lg h-32 focus:border-orange-500 outline-none resize-none transition"
                                    placeholder="Type the answer here..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 items-center gap-1"><ImageIcon className="w-3 h-3" /> Image URL (Optional)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="flex-1 p-3 border rounded-lg text-sm focus:border-orange-500 outline-none transition"
                                        placeholder="https://..."
                                    />
                                    {formData.image && (
                                        <div className="w-12 h-12 relative border rounded overflow-hidden shrink-0">
                                            <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-medium transition">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition shadow-md">Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LIST VIEW --- */}
            <div className="space-y-4">
                {faqs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed text-gray-400">No FAQs found. Add one!</div>
                ) : (
                    faqs.map((faq, index) => (
                        <div key={faq.id || index} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center group hover:border-orange-200 transition">
                            {/* Image Thumbnail */}
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border flex items-center justify-center relative">
                                {faq.image ? (
                                    <Image src={faq.image} alt="" fill className="object-cover" />
                                ) : (
                                    <HelpCircle className="w-6 h-6 text-gray-300" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-gray-800 truncate text-base">{faq.question}</h4>
                                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{faq.answer}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 self-end md:self-center">
                                <button onClick={() => openEditModal(faq)} className="p-2 text-blue-600 hover:bg-blue-50 rounded border bg-white transition"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-600 hover:bg-red-50 rounded border bg-white transition"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}