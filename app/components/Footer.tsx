/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, push, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import {
  Phone, Mail, MapPin,
  Facebook, Twitter, Instagram, Linkedin,
  Loader2, Check, Send
} from "lucide-react";

// Fallback Data
const DEFAULT_FOOTER = {
  contact: {
    phone: "(+800) 1234 5678 90",
    email: "example@gmail.com",
    address: "62 North Helen Street, Green Cove, FL 3204"
  },
  socials: {
    twitter: "#",
    facebook: "#",
    pinterest: "#",
    instagram: "#"
  },
  newsletterText: "Off your first order when you sign-up to our newsletter",
  paymentMethods: {
    title: "Payment methods",
    imageUrl: "",
    items: [] // Dynamic list from Admin
  },
  column1: [
    { name: "Admin Panel", href: "/admin-section" },
    { name: "About Us", href: "/pages/about-us" },
    { name: "Help & Advice", href: "/pages/help-and-advice" },
    { name: "Furniture Magazine", href: "/pages/furniture-magazine" }
  ],
  column2: [
    { name: "Furniture Business", href: "/pages/furniture-business" },
    { name: "Contact Us", href: "/pages/contact-us" },
    { name: "Gift Vouchers", href: "/pages/gift-vouchers" }
  ],
  subFooter: [
    { name: "Privacy", href: "/pages/privacy-policy" },
    { name: "Terms & Conditions", href: "/pages/terms" }
  ]
};

const Footer = () => {
  const [data, setData] = useState<any>(DEFAULT_FOOTER);

  // Newsletter State
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const fetchFooter = async () => {
      try {
        const snap = await get(ref(rtdb, "settings/footer"));
        if (snap.exists()) {
          const fetched = snap.val();
          setData({
            ...DEFAULT_FOOTER,
            ...fetched,
            paymentMethods: {
              ...DEFAULT_FOOTER.paymentMethods,
              ...(fetched.paymentMethods || {}),
              items: fetched.paymentMethods?.items || []
            }
          });
        }
      } catch (error) {
        console.error("Error loading footer:", error);
      }
    };
    fetchFooter();
  }, []);

  // ✅ HANDLE SUBSCRIPTION
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return alert("Please enter a valid email.");

    setStatus("loading");
    try {
      // Save to Firebase 'newsletter_subscribers'
      const newSubRef = push(ref(rtdb, "newsletter_subscribers"));
      await set(newSubRef, {
        email,
        joinedAt: new Date().toISOString(),
        source: "Footer"
      });

      setStatus("success");
      setEmail("");
      // Reset success message after 3 seconds
      setTimeout(() => setStatus("idle"), 3000);

    } catch (error) {
      console.error("Subscription failed:", error);
      setStatus("error");
      alert("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <footer
      className="text-gray-300 relative bg-[#111]"
      style={{
        backgroundImage: "linear-gradient(to bottom, #222, #111)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500/10 p-3 rounded-full">
                <Phone className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Call Us</p>
                <p className="text-lg font-bold text-white">{data.contact?.phone}</p>
              </div>
            </div>
            <div className="text-sm space-y-3 text-gray-400">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                {data.contact?.address}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {data.contact?.email}
              </p>
            </div>
            <div className="pt-2">
              <div className="flex space-x-4">
                <a href={data.socials?.facebook} className="hover:text-orange-500 transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href={data.socials?.twitter} className="hover:text-orange-500 transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href={data.socials?.instagram} className="hover:text-orange-500 transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href={data.socials?.pinterest} className="hover:text-orange-500 transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          {/* Column 2: Information */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-6 border-b border-gray-800 pb-2 inline-block">Information</h3>
            <div className="grid grid-cols-2 gap-8">
              <ul className="space-y-3">
                {data.column1?.map((link: any, i: number) => (
                  <li key={i}><Link href={link.href} className="text-sm hover:text-orange-500 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
              <ul className="space-y-3">
                {data.column2?.map((link: any, i: number) => (
                  <li key={i}><Link href={link.href} className="text-sm hover:text-orange-500 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter & Payment */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Newsletter</h3>
              <p className="text-sm text-gray-400 mb-4">{data.newsletterText}</p>

              <form onSubmit={handleSubscribe} className="flex w-full relative">
                <input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "success" || status === "loading"}
                  className="flex-1 bg-white/5 text-white px-4 py-3 rounded-l-md border border-white/10 focus:outline-none focus:border-orange-500 text-sm placeholder-gray-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={status === "success" || status === "loading"}
                  className={`font-bold px-5 py-3 rounded-r-md text-sm transition-colors flex items-center justify-center min-w-[60px]
                                        ${status === "success" ? "bg-green-600 text-white" : "bg-orange-600 text-white hover:bg-orange-700"}
                                    `}
                >
                  {status === "loading" ? <Loader2 className="w-5 h-5 animate-spin" /> :
                    status === "success" ? <Check className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                </button>
              </form>
              {status === "success" && <p className="text-xs text-green-500 mt-2 font-medium animate-fade-in">Successfully Subscribed!</p>}
            </div>

            {/* ✅ DYNAMIC PAYMENT METHODS */}
            <div className="pt-4 border-t border-gray-800">
              <h4 className="font-semibold text-white text-sm mb-3">{data.paymentMethods?.title || "Payment methods"}</h4>

              {data.paymentMethods?.items && data.paymentMethods.items.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {data.paymentMethods.items.map((item: any, idx: number) => (
                    <div key={idx} className="h-8 w-12 bg-white rounded flex items-center justify-center relative overflow-hidden shadow-sm" title={item.name}>
                      {item.imageUrl ? (
                        <Image src={item.imageUrl} alt={item.name} fill className="object-contain p-1" />
                      ) : (
                        <span className="text-[9px] font-bold text-gray-800 uppercase truncate px-1">{item.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 italic">No payment methods configured.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- Sub-Footer --- */}
      <div className="border-t border-white/10 py-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 text-center md:text-left">© 2025, Modulae, INDIA</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {data.subFooter?.map((link: any, i: number) => (
              <Link key={i} href={link.href} className="text-xs text-gray-400 hover:text-white transition-colors">{link.name}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;