/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import LatestProducts from "../components/LatestProduct";

export default function SupportHistory() {
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/auth/login");
                return;
            }

            const queryRef = ref(rtdb, `support_queries/${user.uid}`);
            onValue(queryRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const list = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    // Newest first
                    list.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setQueries(list);
                }
                setLoading(false);
            });
        });
        return () => unsubscribe();
    }, [router]);

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">My Support Queries</h1>

                    {loading ? (
                         <div className="text-center py-10">Loading...</div>
                    ) : queries.length === 0 ? (
                        <div className="bg-white p-8 rounded-xl border text-center">
                            <p className="text-gray-500">You haven&apos;t raised any issues yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {queries.map((q) => (
                                <div key={q.id} className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Clock className="w-4 h-4" />
                                            {new Date(q.date).toLocaleString()}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${q.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {q.status === 'Resolved' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                                            {q.status}
                                        </span>
                                    </div>
                                    <div className="flex gap-3">
                                        <MessageSquare className="w-5 h-5 text-orange-500 shrink-0 mt-1" />
                                        <p className="text-gray-800">{q.query}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <LatestProducts />
            <Footer />
        </>
    );
}