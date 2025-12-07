/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Calendar, User, ArrowLeft } from "lucide-react";
// ✅ Import Defaults to Fallback
import { DEFAULT_BLOGS } from "@/app/components/blog";

export default function BlogPost() {
    const { slug } = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                // 1. Try finding in Firebase
                const snap = await get(ref(rtdb, "settings/blogs"));
                let found = null;

                if (snap.exists()) {
                    const data = snap.val();
                    found = Object.values(data).find((a: any) => a.slug === slug);
                }

                // 2. If not in Firebase, check Default List
                if (!found) {
                    found = DEFAULT_BLOGS.find((b) => b.slug === slug);
                }

                setArticle(found);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchArticle();
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Article...</div>;

    if (!article) return (
        <div className="h-screen flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Article Not Found</h1>
            <p className="text-gray-500 mb-6">The blog post you are looking for does not exist.</p>
            <button onClick={() => router.push('/')} className="text-white bg-orange-600 px-6 py-2 rounded-lg hover:bg-orange-700 transition">
                Go Home
            </button>
        </div>
    );

    return (
        <>
            <Navbar />

            <article className="max-w-4xl mx-auto px-6 py-12">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-8 transition group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                </button>

                {/* Hero Image */}
                <div className="relative w-full h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg mb-10 bg-gray-100">
                    <Image
                        src={article.imageUrl || "/placeholder.png"}
                        alt={article.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Meta Header */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-gray-900">{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        {new Date(article.date).toLocaleDateString(undefined, { dateStyle: "long" })}
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    {article.title}
                </h1>

                {/* Content Body */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                </div>
            </article>

            <Footer />
        </>
    );
}