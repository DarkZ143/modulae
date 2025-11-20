"use client";

import TopOfferBar from "../../components/TopOfferBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";
import Image from "next/image";
import CategoryHeader from "@/app/components/CategoryHeader";

// Team Members
const teamMembers = [
    {
        name: "Arjun Mehra",
        role: "Head of Manufacturing",
        image: "/gallery/arjun.png",
    },
    {
        name: "Riya Kapoor",
        role: "Operations Manager",
        image: "/gallery/riya.png",
    },
    {
        name: "Sahil Ansari",
        role: "Chief Design Architect",
        image: "/gallery/sahil.png",
    },
    {
        name: "Yunus Khan",
        role: "Quality Assurance Lead",
        image: "/gallery/yunus.png",
    },
];

// Factories
const factoryLocations = [
    {
        title: "Delhi Manufacturing Unit",
        image: "/gallery/delhi.png",
        desc: "Our primary production facility specializing in wooden furniture.",
    },
    {
        title: "Gurugram Steel Plant",
        image: "/gallery/gurugram.png",
        desc: "Dedicated to metal processing, steel frames, and modular structures.",
    },
    {
        title: "Noida Upholstery Unit",
        image: "/gallery/noida.png",
        desc: "Expert team producing premium cushions, sofas, and fabric finishes.",
    },
];

// Work Culture
const workCultureItems = [
    {
        title: "Creative Workspace",
        image: "/gallery/creative.png",
        desc: "A collaborative space where designers and engineers brainstorm daily.",
    },
    {
        title: "Modern Technology",
        image: "/gallery/modern.png",
        desc: "CNC machinery, 3D modeling, and automated cutting systems.",
    },
    {
        title: "Skilled Workforce",
        image: "/gallery/skilled.png",
        desc: "Craftsmen, carpenters, engineers, and supervisors working together.",
    },
    {
        title: "Safe Environment",
        image: "/gallery/safe.png",
        desc: "Dust-free workstation, safety gear, and ergonomic working conditions.",
    },
];

export default function GalleryPage() {
    return (
        <>
            <TopOfferBar />
            <Navbar />
            <CategoryHeader title="Gallery" />

            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* PAGE HEADING */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
                    Our <span className="text-orange-600 underline underline-offset-4 decoration-orange-400">Gallery</span>
                </h1>

                <p className="text-center text-gray-600 mt-3 max-w-2xl mx-auto">
                    Get to know our founder, meet our talented team, and explore how we build the finest furniture.
                </p>

                {/* ====================== FOUNDER SECTION ====================== */}
                <div className="mt-14 grid md:grid-cols-2 gap-10 items-center">
                    {/* Text */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Meet Our Founder</h2>
                        <p className="text-gray-700 mt-4 leading-relaxed text-lg">
                            <strong>Danish Shafiq</strong>, founder of Modulae, started the journey with a vision to
                            modernize the Indian furniture market through premium craftsmanship and innovative designs.
                        </p>

                        <p className="text-gray-700 mt-4 leading-relaxed">
                            His mission is to bring high-quality furniture at affordable prices while ensuring
                            durability, aesthetic excellence, and customer satisfaction. Under his leadership,
                            Modulae has grown into a trusted brand in several states.
                        </p>
                    </div>

                    {/* Image */}
                    <div className="flex justify-center">
                        <Image
                            src="/gallery/danish.png"
                            alt="Founder"
                            width={420}
                            height={420}
                            className="rounded-2xl shadow-lg object-cover"
                        />
                    </div>
                </div>

                {/* ====================== TEAM MEMBERS ====================== */}
                <section className="mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team Members</h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {teamMembers.map((member, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl  shadow-lg p-5 text-center hover:shadow-md transition hover:shadow-orange-400"
                            > 
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    width={160}
                                    height={160}
                                    className="mx-auto rounded-lg object-cover"
                                />

                                <h3 className="text-lg font-semibold mt-4">{member.name}</h3>
                                <p className="text-sm text-gray-600">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ====================== FACTORIES ====================== */}
                <section className="mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Factories</h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {factoryLocations.map((item, i) => (
                            <div key={i} className="bg-white  rounded-xl shadow-lg p-5 hover:shadow-amber-400 transition ">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={400}
                                    height={260}
                                    className="rounded-lg object-cover"
                                />

                                <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ====================== WORK CULTURE ====================== */}
                <section className="mt-20">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Work Culture & Environment</h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {workCultureItems.map((item, i) => (
                            <div
                                key={i}
                                className="bg-white  rounded-xl shadow-lg p-5 hover:shadow-orange-400 transition"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={300}
                                    height={200}
                                    className="rounded-lg object-cover"
                                />

                                <h3 className="text-lg font-semibold mt-4">{item.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
            <LatestProducts />

            {/* REUSABLE COMPONENTS */}
            <BlogSection />
            <Footer />
        </>
    );
}
