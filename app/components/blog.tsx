/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";

// Long, high-quality blog content for popups
const blogPosts = [
    {
        id: 1,
        day: "25",
        month: "Nov",
        author: "Modulae Editorial Team",
        title: "Modern House Trends for Future Lifestyles",
        imageUrl: "/blog/blog1.jpg",
        altText: "Modern living room",
        content: `
Modern homes are evolving rapidly, blending functionality with futuristic design thinking. 
The shift toward multi-purpose living is stronger than ever—homes are no longer just shelters; 
they have become personal offices, wellness centers, and creativity hubs. 

Minimalistic layouts continue to dominate, but with warmer tones, sustainable materials, and 
smart space-saving furniture. Built-in storage, modular wardrobes, sliding partitions, and 
hidden-study units are at peak demand among modern buyers. Consumers now prefer natural textures— 
solid wood, grainy laminates, linen fabrics, and matte metal finishes—to bring calmness and a 
sense of grounding into their spaces.

Smart lighting, motion-based appliances, and voice-controlled automation are integrating seamlessly 
into everyday furniture designs. As families seek long-term value, durable materials like engineered 
wood, powder-coated steel, and premium upholstery are becoming the go-to recommendations by interior 
experts.

The future lifestyle is all about *flexible living*: living rooms that transform into workspaces, 
beds with hydraulic storage, expandable dining units, and compact sofas that don't compromise on 
comfort. This blend of smart ergonomics and cozy aesthetics is shaping the next era of home design.
        `,
    },
    {
        id: 2,
        day: "22",
        month: "Nov",
        author: "Modulae Interior Insights",
        title: "Minimalist Décor Ideas for Peaceful Homes",
        imageUrl: "/blog/blog2.jpg",
        altText: "Minimalist dining area",
        content: `
Minimalist home décor isn't about empty rooms—it's about intentional design. The idea is to 
remove visual noise while improving functionality. Start by focusing on neutral palettes—creams, 
beiges, pale wood, and matte black accents. These tones instantly create visual calmness.

Furniture plays a major role. Choose pieces with clean lines and multi-purpose use—sofa beds, 
extendable tables, or sleek console units. Avoid heavy carving or overly bright colors; the aim is 
to create a flow that feels breathable. Natural light is your best décor element—use it to make 
spaces appear bigger and softer.

Plants, textured rugs, and subtle wall art can add depth without cluttering the environment. 
Minimalist homes feel luxurious because they emphasize *quality over quantity*. A single good 
laminated shelf, a well-crafted dining table, or a comfortable ergonomic chair can transform your 
everyday experience.

This trend isn’t fading anytime soon—it’s becoming a lifestyle choice that reduces stress and 
promotes mental clarity. A minimalist home is peaceful, practical, and truly timeless.
        `,
    },
    {
        id: 3,
        day: "19",
        month: "Nov",
        author: "Modulae Design Desk",
        title: "How to Choose Décor That Truly Matches Your Personality",
        imageUrl: "/blog/blog3.jpg",
        altText: "Modern bedroom with office space",
        content: `
Choosing décor is less about trends and more about expressing who you are. Your home environment 
affects your mood, focus, and comfort—so it should reflect your personality. If you're a calm 
person, go for soft neutrals, linen upholstery, and rounded furniture shapes. If you’re energetic 
and creative, accent colors, bold wall frames, and layered lighting can bring your vision to life.

Before buying any décor item, ask yourself:  
1. Does it solve a purpose?  
2. Does it match my lifestyle?  
3. Will I still love it after six months?

Textures matter too—wood for warmth, metal for confidence, glass for openness. The right mix 
creates harmony. Your bedroom should feel personal with soft fabrics, while your workspace should 
enhance focus with ergonomic furniture and steady lighting.

Décor becomes meaningful when every piece has a story. Build your interior slowly, thoughtfully, 
and with intention. Your home should feel like *you*.
        `,
    },
];

export default function BlogSection() {
    const [selectedPost, setSelectedPost] = useState<any>(null);

    return (
        <>
            {/* BG Section */}
            <section
                className="w-full bg-gray-50 py-12 md:py-16"
                style={{ backgroundImage: "url('/blog/bg.png')" }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Title */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Latest From{" "}
                            <span className="border-b-4 border-orange-500 pb-1">
                                Blogs
                            </span>
                        </h2>
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => setSelectedPost(post)}
                                className="cursor-pointer group block bg-white rounded-lg shadow-sm overflow-hidden transition hover:shadow-lg"
                            >
                                <div className="relative w-full h-64">
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.altText}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex gap-4">
                                    <div className="text-center shrink-0">
                                        <span className="block text-2xl font-bold text-orange-500">
                                            {post.day}
                                        </span>
                                        <span className="block text-sm text-gray-600">
                                            {post.month}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500 uppercase">
                                            {post.author}
                                        </p>
                                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500">
                                            {post.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* POPUP MODAL */}
            {/* POPUP MODAL */}
            {selectedPost && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center p-4 z-50"
                    onClick={() => setSelectedPost(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={() => setSelectedPost(null)}
                            className="absolute top-4 right-4 z-20 text-black bg-white rounded-full p-4  hover:text-white text-xl hover:bg-orange-500"
                        >
                            ✕
                        </button>

                        {/* FULL-WIDTH RESPONSIVE IMAGE */}
                        <div className="relative w-full aspect-16/10 md:aspect-16/8 overflow-hidden">
                            <Image
                                src={selectedPost.imageUrl}
                                alt={selectedPost.altText}
                                fill
                                className="object-cover w-full h-full"
                            />
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto mb-4">
                            <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>

                            <p className="text-gray-500 text-sm mb-6">
                                {selectedPost.day} {selectedPost.month} • {selectedPost.author}
                            </p>

                            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                {selectedPost.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
