/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set, push, remove } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Plus, Trash2, Edit, Image as ImageIcon, X, FileText } from "lucide-react";
import Image from "next/image";

const DEFAULT_BLOG = {
    id: "",
    title: "",
    slug: "",
    author: "Modulae Team",
    content: "",
    imageUrl: "",
    date: new Date().toISOString()
};

export default function AdminBlog() {
    const [blogs, setBlogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(DEFAULT_BLOG);

    // 1. Fetch Blogs
    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const snap = await get(ref(rtdb, "settings/blogs"));
            if (snap.exists()) {
                const data = snap.val();
                const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                // Sort by date (newest first)
                list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setBlogs(list);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBlogs(); }, []);

    // 2. Save Blog
    const handleSave = async () => {
        if (!formData.title || !formData.content) return alert("Title and Content are required");

        // Generate slug if missing
        const slug = formData.slug || formData.title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
        const finalData = { ...formData, slug };

        try {
            if (formData.id) {
                await set(ref(rtdb, `settings/blogs/${formData.id}`), finalData);
            } else {
                const newRef = push(ref(rtdb, "settings/blogs"));
                await set(newRef, { ...finalData, id: newRef.key });
            }
            alert("Blog post saved!");
            setIsEditing(false);
            fetchBlogs();
        } catch (error) {
            alert("Failed to save.");
        }
    };

    // 3. Delete Blog
    const handleDelete = async (id: string) => {
        if (confirm("Delete this blog post?")) {
            await remove(ref(rtdb, `settings/blogs/${id}`));
            fetchBlogs();
        }
    };

    const resetForm = () => {
        setFormData({ ...DEFAULT_BLOG, date: new Date().toISOString() });
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Blogs...</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Blog Manager</h2>
                    <p className="text-sm text-gray-500">Create and manage your blog articles.</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsEditing(true); }}
                    className="bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-orange-700 shadow-md transition"
                >
                    <Plus className="w-4 h-4" /> New Post
                </button>
            </div>

            {/* --- LIST VIEW --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <div key={blog.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
                        <div className="h-40 bg-gray-100 relative">
                            {blog.imageUrl ? (
                                <Image src={blog.imageUrl} alt={blog.title} fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon className="w-8 h-8" /></div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded">
                                {new Date(blog.date).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="p-4 flex-1">
                            <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{blog.title}</h3>
                            <p className="text-xs text-orange-600 font-semibold mb-3">{blog.author}</p>
                            <p className="text-sm text-gray-600 line-clamp-3">{blog.content}</p>
                        </div>
                        <div className="p-3 border-t bg-gray-50 flex justify-end gap-2">
                            <button onClick={() => { setFormData(blog); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded border bg-white"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-100 rounded border bg-white"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- EDITOR MODAL --- */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="font-bold text-xl text-gray-800">{formData.id ? "Edit Post" : "New Post"}</h3>
                            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-500" /></button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Blog Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full p-3 border rounded-lg focus:border-orange-500 outline-none font-bold"
                                        placeholder="e.g. 5 Trends in Modern Furniture"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Author</label>
                                        <input
                                            type="text"
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:border-orange-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Slug (URL)</label>
                                        <input
                                            type="text"
                                            value={formData.slug}
                                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                            className="w-full p-3 border rounded-lg focus:border-orange-500 outline-none text-gray-500"
                                            placeholder="Auto-generated"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1 items-center gap-1"><ImageIcon className="w-3 h-3" /> Cover Image URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="flex-1 p-3 border rounded-lg text-sm focus:border-orange-500 outline-none"
                                            placeholder="https://..."
                                        />
                                        {formData.imageUrl && (
                                            <div className="w-12 h-12 relative border rounded overflow-hidden shrink-0">
                                                <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1 items-center gap-1"><FileText className="w-3 h-3" /> Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="flex-1 p-4 border rounded-lg focus:border-orange-500 outline-none resize-none text-sm leading-relaxed min-h-[300px]"
                                    placeholder="Write your blog content here..."
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 border rounded-lg font-semibold hover:bg-gray-50 transition">Cancel</button>
                            <button onClick={handleSave} className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition shadow-md">
                                Save & Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}