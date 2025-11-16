/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import LoaderCircle from "./LoaderCircle";
import Image from "next/image";

export default function ContactUs() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        title: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const time = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
        });

        try {
            /* -----------------------------------------
               1️⃣ SEND EMAIL TO YOU (ADMIN)
               Template: template_ujwls0v
               REQUIRED FIELDS:
               title, name, time, message, email, from_email
            ----------------------------------------- */
            await emailjs.send(
                "service_7qy599b",
                "template_ujwls0v",
                {
                    title: form.title,
                    name: form.name,
                    time: time,
                    message: form.message,
                    email: form.email,
                    from_email: "themodulae@gmail.com", // 👈 REQUIRED FIX
                },
                "ENvKXYD6HDVg0sHxn"
            );

            /* -----------------------------------------
               2️⃣ AUTO-REPLY TO USER
               Template: template_kbuw84k
               REQUIRED FIELDS:
               name, title, email
            ----------------------------------------- */
            await emailjs.send(
                "service_7qy599b",
                "template_kbuw84k",
                {
                    name: form.name,
                    title: form.title,
                    email: form.email,
                },
                "ENvKXYD6HDVg0sHxn"
            );

            setSuccess(true);
            setForm({ name: "", email: "", title: "", message: "" });

        } catch (err) {
            console.error("EmailJS error:", err);
            alert("Something went wrong. Please check EmailJS configuration.");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* LEFT IMAGE */}
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full h-[420px] rounded-xl overflow-hidden shadow-sm shadow-amber-300"
            >
                <Image
                    src="/office.png"
                    width={600}
                    height={420}
                    alt="Our Office"
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* RIGHT PANEL */}
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
            >
                <h2 className="text-3xl font-bold text-gray-900">Contact Us</h2>

                {/* ADDRESS + MAP */}
                <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200">
                    <h3 className="text-lg font-semibold mb-1">Our Office</h3>
                    <p className="text-gray-700 mb-3">
                        Dubagga, Lucknow <br />
                        Uttar Pradesh, India
                    </p>

                    <iframe
                        src="https://www.google.com/maps?q=Dubagga+Lucknow&output=embed"
                        className="w-full h-48 rounded-lg border"
                        loading="lazy"
                    ></iframe>
                </div>

                {/* CONTACT FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white shadow-md rounded-lg p-6 space-y-4 border-2 border-orange-200"
                >
                    <div>
                        <label className="text-sm font-medium">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={form.name}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={form.email}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Subject / Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            value={form.title}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Message</label>
                        <textarea
                            name="message"
                            required
                            rows={4}
                            value={form.message}
                            onChange={handleChange}
                            className="w-full mt-1 px-3 py-2 border rounded-md outline-none"
                        ></textarea>
                    </div>

                    {/* BUTTON WITH LOADER */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg"
                    >
                        {loading ? (
                            <div className="flex justify-center">
                                <LoaderCircle size={28} />
                            </div>
                        ) : (
                            "Send Message"
                        )}
                    </button>

                    {success && (
                        <p className="text-green-600 text-center font-medium">
                            ✔ Message sent successfully! We will contact you soon.
                        </p>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
