/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Star, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { ref, set, remove, onValue } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";


function getDeliveryDays(km: number) {
    if (km <= 50) return 2;
    if (km <= 200) return 4;
    if (km <= 500) return 6;
    if (km <= 1000) return 8;
    return 10;
}



export default function FlipkartProductPage({
    product,
    reviews,
}: {
    product: any;
    reviews: any[];
}) {
    const [selectedImg, setSelectedImg] = useState(product.images?.[0]);
    const [showAllSpecs, setShowAllSpecs] = useState(false);
    const [zoomStyle, setZoomStyle] = useState<any>({});

    const discount = Math.round(
        ((product.mrp - product.price) / product.mrp) * 100
    );
    const [isWishlisted, setIsWishlisted] = useState(false);
    const router = useRouter();

    const productId = product.productSlug ?? product.id ?? product.title;
    const safeProductId = String(productId)
        .replace(/[.#$/\[\]]/g, "_");



    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) return;

            const wishlistRef = ref(
                rtdb,
                `wishlists/${user.uid}/${safeProductId}`

            );

            onValue(wishlistRef, (snap) => {
                setIsWishlisted(snap.exists());
            });
        });

        return () => unsub();
    }, [safeProductId]);


    const toggleWishlist = async () => {
        const user = auth.currentUser;

        if (!user) {
            router.push("/auth/login");
            return;
        }

        if (!productId) {
            alert("Product cannot be added to wishlist.");
            return;
        }

        const wishlistRef = ref(
            rtdb,
            `wishlists/${user.uid}/${productId}`
        );

        if (isWishlisted) {
            await remove(wishlistRef);
        } else {
            await set(wishlistRef, {
                productId,
                title: product.title,
                price: product.price,
                image: product.images?.[0] || "",
                createdAt: new Date().toISOString(),
            });
        }
    };




    return (
        <div className="max-w-[1200px] mx-auto px-4 py-6">
            <div className="grid grid-cols-12 gap-6">
                {/* LEFT – IMAGE */}
                <div className="col-span-12 lg:col-span-4">
                    <div className="sticky top-20">
                        <div className="border border-gray-100 bg-white p-3 relative">
                            {/* Wishlist */}
                            <button
                                onClick={toggleWishlist}
                                disabled={!productId}
                                className={`absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-sm transition
    ${!productId ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
  `}
                            >

                                <Heart
                                    className={`w-5 h-5 transition ${isWishlisted
                                        ? "text-red-500 fill-red-500"
                                        : "text-gray-500"
                                        }`}
                                />
                            </button>


                            {/* IMAGE BLOCK */}
                            <div className="grid grid-cols-[60px_1fr] gap-3 h-[420px] relative">
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-2">
                                    {product.images?.map((img: string) => (
                                        <button
                                            key={img}
                                            onMouseEnter={() => setSelectedImg(img)}
                                            className="border border-gray-100 p-1 bg-white"
                                        >
                                            <Image src={img} alt="" width={50} height={50} />
                                        </button>
                                    ))}
                                </div>

                                {/* Main Image */}
                                <div
                                    className="relative border border-gray-100 overflow-hidden bg-white"
                                    onMouseMove={(e) => {
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x =
                                            ((e.clientX - rect.left) / rect.width) * 100;
                                        const y =
                                            ((e.clientY - rect.top) / rect.height) * 100;

                                        setZoomStyle({
                                            backgroundImage: `url(${selectedImg})`,
                                            backgroundPosition: `${x}% ${y}%`,
                                            backgroundSize: "220%",
                                        });
                                    }}
                                    onMouseLeave={() => setZoomStyle({})}
                                >
                                    <Image
                                        src={selectedImg}
                                        alt={product.title}
                                        fill
                                        className="object-contain"
                                    />
                                </div>

                                {/* ZOOM PREVIEW – OUTSIDE IMAGE */}
                                {Object.keys(zoomStyle).length > 0 && (
                                    <div className="hidden lg:block absolute left-full top-0 ml-6 w-[420px] h-[420px] border border-gray-100 bg-white z-20 shadow-lg">
                                        <div
                                            className="w-full h-full"
                                            style={{
                                                ...zoomStyle,
                                                backgroundRepeat: "no-repeat",
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={product.onAddToCart}
                                className="flex-1 bg-yellow-400 py-3 font-bold"
                            >
                                ADD TO CART
                            </button>
                            <button
                                onClick={product.onBuyNow}
                                className="flex-1 bg-orange-500 py-3 font-bold text-white"
                            >
                                BUY NOW
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT – DETAILS */}
                <div className="col-span-12 lg:col-span-8 space-y-6 max-w-[620px]">
                    <h1 className="text-xl font-semibold">{product.title}</h1>

                    <div className="flex items-center gap-2">
                        <span className="bg-green-600 text-white px-2 text-sm flex items-center gap-1">
                            {product.rating} <Star className="w-3 h-3 fill-white" />
                        </span>
                        <span className="text-gray-500 text-sm">
                            {product.reviewsCount} Ratings & Reviews
                        </span>
                    </div>

                    <div>
                        <p className="text-3xl font-bold">₹{product.price}</p>
                        <p className="text-sm">
                            <span className="line-through text-gray-500">
                                ₹{product.mrp}
                            </span>
                            <span className="text-green-600 ml-2">
                                {discount}% off
                            </span>
                        </p>
                    </div>

                    {product.offers?.length > 0 && (
                        <div className="border border-gray-100 p-3 bg-white">
                            <p className="font-semibold">Available Offers</p>
                            <ul className="list-disc ml-5 text-sm">
                                {product.offers.map((o: string) => (
                                    <li key={o}>{o}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {product.deliveryKm && (
                        <p className="text-sm">
                            Delivery in{" "}
                            <b>{getDeliveryDays(product.deliveryKm)} Days</b>
                        </p>
                    )}

                    {/* Highlights */}
                    {product.highlights && (
                        <div>
                            <h3 className="font-semibold mb-2">Highlights</h3>

                            <div className="space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                {Object.entries(product.highlights).map(
                                    ([key, value]: [string, any]) => (
                                        <div
                                            key={key}
                                            className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0"
                                        >
                                            <span>
                                                <span className="font-semibold text-gray-800">
                                                    {key}:
                                                </span>{" "}
                                                {String(value)}
                                            </span>
                                        </div>
                                    )
                                )}

                                {Object.keys(product.highlights).length === 0 && (
                                    <p className="text-xs text-gray-400 italic text-center">
                                        No highlights available.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}


                    {/* Specifications */}
                    <div>
                        <h3 className="font-semibold">Specifications</h3>
                        {(showAllSpecs
                            ? Object.entries(product.specifications)
                            : Object.entries(product.specifications).slice(0, 5)
                        ).map(([k, v]) => (
                            <div
                                key={k}
                                className="grid grid-cols-2 text-sm py-1 border-b border-gray-100"
                            >
                                <span className="text-gray-500">{k}</span>
                                <span>{String(v)}</span>
                            </div>
                        ))}

                        {Object.keys(product.specifications || {}).length > 5 && (
                            <button
                                onClick={() => setShowAllSpecs(!showAllSpecs)}
                                className="text-blue-600 text-sm mt-2"
                            >
                                {showAllSpecs ? "Show Less" : "See More"}
                            </button>
                        )}
                    </div>

                    {/* Reviews */}
                    <div>
                        <h3 className="font-semibold">Ratings & Reviews</h3>
                        {reviews.map((r) => (
                            <div
                                key={r.id}
                                className="border border-gray-100 p-4 mt-3 bg-white"
                            >
                                <p className="font-semibold">{r.user}</p>
                                <p className="text-sm">{r.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
