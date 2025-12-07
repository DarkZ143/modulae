/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, push, set } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { Mail, Send, Users, History, CheckCircle, Calendar } from "lucide-react";

export default function AdminNewsletter() {
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Campaign Form
    const [subject, setSubject] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);

    // Fetch Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Get Subscribers
                const subSnap = await get(ref(rtdb, "newsletter_subscribers"));
                if (subSnap.exists()) {
                    const data = subSnap.val();
                    // Ensure keys are unique
                    const list = Object.keys(data).map(k => ({ id: k, ...data[k] }));
                    list.sort((a: any, b: any) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
                    setSubscribers(list);
                }

                // 2. Get Campaign History
                const histSnap = await get(ref(rtdb, "newsletter_campaigns"));
                if (histSnap.exists()) {
                    const data = histSnap.val();
                    const list = Object.keys(data).map(k => ({ id: k, ...data[k] }));
                    list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setHistory(list);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    // Handle "Send"
    const handleSend = async () => {
        if (!subject || !body) return alert("Please fill in subject and body.");
        if (subscribers.length === 0) return alert("No subscribers to send to.");

        const currentAdmin = auth.currentUser?.email;
        if (!currentAdmin) return alert("You must be logged in to send emails.");

        setSending(true);

        try {
            // 1. Call API
            const response = await fetch('/api/send-newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subject,
                    body,
                    subscribers,
                    adminEmail: currentAdmin
                }),
            });

            const result = await response.json();

            if (result.success) {
                // 2. Save record to history
                const newRef = push(ref(rtdb, "newsletter_campaigns"));
                const campaignData = {
                    subject,
                    body,
                    sentTo: subscribers.length,
                    sentBy: currentAdmin,
                    date: new Date().toISOString()
                };
                await set(newRef, campaignData);

                alert(`✅ Success! Newsletter sent to ${subscribers.length} people.`);
                setSubject("");
                setBody("");

                // Update local history state safely
                setHistory(prev => [{ id: newRef.key || Date.now().toString(), ...campaignData }, ...prev]);
            } else {
                alert(`❌ Failed: ${result.message || "Server Error"}`);
            }

        } catch (error) {
            console.error(error);
            alert("Error communicating with server.");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="p-10 text-center animate-pulse text-gray-500">Loading Newsletter Data...</div>;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Newsletter Manager</h2>
                    <p className="text-sm text-gray-500">Engage with your audience and manage subscriptions.</p>
                </div>
                <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 font-bold shadow-sm">
                    <Users className="w-5 h-5" /> {subscribers.length} Subscribers
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

                {/* --- LEFT COLUMN: COMPOSE --- */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-3">
                            <Mail className="w-5 h-5 text-gray-500" /> Compose Update
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject Line</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none transition"
                                    placeholder="e.g. Mega Sale Starts Tomorrow! 🚀"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Message Body</label>
                                <textarea
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="w-full p-3 border rounded-lg h-48 focus:ring-2 focus:ring-orange-500 outline-none resize-none transition"
                                    placeholder="Write your update here..."
                                />
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <p className="text-xs text-gray-400">
                                    Sender: <span className="font-bold text-gray-700">{auth.currentUser?.email}</span>
                                </p>
                                <button
                                    onClick={handleSend}
                                    disabled={sending || subscribers.length === 0}
                                    className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 transition shadow-md"
                                >
                                    {sending ? "Sending..." : <><Send className="w-4 h-4" /> Send Broadcast</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN: HISTORY --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-xl border shadow-sm h-full max-h-[600px] flex flex-col">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><History className="w-5 h-5 text-gray-500" /> Campaign History</h3>

                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {history.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 text-gray-300">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <p className="text-gray-400 text-sm">No campaigns sent yet.</p>
                                </div>
                            ) : (
                                // ✅ FIX: Added 'idx' fallback key to solve the React Key Warning
                                history.map((camp, idx) => (
                                    <div key={camp.id || idx} className="border border-gray-100 rounded-lg p-4 hover:shadow-sm transition bg-gray-50/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> Sent
                                            </span>
                                            <span className="text-[10px] text-gray-400">{new Date(camp.date).toLocaleDateString()}</span>
                                        </div>
                                        <p className="font-bold text-gray-800 text-sm mb-1">{camp.subject}</p>
                                        <div className="mt-2 pt-2 border-t border-gray-200 flex flex-col gap-1 text-[10px] text-gray-500">
                                            <span>To: {camp.sentTo} subscribers</span>
                                            <span>By: {camp.sentBy}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* SUBSCRIBER LIST SECTION (RESTORED) */}
            <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" /> Subscriber List
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="p-3 rounded-l-lg">Email Address</th>
                                <th className="p-3">Joined Date</th>
                                <th className="p-3 rounded-r-lg text-right">Source</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {/* ✅ FIX: Added 'idx' fallback key here as well */}
                            {subscribers.slice(0, 50).map((sub, idx) => (
                                <tr key={sub.id || idx} className="hover:bg-gray-50 transition">
                                    <td className="p-3 font-medium text-gray-900 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs shrink-0">
                                            {sub.email.charAt(0).toUpperCase()}
                                        </div>
                                        {sub.email}
                                    </td>
                                    <td className="p-3 text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-gray-400" />
                                            {new Date(sub.joinedAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-3 text-right text-gray-400">{sub.source || "Footer"}</td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && (
                                <tr><td colSpan={3} className="p-6 text-center text-gray-400">No subscribers yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {subscribers.length > 50 && (
                    <div className="mt-4 text-center border-t pt-4">
                        <span className="text-xs text-gray-400">Showing recent 50 of {subscribers.length} subscribers</span>
                    </div>
                )}
            </div>
        </div>
    );
}