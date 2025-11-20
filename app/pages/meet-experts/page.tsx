"use client";

import TopOfferBar from "../../components/TopOfferBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import CategoryHeader from "@/app/components/CategoryHeader";
import BlogSection from "@/app/components/blog";

const experts = [
    {
        name: "Dr. Arvind Khurana",
        title: "Senior Wood Technologist (IIT - Forestry Division)",
        image: "/experts/arvind.png",
        content: `Wood behaves like a living material even after processing — it expands, contracts, 
        breathes, and ages gracefully. When selecting wood for furniture, density, grain pattern, 
        moisture content, and structural rigidity matter far more than color.  

        Hardwoods like Sheesham and Teak are slow-grown, more stable, and naturally termite resistant. 
        Mango wood is affordable and eco-friendly, while Acacia has a smoother grain with lightweight 
        strength. Engineered woods like Plywood, HDF, and MDF each serve specific structural purposes.  

        True craftsmanship comes from using the correct wood *in the correct place*:  
        - **Hardwoods for legs & frames**  
        - **Plywood for load-bearing panels**  
        - **HDF for smooth finishes**  
        - **MDF for carved or curved designs**  

        Good furniture is not about heavy wood — it’s about *balanced engineering* that ensures 
        strength, sustainability, and longevity.`,
    },
    {
        name: "Megha Bansal",
        title: "Metal & Structural Engineer (Ex–Tata Steel)",
        image: "/experts/megha.png",
        content: `Steel furniture has become a backbone of modern homes due to its structural strength, 
        fire resistance, and durability. The quality depends on the grade of steel, welding technique, 
        thickness (gauge), and anti-rust treatment.  

        High-carbon steel offers rigidity, but stainless steel provides corrosion resistance, while 
        powder-coated steel blends aesthetics with long life.  

        In premium products, modular metal frames distribute load more evenly than traditional 
        wooden joinery. This not only increases life but also allows lightweight designs without 
        compromising strength. Good metal furniture never squeaks, bends, or rusts — if engineered right.`,
    },
    {
        name: "Raghav Sethi",
        title: "Fabric & Upholstery Expert (15+ Years Experience)",
        image: "/experts/raghav.png",
        content: `Upholstery defines comfort more than cushioning. The weave density, GSM weight, 
        colorfastness, stain resistance, and tensile strength determine long-term performance.  

        For home furniture, polyester blends are excellent due to resilience. For luxury sofas, suede 
        and velvet create premium aesthetics. Outdoor furniture demands waterproof and UV-stabilized fabrics.  

        The secret lies in layering:  
        - Base elastic webbings  
        - High-resilience foam  
        - Soft-contact foam  
        - Breathable microfiber lining  
        - Top fabric with reinforced stitching  

        Proper upholstery breathes, supports, and adapts to the body — turning furniture into a 
        long-term companion rather than a disposable object.`,
    },
    {
        name: "Prateek Jaiswal",
        title: "Foam & Comfort Scientist (Certified Orthopedic Foam Designer)",
        image: "/experts/prateek.png",
        content: `Foam quality determines how your spine feels every day. The density, ILD rating (firmness), 
        rebound speed, and cell structure define true comfort.  

        HR (High Resilience) foam provides bounce and longevity, while Memory Foam molds to the body for 
        pressure relief. Rebonded foam is used in structural bases for long-lasting firmness.  

        A well-designed sofa uses at least 2–3 foam layers:  
        - Hard base foam for support  
        - Soft top foam for comfort  
        - A gel or memory layer for premium feel  

        Premium comfort isn’t about “softness” — it’s about ergonomic engineering that keeps your spine in 
        natural alignment.`,
    },
    {
        name: "Simran Kaur",
        title: "Surface Finish & Coating Specialist",
        image: "/experts/simran.png",
        content: `Finishes protect furniture from moisture, scratches, and sun exposure while giving it 
        modern appeal. Melamine is durable and economical, PU (Polyurethane) gives high-gloss and 
        premium smoothness, while veneer adds natural beauty of wood grains.  

        Powder coating on steel offers unmatched rust protection.  

        Finishing is not cosmetic — it’s a protective science. A well-finished product stays new for years.`,
    },
];

export default function MeetExpertsPage() {
    return (
        <>
            <TopOfferBar />
            <Navbar />
            <CategoryHeader title="Meet Experts" />

            <div className="max-w-6xl mx-auto px-6 py-12">

                {/* PAGE TITLE */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
                    Meet Our <span className="underline decoration-orange-500 underline-offset-4">Experts</span>
                </h1>
                <p className="text-center text-gray-600 max-w-2xl mx-auto">
                    Insights from industry professionals who specialize in wood, metals, upholstery, comfort science, and finish engineering.
                </p>

                {/* EXPERT CARDS */}
                <div className="mt-16 space-y-20">
                    {experts.map((exp, index) => (
                        <div
                            key={index}
                            className={`grid md:grid-cols-2 gap-10 items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                        >
                            {/* IMAGE */}
                            <div className="flex justify-center">
                                <Image
                                    src={exp.image}
                                    alt={exp.name}
                                    width={420}
                                    height={420}
                                    className="rounded-2xl shadow-lg object-cover"
                                />
                            </div>

                            {/* TEXT */}
                            <div>
                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{exp.name}</h2>
                                <p className="text-orange-600 font-medium mt-1">{exp.title}</p>

                                <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line">
                                    {exp.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <BlogSection />

            <Footer />
        </>
    );
}
