/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, set } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Save, Trash2, Phone, Mail, MapPin, CreditCard, Plus, X } from "lucide-react";
import Image from "next/image";

// Full Original Data Structure
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
        imageUrl: "", // Legacy support
        items: [] // ✅ New Dynamic Array
    },
    column1: [
        { name: "Admin Panel", href: "/admin-section" },
        { name: "About Us", href: "/pages/about-us" },
        { name: "Help & Advice", href: "/pages/help-and-advice" },
        { name: "Furniture Magazine", href: "/pages/furniture-magazine" },
        { name: "FR Collections", href: "/shop" },
        { name: "Purchase Protection", href: "/pages/purchase-protection" },
        { name: "Meet Experts", href: "/pages/meet-experts" }
    ],
    column2: [
        { name: "Furniture Business", href: "/pages/furniture-business" },
        { name: "Contact Us", href: "/pages/contact-us" },
        { name: "Gift Vouchers", href: "/pages/gift-vouchers" },
        { name: "Gallery", href: "/pages/gallery" },
        { name: "Brands", href: "/pages/brands" },
        { name: "Help Topics", href: "/pages/faq" }
    ],
    subFooter: [
        { name: "About Us", href: "/pages/about-us" },
        { name: "Services", href: "/pages/services" },
        { name: "Privacy", href: "/pages/privacy-policy" },
        { name: "Terms & Conditions", href: "/pages/terms" }
    ]
};

export default function AdminFooter() {
    const [data, setData] = useState<any>(DEFAULT_FOOTER);
    const [loading, setLoading] = useState(true);

    // Temp states for adding links
    const [newLink1, setNewLink1] = useState({ name: "", href: "" });
    const [newLink2, setNewLink2] = useState({ name: "", href: "" });
    const [newLinkSub, setNewLinkSub] = useState({ name: "", href: "" });

    // ✅ Temp state for new payment method
    const [newPayment, setNewPayment] = useState({ name: "", imageUrl: "" });

    // 1. Fetch Data
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
                } else {
                    setData(DEFAULT_FOOTER);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFooter();
    }, []);

    // 2. Save Data
    const handleSave = async () => {
        try {
            await set(ref(rtdb, "settings/footer"), data);
            alert("Footer updated successfully!");
        } catch (error) {
            alert("Failed to save.");
        }
    };

    // Helper: Update nested state
    const updateContact = (field: string, value: string) => {
        setData({ ...data, contact: { ...data.contact, [field]: value } });
    };

    const updateSocial = (field: string, value: string) => {
        setData({ ...data, socials: { ...data.socials, [field]: value } });
    };

    const updatePaymentTitle = (val: string) => {
        setData({ ...data, paymentMethods: { ...data.paymentMethods, title: val } });
    };

    // Helper: Link Management
    const addLink = (column: "column1" | "column2" | "subFooter", linkState: any, setLinkState: any) => {
        if (!linkState.name || !linkState.href) return;
        const updated = [...(data[column] || []), linkState];
        setData({ ...data, [column]: updated });
        setLinkState({ name: "", href: "" });
    };

    const removeLink = (column: "column1" | "column2" | "subFooter", index: number) => {
        const updated = [...data[column]];
        updated.splice(index, 1);
        setData({ ...data, [column]: updated });
    };

    // ✅ Helper: Payment Methods Management
    const addPaymentMethod = () => {
        if (!newPayment.name) return;
        const currentItems = data.paymentMethods.items || [];
        const updated = [...currentItems, newPayment];

        setData({
            ...data,
            paymentMethods: { ...data.paymentMethods, items: updated }
        });
        setNewPayment({ name: "", imageUrl: "" });
    };

    const removePaymentMethod = (index: number) => {
        const updated = [...data.paymentMethods.items];
        updated.splice(index, 1);
        setData({
            ...data,
            paymentMethods: { ...data.paymentMethods, items: updated }
        });
    };

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Footer Settings...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Footer Manager</h2>
                    <p className="text-sm text-gray-500">Update contact info, social links, and navigation.</p>
                </div>
                <button onClick={handleSave} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 shadow-md font-bold transition">
                    <Save className="w-5 h-5" /> Publish
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* 1. Contact Information */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Contact Details</h3>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</label><input type="text" value={data.contact?.phone} onChange={e => updateContact("phone", e.target.value)} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label><input type="text" value={data.contact?.email} onChange={e => updateContact("email", e.target.value)} className="w-full p-2 border rounded text-sm" /></div>
                    <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</label><textarea value={data.contact?.address} onChange={e => updateContact("address", e.target.value)} className="w-full p-2 border rounded text-sm h-20" /></div>
                </div>

                {/* 2. Social Media Links */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Social Media</h3>
                    {["twitter", "facebook", "pinterest", "instagram"].map((platform) => (
                        <div key={platform}>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1">{platform}</label>
                            <input type="text" value={data.socials?.[platform] || ""} onChange={e => updateSocial(platform, e.target.value)} className="w-full p-2 border rounded text-sm text-blue-600" placeholder="#" />
                        </div>
                    ))}
                </div>

                {/* 3. Footer Links (Column 1) */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Column 1 Links</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {data.column1?.map((link: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                                <span className="flex-1 text-sm font-medium">{link.name}</span>
                                <span className="text-xs text-gray-400 truncate w-24">{link.href}</span>
                                <button onClick={() => removeLink("column1", idx)} className="text-red-500 hover:bg-red-100 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                        <input type="text" placeholder="Name" className="w-1/3 p-2 border rounded text-xs" value={newLink1.name} onChange={e => setNewLink1({ ...newLink1, name: e.target.value })} />
                        <input type="text" placeholder="Link" className="w-1/3 p-2 border rounded text-xs" value={newLink1.href} onChange={e => setNewLink1({ ...newLink1, href: e.target.value })} />
                        <button onClick={() => addLink("column1", newLink1, setNewLink1)} className="bg-gray-900 text-white px-3 rounded text-xs font-bold">Add</button>
                    </div>
                </div>

                {/* 4. Footer Links (Column 2) */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Column 2 Links</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                        {data.column2?.map((link: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded">
                                <span className="flex-1 text-sm font-medium">{link.name}</span>
                                <span className="text-xs text-gray-400 truncate w-24">{link.href}</span>
                                <button onClick={() => removeLink("column2", idx)} className="text-red-500 hover:bg-red-100 p-1 rounded"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t">
                        <input type="text" placeholder="Name" className="w-1/3 p-2 border rounded text-xs" value={newLink2.name} onChange={e => setNewLink2({ ...newLink2, name: e.target.value })} />
                        <input type="text" placeholder="Link" className="w-1/3 p-2 border rounded text-xs" value={newLink2.href} onChange={e => setNewLink2({ ...newLink2, href: e.target.value })} />
                        <button onClick={() => addLink("column2", newLink2, setNewLink2)} className="bg-gray-900 text-white px-3 rounded text-xs font-bold">Add</button>
                    </div>
                </div>

                {/* 5. Sub Footer Links */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4 md:col-span-2">
                    <h3 className="font-bold text-lg border-b pb-2 mb-2">Sub-Footer Links</h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto flex flex-wrap gap-2">
                        {data.subFooter?.map((link: any, idx: number) => (
                            <div key={idx} className="flex gap-2 items-center bg-gray-50 p-2 rounded w-fit">
                                <span className="text-sm font-medium">{link.name}</span>
                                <button onClick={() => removeLink("subFooter", idx)} className="text-red-500 hover:bg-red-100 p-1 rounded"><X className="w-3 h-3" /></button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-2 pt-2 border-t max-w-md">
                        <input type="text" placeholder="Name" className="w-1/3 p-2 border rounded text-xs" value={newLinkSub.name} onChange={e => setNewLinkSub({ ...newLinkSub, name: e.target.value })} />
                        <input type="text" placeholder="Link" className="w-1/3 p-2 border rounded text-xs" value={newLinkSub.href} onChange={e => setNewLinkSub({ ...newLinkSub, href: e.target.value })} />
                        <button onClick={() => addLink("subFooter", newLinkSub, setNewLinkSub)} className="bg-gray-900 text-white px-3 rounded text-xs font-bold">Add</button>
                    </div>
                </div>

                {/* 6. Newsletter & Payment Methods */}
                <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6 md:col-span-2">
                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-lg border-b pb-2 mb-2">Newsletter</h3>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Headline Text</label>
                        <input type="text" value={data.newsletterText} onChange={(e) => setData({ ...data, newsletterText: e.target.value })} className="w-full p-2 border rounded text-sm" />
                    </div>

                    {/* ✅ Payment Methods Manager */}
                    <div>
                        <h3 className="font-bold text-lg border-b pb-2 mb-2 flex items-center gap-2">
                            <CreditCard className="w-5 h-5" /> Payment Methods
                        </h3>

                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Section Title</label>
                            <input type="text" value={data.paymentMethods?.title || ""} onChange={(e) => updatePaymentTitle(e.target.value)} className="w-full p-2 border rounded text-sm" placeholder="Payment methods" />
                        </div>

                        {/* List of Payment Icons */}
                        <div className="flex flex-wrap gap-3 mb-4">
                            {data.paymentMethods?.items?.map((item: any, idx: number) => (
                                <div key={idx} className="relative group border p-1 rounded bg-gray-50 w-16 h-10 flex items-center justify-center">
                                    {item.imageUrl ? (
                                        <Image src={item.imageUrl} alt={item.name} width={40} height={25} className="object-contain" />
                                    ) : (
                                        <span className="text-[10px] font-bold truncate">{item.name}</span>
                                    )}
                                    <button
                                        onClick={() => removePaymentMethod(idx)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Add New Payment Icon */}
                        <div className="flex gap-2 items-end border-t pt-3 bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                                <label className="text-[10px] uppercase font-bold text-gray-400">Name</label>
                                <input
                                    type="text"
                                    placeholder="Visa"
                                    value={newPayment.name}
                                    onChange={e => setNewPayment({ ...newPayment, name: e.target.value })}
                                    className="w-full p-2 border rounded text-xs"
                                />
                            </div>
                            <div className="flex-2">
                                <label className="text-[10px] uppercase font-bold text-gray-400">Icon URL</label>
                                <input
                                    type="text"
                                    placeholder="https://.../visa.png"
                                    value={newPayment.imageUrl}
                                    onChange={e => setNewPayment({ ...newPayment, imageUrl: e.target.value })}
                                    className="w-full p-2 border rounded text-xs"
                                />
                            </div>
                            <button onClick={addPaymentMethod} className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-bold hover:bg-gray-700 h-[34px]">
                                Add
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}