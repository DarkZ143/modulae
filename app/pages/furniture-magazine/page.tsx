/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

import Navbar from "@/app/components/Navbar";
import CategoryHeader from "@/app/components/CategoryHeader";
import LatestProducts from "@/app/components/LatestProduct";
import BlogSection from "@/app/components/blog";
import Footer from "@/app/components/Footer";

// Fallback Data (in case DB is empty)
const DEFAULT_ARTICLES = [
    {
        id: "1",
        title: "7 Minimalist Design Tips for a Modern Home",
        excerpt: "Discover how to declutter your space and embrace simplicity.",
        image: "/magzine/img1.png",
        category: "Design Tips",
        author: "Sarah Jenks",
        date: "Nov 15, 2024",
        slug: "minimalist-design-tips"
    }
];

export default function FurnitureMagazinePage() {
    const [articles, setArticles] = useState<any[]>(DEFAULT_ARTICLES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                // Fetch from the same path AdminBlog saves to
                const snap = await get(ref(rtdb, "settings/blogs"));

                if (snap.exists()) {
                    const data = snap.val();
                    const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));

                    // SORTING: Newest first (Trending)
                    list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    setArticles(list);
                }
            } catch (error) {
                console.error("Error loading magazine:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    return (
        <>
            <Navbar />
            <CategoryHeader title="Furniture Magazine" />

            <section className="w-full bg-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h4 className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2">Our Blog</h4>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Furniture <span className="border-b-4 border-orange-500">Magazine</span></h2>
                            <p className="text-gray-500 mt-3 max-w-lg">Stay updated with the latest trends, interior design hacks, and furniture care guides from our experts.</p>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-100 rounded-2xl animate-pulse"></div>)}
                        </div>
                    ) : articles.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl">
                            <p className="text-gray-500">No articles published yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articles.map((article) => (
                                <Link
                                    key={article.id}
                                    href={`/blog/${article.slug}`} // ✅ Direct Link to Full Page
                                    className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Image Container */}
                                    <div className="relative h-64 w-full overflow-hidden bg-gray-200">
                                        <Image
                                            src={article.imageUrl || article.image || "/placeholder.png"} // Support both field names
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase">
                                            {article.category || "General"}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex flex-col flex-1 p-6">
                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3 text-orange-500" />
                                                {article.author}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-orange-500" />
                                                {new Date(article.date).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>

                                        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                                            {article.excerpt || article.content?.substring(0, 100) + "..."}
                                        </p>

                                        <div className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                            Read Article <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </section>

            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}