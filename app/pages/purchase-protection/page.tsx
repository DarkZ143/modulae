/* eslint-disable @next/next/no-html-link-for-pages */

import TopOfferBar from "../../components/TopOfferBar";
import Navbar from "../../components/Navbar";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";
import Footer from "../../components/Footer";

const protectionCategories = [
    "Product Verification",
    "Warranty Validation",
    "Damage Inspection",
    "Assembly & Fitting",
    "Return / Replacement",
];

const verificationSteps = [
    {
        title: "1. Product & Model Verification",
        desc: "Each item is matched with your order details – model, size, finish, and configuration are verified against our master catalog before it leaves the warehouse.",
    },
    {
        title: "2. Physical Quality Check",
        desc: "Our QC team inspects joints, welds, hinges, cushions, wood finish, laminate edges, and hardware. Any scratches, dents, or color mismatch are rejected immediately.",
    },
    {
        title: "3. Warranty & Invoice Tagging",
        desc: "The product is tagged with its unique batch/serial details. Your invoice and digital warranty are linked to this product entry, so future service is fast and transparent.",
    },
    {
        title: "4. Safe Packaging & Handling",
        desc: "Furniture is bubble-wrapped, corner-protected and packed in multi-layer cartons. Fragile parts like glass or marble are packed separately with extra safety.",
    },
    {
        title: "5. Delivery & On-Site Verification",
        desc: "At your location, our delivery/assembly team opens the package in front of you, checks all parts, re-verifies finish and size, and assembles (where applicable).",
    },
    {
        title: "6. Final Customer Confirmation",
        desc: "Only after your confirmation and basic demo (recline, storage, hydraulic lift, wheels, etc.), the order is marked as Delivered & Protected in our system.",
    },
];

const warrantyPoints = [
    "Structural damage due to manufacturing defects (frame, joints, welds, etc.).",
    "Peeling of laminate, polish, or veneer within the warranty period under normal usage.",
    "Foam sagging beyond acceptable tolerance for sofas and mattresses.",
    "Mechanism failures in recliners, hydraulic lifts, runners, and hinges (as per warranty terms).",
];

const notCoveredPoints = [
    "Damage due to misuse, rough handling, dragging on floor, or impact.",
    "Swelling or damage caused by water, moisture, or direct sunlight exposure.",
    "Fabric or leather stains, cuts, burns, or pet damage.",
    "Normal wear & tear over time such as minor scratches or color fading.",
];

const outOfWarrantySteps = [
    "You raise a service request from My Orders, Help & Advice, or by contacting support.",
    "Our team checks your order history, product details, and previous service logs.",
    "A technician visit is scheduled with a transparent visit/inspection charge.",
    "Before any work is started, you receive an estimated repair cost for approval.",
    "After your confirmation, parts are ordered (if needed) and repair is completed.",
];

export default function PurchaseProtectionPage() {
    return (
        <>
            <TopOfferBar />
            <Navbar />

            {/* ================== CATEGORY HEADER (TABS STYLE) ================== */}
            <section className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-gray-500">Home / Help & Support / Purchase Protection</p>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                            Purchase Protection & Warranty Assurance
                        </h1>
                        <p className="text-sm md:text-base text-gray-600 mt-1">
                            Every order is verified, protected, and backed by clear service processes.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                        {protectionCategories.map((item) => (
                            <span
                                key={item}
                                className="px-3 py-1 text-xs md:text-sm rounded-full bg-white border border-orange-100 text-orange-600 font-medium shadow-sm"
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================== MAIN CONTENT ================== */}
            <main className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">

                    {/* HERO SECTION */}
                    <section className="grid gap-8 md:grid-cols-2 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Your Furniture, Fully Protected
                            </h2>
                            <p className="mt-4 text-gray-600 text-sm md:text-base">
                                We treat every purchase like a long-term relationship, not a one-time delivery.
                                From product verification at warehouse to warranty support at your doorstep, our
                                purchase protection ensures that what you buy is exactly what you get — safe,
                                genuine, and service-backed.
                            </p>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl bg-white border border-orange-100 p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-orange-500 uppercase">
                                        Before Delivery
                                    </p>
                                    <p className="mt-1 text-sm text-gray-700">
                                        Multi-stage QC, model verification, and proper warranty tagging on every item.
                                    </p>
                                </div>
                                <div className="rounded-xl bg-white border border-green-100 p-4 shadow-sm">
                                    <p className="text-xs font-semibold text-green-600 uppercase">
                                        After Delivery
                                    </p>
                                    <p className="mt-1 text-sm text-gray-700">
                                        Guided installation, damage reporting window, and dedicated post-sale support.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl bg-linear-to-br from-orange-500 via-amber-400 to-rose-500 p-0.5 shadow-lg">
                                <div className="rounded-3xl bg-white p-6 h-full flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            🛡️ Purchase Protection Promise
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600">
                                            For every eligible product, we validate:
                                        </p>
                                        <ul className="mt-3 space-y-2 text-sm text-gray-700">
                                            <li>• Product authenticity & brand verification</li>
                                            <li>• Warranty documents & invoice mapping</li>
                                            <li>• Safe packaging and damage-free delivery</li>
                                            <li>• Priority support for genuine warranty claims</li>
                                        </ul>
                                    </div>
                                    <p className="mt-4 text-xs text-gray-500">
                                        * Full protection is applicable only on products marked with eligible warranty
                                        and used under recommended conditions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ================== HOW WE VERIFY PRODUCTS ================== */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            How We Verify Every Product
                        </h2>
                        <p className="mt-2 text-gray-600 text-sm md:text-base max-w-3xl">
                            Before a product reaches you, it passes through structured checkpoints. This reduces
                            chances of wrong items, incorrect finish, or hidden damage.
                        </p>

                        <div className="mt-6 grid gap-6 md:grid-cols-3">
                            {verificationSteps.map((step) => (
                                <div
                                    key={step.title}
                                    className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
                                >
                                    <h3 className="text-sm font-semibold text-gray-900">{step.title}</h3>
                                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ================== WARRANTY SECTION ================== */}
                    <section className="grid gap-8 md:grid-cols-2 items-start">
                        {/* Warranty Explanation */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                How Warranty & Papers Are Verified
                            </h2>
                            <p className="mt-3 text-sm md:text-base text-gray-600">
                                Your product warranty is digitally linked to your order. At the time of purchase
                                and delivery, we ensure that:
                            </p>

                            <ul className="mt-4 space-y-2 text-sm text-gray-700">
                                <li>• The invoice mentions correct product name, model and configuration.</li>
                                <li>• Brand or Modulae warranty terms are clearly visible on your bill or mail.</li>
                                <li>• Warranty start date is the actual delivery date, not billing date (for eligible items).</li>
                                <li>• Serial / batch number (if present) is recorded against your customer ID.</li>
                            </ul>

                            <p className="mt-4 text-xs text-gray-500">
                                Tip: Always keep a copy of the invoice (PDF or photo) and warranty card. This helps
                                us resolve future claims even faster.
                            </p>
                        </div>

                        {/* Covered vs Not Covered */}
                        <div className="grid gap-4">
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                                <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                                    ✅ Typically Covered Under Warranty
                                </h3>
                                <ul className="mt-3 space-y-2 text-sm text-green-900">
                                    {warrantyPoints.map((p) => (
                                        <li key={p}>• {p}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                                <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                                    ❌ Usually Not Covered
                                </h3>
                                <ul className="mt-3 space-y-2 text-sm text-red-900">
                                    {notCoveredPoints.map((p) => (
                                        <li key={p}>• {p}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* ================== OUT OF WARRANTY SERVICE ================== */}
                    <section className="grid gap-8 md:grid-cols-[1.3fr,1fr] items-center">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                Support Even After Warranty Ends
                            </h2>
                            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl">
                                Your protection doesn’t stop when the warranty period is over. We continue to offer
                                paid service support with transparent charges and genuine parts.
                            </p>

                            <ol className="mt-4 space-y-3 text-sm text-gray-700 list-decimal list-inside">
                                {outOfWarrantySteps.map((s) => (
                                    <li key={s}>{s}</li>
                                ))}
                            </ol>

                            <p className="mt-3 text-xs text-gray-500">
                                Note: Visit charges and repair costs vary by city, product type and part
                                availability. You’ll always see an estimate before approving any work.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-orange-100 shadow-sm p-5">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Quick Protection Checklist (For You)
                            </h3>
                            <ul className="mt-3 space-y-2 text-sm text-gray-700">
                                <li>• Inspect the product at delivery before discarding packaging.</li>
                                <li>• Report any visible damage within 24–48 hours with photos/videos.</li>
                                <li>• Do not self-modify hardware or drill extra holes without guidance.</li>
                                <li>• Use dry cleaning methods and follow care instructions for wood & fabric.</li>
                                <li>• Raise a ticket from your registered email/number for faster verification.</li>
                            </ul>
                        </div>
                    </section>

                </div>
            </main>

            {/* Existing Sections */}
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
