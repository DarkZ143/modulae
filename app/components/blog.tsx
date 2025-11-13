"use client";

import React from "react";
import Image from "next/image";

// Mock data for 3 blog posts. You can replace this.
const blogPosts = [
    {
        id: 1,
        day: "02",
        month: "Oct",
        author: "Preyan Technosys",
        title: "Modern house trends for future lifestyles and i...",
        imageUrl: "/blog/blog1.jpg",
        altText: "Modern living room",
        link: "#",
    },
    {
        id: 2,
        day: "02",
        month: "Oct",
        author: "Preyan Technosys",
        title: "Modern house trends for future lifestyles and i...",
        imageUrl: "/blog/blog2.jpg",
        altText: "Minimalist dining area",
        link: "#",
    },
    {
        id: 3,
        day: "02",
        month: "Oct",
        author: "Preyan Technosys",
        title: "Innovative idea for home decor and office decor",
        imageUrl: "/blog/blog3.jpg",
        altText: "Modern bedroom with office space",
        link: "#",
    },
];

const BlogSection = () => {
    return (
        // You can set your background here.
        // Example: style={{ backgroundImage: "url('/your-bg-image.png')" }}
        <section className="w-full bg-gray-50 py-12 md:py-16" style={{ backgroundImage: "url('/blog/bg.png')" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        Latest From{" "}
                        <span className="border-b-4 border-orange-500 pb-1">Blogs</span>
                    </h2>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <a
                            key={post.id}
                            href={post.link}
                            className="group block bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg"
                        >
                            <div>
                                {/* Image Container */}
                                <div className="relative w-full h-64">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.altText}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={() => { }}
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="p-6 flex gap-4">
                                    {/* Date */}
                                    <div className="shrink-0 text-center">
                                        <span className="block text-2xl font-bold text-orange-500">
                                            {post.day}
                                        </span>
                                        <span className="block text-sm text-gray-600">
                                            {post.month}
                                        </span>
                                    </div>

                                    {/* Post Details */}
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 uppercase">
                                            {post.author}
                                        </p>
                                        <h3 className="mt-1 text-lg font-semibold text-gray-900 leading-tight transition-colors duration-300 group-hover:text-orange-500">
                                            {post.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;