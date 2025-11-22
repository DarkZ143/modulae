/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { MessageSquare, Trash2, CheckCircle, Clock } from "lucide-react";

export default function AdminSupport() {
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const queryRef = ref(rtdb, "support_queries");
        const unsubscribe = onValue(queryRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const flatList: any[] = [];

                // DEBUG: Check what data looks like in console
                console.log("Raw Firebase Data:", data);

                // Flatten nested structure (Users -> Queries)
                Object.keys(data).forEach((userId) => {
                    const userQueries = data[userId];
                    if (userQueries) {
                        Object.keys(userQueries).forEach((queryId) => {
                            const q = userQueries[queryId];
                            flatList.push({
                                id: queryId,
                                userId: userId, // Keep reference for update/delete
                                userName: q.userName || "Guest User",
                                userEmail: q.userEmail || "No Email",
                                query: q.query || "No message content found.", // Fallback text
                                date: q.date || new Date().toISOString(),
                                status: q.status || "Pending"
                            });
                        });
                    }
                });

                // Sort newest first
                flatList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setQueries(flatList);
            } else {
                setQueries([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleResolve = async (userId: string, queryId: string) => {
        await update(ref(rtdb, `support_queries/${userId}/${queryId}`), { status: "Resolved" });
    };

    const handleDelete = async (userId: string, queryId: string) => {
        if (confirm("Delete this query?")) {
            await remove(ref(rtdb, `support_queries/${userId}/${queryId}`));
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Support Queries</h2>

            {loading ? (
                <p className="text-gray-500 animate-pulse">Loading support tickets...</p>
            ) : queries.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                    <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">No support queries yet.</p>
                    <p className="text-xs text-gray-400 mt-1">Great job! All caught up.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {queries.map((q) => (
                        <div 
                            key={q.id} 
                            className={`p-5 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md 
                                ${q.status === 'Resolved' ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-orange-100'}
                            `}
                        >
                            {/* Header: User Info & Status */}
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg">{q.userName}</h4>
                                    <p className="text-xs text-gray-500 font-mono">{q.userEmail}</p>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm 
                                    ${q.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                `}>
                                    {q.status === 'Resolved' ? <CheckCircle className="w-3 h-3"/> : <Clock className="w-3 h-3"/>}
                                    {q.status}
                                </span>
                            </div>
                            
                            {/* Query Content */}
                            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-800 mb-4 flex gap-3 border border-gray-100">
                                <MessageSquare className="w-5 h-5 mt-0.5 text-orange-500 shrink-0" />
                                <p className="leading-relaxed">{q.query}</p>
                            </div>
                            
                            {/* Footer: Date & Actions */}
                            <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3 mt-2">
                                <span>Submitted on {new Date(q.date).toLocaleString()}</span>
                                
                                <div className="flex gap-3">
                                    {q.status !== "Resolved" && (
                                        <button 
                                            onClick={() => handleResolve(q.userId, q.id)} 
                                            className="text-green-600 font-bold hover:underline flex items-center gap-1"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Mark Resolved
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(q.userId, q.id)} 
                                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition"
                                        title="Delete Query"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}