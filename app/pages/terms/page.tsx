/* eslint-disable react/no-unescaped-entities */
"use client";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

import Link from "next/link";

export default function TermsAndConditionsPage() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>

      <Navbar />

      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-16">

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-500">
              Last Updated: <span className="font-medium">{currentDate}</span>
            </p>
          </div>

          {/* Content Container */}
          <div className="bg-white shadow-sm rounded-xl p-8 md:p-12 border border-gray-100 space-y-10 text-gray-700 leading-relaxed">

            {/* 1. Introduction */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. Overview
              </h2>
              <p>
                This website is operated by <strong>Modulae</strong>. Throughout the site, the terms
                “we”, “us” and “our” refer to Modulae. By visiting our site and/or purchasing something
                from us, you engage in our “Service” and agree to be bound by the following terms and
                conditions (“Terms of Service”, “Terms”).
              </p>
            </section>

            {/* 2. Online Store Terms */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Online Store Terms
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  By agreeing to these Terms of Service, you represent that you are at least the age
                  of majority in your state or province of residence.
                </li>
                <li>
                  You may not use our products for any illegal or unauthorized purpose nor may you,
                  in the use of the Service, violate any laws in your jurisdiction (including but
                  not limited to copyright laws).
                </li>
                <li>
                  We reserve the right to refuse service to anyone for any reason at any time.
                </li>
              </ul>
            </section>

            {/* 3. Accuracy of Billing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Accuracy of Billing & Account Information
              </h2>
              <p>
                We reserve the right to refuse any order you place with us. We may, in our sole discretion,
                limit or cancel quantities purchased per person, per household or per order. You agree to
                provide current, complete, and accurate purchase and account information for all purchases
                made at our store.
              </p>
            </section>

            {/* 4. Products and Pricing */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. Products & Pricing
              </h2>
              <p className="mb-4">
                Prices for our products are subject to change without notice. We have made every effort
                to display as accurately as possible the colors and images of our products. We cannot
                guarantee that your computer monitor's display of any color will be accurate.
              </p>
            </section>

            {/* 5. Returns and Refunds */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Returns & Refunds
              </h2>
              <p>
                Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately,
                we cannot offer you a refund or exchange. To be eligible for a return, your item must
                be unused and in the same condition that you received it.
              </p>
              <p className="mt-2 text-sm italic">
                (Please review our dedicated <Link href="/pages/faq" className="text-orange-600 underline">Returns Policy</Link> page for full details).
              </p>
            </section>

            {/* 6. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Limitation of Liability
              </h2>
              <p>
                In no case shall Modulae, our directors, officers, employees, affiliates, agents,
                contractors, interns, suppliers, service providers or licensors be liable for any
                injury, loss, claim, or any direct, indirect, incidental, punitive, special, or
                consequential damages of any kind arising from your use of any of the service or
                any products procured using the service.
              </p>
            </section>

            {/* 7. Contact Information */}
            <section className="bg-orange-50 p-6 rounded-lg border border-orange-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Contact Information
              </h2>
              <p className="mb-4 text-sm">
                Questions about the Terms of Service should be sent to us at:
              </p>
              <ul className="text-sm font-medium space-y-1">
                <li>Email: <a href="mailto:legal@modulae.com" className="text-orange-600 hover:underline">legal@modulae.com</a></li>
                <li>Address: Modulae HQ, Furniture City, India</li>
              </ul>
            </section>

          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}