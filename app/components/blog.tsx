/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// ✅ SHARED DEFAULT DATA (Must match the [slug] page data)
export const DEFAULT_BLOGS = [
    {
        id: "default-1",
        title: "Modern House Trends for Future Lifestyles",
        slug: "modern-house-trends-for-future-lifestyles",
        author: "Modulae Editorial",
        date: "2024-11-25",
        imageUrl: "/blog/blog1.jpg",
        excerpt: "Modern homes are evolving rapidly, blending functionality with futuristic design thinking...",
        content: `Modern homes are evolving rapidly... (Full content placeholder)`
    },
    {
        id: "default-2",
        title: "Minimalist Décor Ideas for Peaceful Homes",
        slug: "minimalist-decor-ideas",
        author: "Interior Insights",
        date: "2024-11-22",
        imageUrl: "/blog/blog2.jpg",
        excerpt: "Minimalist home décor isn't about empty rooms—it's about intentional design...",
        content: `Minimalist home décor isn't about empty rooms... (Full content placeholder)`
    },
    {
        id: "default-3",
        title: "How to Choose Décor That Truly Matches Your Personality",
        slug: "choose-decor-matching-personality",
        author: "Design Desk",
        date: "2024-11-19",
        imageUrl: "/blog/blog3.jpg",
        excerpt: "Choosing décor is less about trends and more about expressing who you are...",
        content: `Choosing décor is less about trends... (Full content placeholder)`
    }
];

export default function BlogSection() {
    const [blogs, setBlogs] = useState<any[]>(DEFAULT_BLOGS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/blogs"));
                if (snap.exists()) {
                    const data = snap.val();
                    const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    // Sort by newest
                    list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setBlogs(list.slice(0, 3));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    const getDateParts = (isoDate: string) => {
        const d = new Date(isoDate);
        return {
            day: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' })
        };
    };

    if (loading) return (
        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>)}
        </div>
    );

    return (
        <section className="w-full bg-gray-50 py-12 md:py-16 relative" style={{ backgroundImage: "url('/blog/bg.png')" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Latest From <span className="border-b-4 border-orange-500 pb-1">Blogs</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((post) => {
                        const { day, month } = getDateParts(post.date);

                        return (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`} // ✅ Links to Dynamic Page
                                className="group block bg-white rounded-lg shadow-sm overflow-hidden transition hover:shadow-lg h-full flex-col"
                            >
                                <div className="relative w-full h-64 bg-gray-200">
                                    <Image
                                        src={post.imageUrl || "/placeholder.png"}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                <div className="p-6 flex gap-4 flex-1">
                                    <div className="text-center shrink-0 pt-1">
                                        <span className="block text-2xl font-bold text-orange-500 leading-none">{day}</span>
                                        <span className="block text-sm text-gray-500 uppercase">{month}</span>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-xs text-gray-400 uppercase font-semibold mb-1">
                                            {post.author}
                                        </p>
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                                            {post.content || post.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}