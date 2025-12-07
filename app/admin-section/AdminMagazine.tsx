/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set, push, remove } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, Edit, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

const DEFAULT_ARTICLE = {
    id: "",
    title: "",
    slug: "",
    excerpt: "",
    content: "", // Full blog post
    image: "",
    category: "Design",
    author: "Admin",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
};

export default function AdminMagazine() {
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_ARTICLE);

    // 1. Fetch Articles
    const fetchArticles = async () => {
        setLoading(true);
        try {
            const snap = await get(ref(rtdb, "settings/magazine"));
            if (snap.exists()) {
                const data = snap.val();
                const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                setArticles(list);
            } else {
                setArticles([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchArticles(); }, []);

    // 2. Save Article
    const handleSave = async () => {
        if (!formData.title || !formData.content) return alert("Title and Content required");

        // Auto-generate slug if missing
        const slug = formData.slug || formData.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        const finalData = { ...formData, slug };

        try {
            if (formData.id) {
                // Update
                await set(ref(rtdb, `settings/magazine/${formData.id}`), finalData);
            } else {
                // Create
                const newRef = push(ref(rtdb, "settings/magazine"));
                await set(newRef, { ...finalData, id: newRef.key });
            }
            alert("Article saved!");
            setIsEditing(false);
            fetchArticles();
        } catch (error) {
            alert("Failed to save.");
        }
    };

    // 3. Delete Article
    const handleDelete = async (id: string) => {
        if (confirm("Delete this article?")) {
            await remove(ref(rtdb, `settings/magazine/${id}`));
            fetchArticles();
        }
    };

    const resetForm = () => {
        setFormData({ ...DEFAULT_ARTICLE, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Magazine...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Magazine Manager</h2>
                    <p className="text-sm text-gray-500">Create and manage blog posts.</p>
                </div>
                <button onClick={() => { resetForm(); setIsEditing(true); }} className="bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-700 shadow-md">
                    <Plus className="w-4 h-4" /> New Article
                </button>
            </div>

            {/* --- LIST VIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                    <div key={article.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                        <div className="h-40 bg-gray-100 relative">
                            {article.image ? (
                                <Image src={article.image} alt={article.title} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                            )}
                            <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs font-bold uppercase">{article.category}</div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 line-clamp-1 mb-1">{article.title}</h3>
                            <p className="text-xs text-gray-500 mb-3">{article.date} • {article.author}</p>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{article.excerpt}</p>

                            <div className="flex gap-2 pt-3 border-t">
                                <button onClick={() => { setFormData(article); setIsEditing(true); }} className="flex-1 py-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded text-xs font-bold">Edit</button>
                                <button onClick={() => handleDelete(article.id)} className="flex-1 py-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded text-xs font-bold">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- EDITOR MODAL --- */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-slide-up">
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-lg text-gray-800">{formData.id ? "Edit Article" : "New Article"}</h3>
                            <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="w-5 h-5 text-gray-500" /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded" placeholder="Article Headline" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                    <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-2 border rounded" placeholder="Trends" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author</label>
                                    <input type="text" value={formData.author} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full p-2 border rounded" placeholder="Writer Name" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Image URL</label>
                                <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-2 border rounded" placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Short Excerpt (Preview)</label>
                                <textarea value={formData.excerpt} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} className="w-full p-2 border rounded h-20" placeholder="Summary for the card..."></textarea>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Content</label>
                                <textarea value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} className="w-full p-3 border rounded h-64 text-sm leading-relaxed" placeholder="Write your full article here..."></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button onClick={() => setIsEditing(false)} className="px-5 py-2 border rounded hover:bg-gray-50 font-medium">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2 bg-orange-600 text-white rounded font-bold hover:bg-orange-700 shadow-md">Save Article</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}