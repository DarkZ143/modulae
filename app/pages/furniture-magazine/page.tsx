"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, User, X } from "lucide-react";
import TopOfferBar from "@/app/components/TopOfferBar";
import Navbar from "@/app/components/Navbar";
import CategoryHeader from "@/app/components/CategoryHeader";
import LatestProducts from "@/app/components/LatestProduct";
import BlogSection from "@/app/components/blog";
import Footer from "@/app/components/Footer";

// Mock Data for Magazine Articles
const articles = [
    {
        id: 1,
        title: "7 Minimalist Design Tips for a Modern Home",
        excerpt: "Discover how to declutter your space and embrace the beauty of simplicity with these essential minimalist furniture tips.",
        image: "/magzine/img1.png", // Ensure these paths are correct in your public folder
        category: "Design Tips",
        author: "Sarah Jenks",
        date: "Nov 15, 2024",
    },
    {
        id: 2,
        title: "Choosing the Perfect Sofa for Your Living Room",
        excerpt: "From fabric selection to sizing, here is the ultimate guide to picking a sofa that fits your lifestyle and decor perfectly.",
        image: "/magzine/img2.png",
        category: "Buying Guide",
        author: "Michael Rossi",
        date: "Nov 10, 2024",
    },
    {
        id: 3,
        title: "The Return of Vintage: Why Wooden Furniture is Timeless",
        excerpt: "Explore why classic wooden pieces are making a huge comeback in contemporary interior design trends this year.",
        image: "/magzine/img3.png",
        category: "Trends",
        author: "Emma Wood",
        date: "Nov 05, 2024",
    },
];

// Dummy Content for the Popup (~300 words)
const DUMMY_CONTENT = (
    <>
        <p className="mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. 
            Cras venenatis euismod malesuada. Nulla facilisi. Curabitur in libero ut massa volutpat convallis. 
            Morbi rutrum, leo a tincidunt rhoncus, sapien nisi finibus libero, nec facilisis dolor augue et nisi. 
            Suspendisse potenti. Ut et leo nec nisl imperdiet facilisis. Integer mattis quis ex id aliquet. 
            Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; 
            Sed non lorem vitae enim eleifend condimentum.
        </p>
        <h4 className="text-lg font-bold text-gray-900 mb-2">Understanding the Basics</h4>
        <p className="mb-4">
            Phasellus euismod, nulla a finibus tristique, nulla tellus dignissim leo, eget tincidunt leo tellus 
            vel sem. Fusce mollis, turpis quis egestas rhoncus, erat augue euismod tortor, sit amet luctus 
            risus sem in libero. Aenean id nisi vitae purus fermentum tincidunt. Aliquam erat volutpat. 
            Nam eget sagittis ante. Sed ac ligula ut mi dignissim tincidunt ac id metus. Duis sit amet 
            ligula vel justo interdum varius. Mauris vitae mauris sed felis sollicitudin congue.
        </p>
        <p className="mb-4">
            Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, 
            commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, 
            eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. 
            Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna 
            eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus.
        </p>
        <h4 className="text-lg font-bold text-gray-900 mb-2">Conclusion</h4>
        <p>
            Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris sit amet orci. 
            Aenean dignissim pellentesque felis. Morbi in sem quis dui placerat ornare. Pellentesque odio nisi, 
            euismod in, pharetra a, ultricies in, diam. Sed arcu. Cras consequat. Praesent dapibus, neque id 
            cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat.
        </p>
    </>
);

const FurnitureMagazine = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [selectedArticle]);

    return (
        <>
            <TopOfferBar />
            <Navbar />
            <CategoryHeader title="Furniture Magazine" />
            
            <section className="w-full bg-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-6">

                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h4 className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2">
                                Our Blog
                            </h4>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                                Furniture <span className="border-b-4 border-orange-500">Magazine</span>
                            </h2>
                            <p className="text-gray-500 mt-3 max-w-lg">
                                Stay updated with the latest trends, interior design hacks, and furniture care guides from our experts.
                            </p>
                        </div>

                        <Link
                            href="/blog"
                            className="hidden md:flex items-center gap-2 text-gray-900 font-semibold hover:text-orange-600 transition-colors"
                        >
                            View All Articles <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <div
                                key={article.id}
                                onClick={() => setSelectedArticle(article)}
                                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                            >
                                {/* Image Container (Thumbnail - keep cover here for neat grid) */}
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image
                                        src={article.image}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Category Badge */}
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wide">
                                        {article.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-6">
                                    {/* Meta Data */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3 text-orange-500" />
                                            {article.author}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3 text-orange-500" />
                                            {article.date}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                                        {article.title}
                                    </h3>

                                    {/* Excerpt */}
                                    <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">
                                        {article.excerpt}
                                    </p>

                                    {/* Read More Link */}
                                    <div className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                                        Read Article <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mobile View All Button */}
                    <div className="mt-10 text-center md:hidden">
                        <Link
                            href="/blog"
                            className="inline-block px-8 py-3 border border-gray-300 rounded-full text-gray-900 font-semibold hover:bg-gray-50 hover:border-gray-400 transition"
                        >
                            View All Articles
                        </Link>
                    </div>

                </div>
            </section>

            {/* ---------------- ARTICLE MODAL ---------------- */}
            {selectedArticle && (
                <div className="fixed inset-0 z-100 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    
                    {/* Overlay to close */}
                    <div 
                        className="absolute inset-0" 
                        onClick={() => setSelectedArticle(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white w-full max-w-3xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl shadow-2xl animate-slide-up">
                        
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedArticle(null)}
                            className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-gray-100 transition shadow-sm"
                        >
                            <X className="w-6 h-6 text-gray-700" />
                        </button>

                        {/* ✅ UPDATED: Article Image Section */}
                        {/* Using aspect-video for a good shape, and object-contain to show full image */}
                        <div className="relative w-full aspect-video bg-orange-200 overflow-hidden">
                            <Image
                                src={selectedArticle.image}
                                alt={selectedArticle.title}
                                fill
                                className="object-contain" // <--- Shows full content
                            />
                        </div>

                        {/* Article Body */}
                        <div className="p-6 md:p-10">
                             {/* ✅ UPDATED: Title and Category moved here so they are always readable */}
                            <div className="mb-6">
                                 <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded mb-3 inline-block uppercase tracking-wide">
                                    {selectedArticle.category}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-bold leading-tight text-gray-900">
                                    {selectedArticle.title}
                                </h2>
                            </div>

                            {/* Meta Data */}
                            <div className="flex items-center justify-between border-b border-gray-100 pb-6 mb-6 text-sm text-gray-500">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-bold">
                                            {selectedArticle.author.charAt(0)}
                                        </div>
                                        <span className="font-medium text-gray-900">{selectedArticle.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>{selectedArticle.date}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Main Text Content */}
                            <div className="prose prose-lg text-gray-700 leading-relaxed max-w-none">
                                <p className="text-xl text-gray-900 font-medium mb-6 italic">
                                    &quot;{selectedArticle.excerpt}&quot;
                                </p>
                                {DUMMY_CONTENT}
                            </div>
                        </div>
                        
                    </div>
                </div>
            )}

            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
};

export default FurnitureMagazine;