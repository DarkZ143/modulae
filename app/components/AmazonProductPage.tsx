/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Star, CheckCircle, Minus, Plus } from "lucide-react";

export default function AmazonProductPage({
    product,
    selectedImg,
    setSelectedImg,
    handleAddToCart,
    handleBuyNow,
    increaseQty,
    decreaseQty,
    qty,
    reviews,
}: any) {
    return (
        <div className="max-w-7xl mx-auto px-4 py-6">

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT IMAGE */}
                <div>
                    <div className="relative w-full h-[450px] border border-gray-500 rounded-xl bg-white overflow-hidden group">
                        <div
                            className="w-full h-full transition-transform duration-200 ease-out group-hover:scale-150"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = ((e.clientX - rect.left) / rect.width) * 100;
                                const y = ((e.clientY - rect.top) / rect.height) * 100;
                                e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transformOrigin = "center";
                            }}
                        >
                            <Image
                                src={selectedImg || product.images[0]}
                                alt={product.title}
                                fill
                                priority
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 450px"
                                style={{ cursor: "zoom-in" }}
                            />
                        </div>
                    </div>



                    <div className="flex gap-3 mt-4 overflow-x-auto">
                        {product.images.map((img: string) => (
                            <button
                                key={img}
                                onClick={() => setSelectedImg(img)}
                                className="relative w-20 h-20 border border-gray-500 rounded-md overflow-hidden"
                            >
                                <Image src={img} alt="thumb" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* MIDDLE DETAILS */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold">{product.title}</h1>

                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : ""
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-gray-500">({product.reviews} ratings)</span>
                    </div>

                    <div>
                        <p className="text-red-600 font-bold text-lg">
                            -{(((product.mrp - product.price) / product.mrp) * 100).toFixed(0)}%
                        </p>
                        <p className="text-4xl font-bold">₹{product.price}</p>
                        <p className="line-through text-gray-500">M.R.P.: ₹{product.mrp}</p>
                    </div>

                    <hr />

                    {/* ABOUT */}
                    <ul className="list-disc ml-5 text-gray-700 space-y-1">
                        {product.description
                            .split(".")
                            .filter((x: string) => x.trim().length)
                            .map((line: string, i: number) => (
                                <li key={i}>{line}</li>
                            ))}
                    </ul>

                    {/* SPECIFICATIONS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded-xl border border-gray-500 shadow-xl">
                        {Object.entries(product.specifications).map(([k, v]) => (
                            <div key={k}>
                                <p className="text-gray-500 text-sm">{k}</p>
                                <p className="font-semibold">{String(v)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT BUY BOX */}
                <div className="p-5 border border-gray-500 rounded-xl bg-white h-fit space-y-4 shadow-xl">

                    <p className="text-3xl font-bold">₹{product.price}</p>

                    <p className="text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-5 h-5" /> In Stock
                    </p>

                    {/* ✅ Quantity Control */}
                    {qty === 0 ? (
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-full"
                        >
                            Add to Cart
                        </button>
                    ) : (
                        <div className="flex items-center justify-between border border-gray-500 rounded-full px-4 py-2">
                            <button onClick={decreaseQty}>
                                <Minus />
                            </button>
                            <span className="font-bold">{qty}</span>
                            <button onClick={increaseQty}>
                                <Plus />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handleBuyNow}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full"
                    >
                        Buy Now
                    </button>

                </div>
            </div>

            {/* ✅ REVIEWS SECTION */}
            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review: any, i: number) => (
                            <div
                                key={i}
                                className="bg-white p-5 rounded-xl border border-gray-500 shadow-sm"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <Image
                                        src={review.userImage || "/avatar.png"}
                                        alt="user"
                                        width={40}
                                        height={40}
                                        className="rounded-full"
                                    />
                                    <div>
                                        <p className="font-bold">{review.user || "Verified User"}</p>
                                        <span className="text-green-600 text-xs flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Verified Purchase
                                        </span>
                                    </div>
                                </div>

                                <div className="flex text-yellow-400 mb-2">
                                    {[...Array(5)].map((_, j) => (
                                        <Star
                                            key={j}
                                            className={`w-4 h-4 ${j < review.rating ? "fill-current" : ""
                                                }`}
                                        />
                                    ))}
                                </div>

                                <p className="text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
}
