/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import {
    MessageSquare,
    Trash2,
    CheckCircle,
    Clock,
    Reply,
    Save,
    Edit
} from "lucide-react";

export default function AdminSupport() {
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // reply state (single active reply)
    const [replyingTo, setReplyingTo] = useState<{
        userId: string;
        queryId: string;
        text: string;
    } | null>(null);

    useEffect(() => {
        const queryRef = ref(rtdb, "support_queries");

        const unsubscribe = onValue(queryRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const flatList: any[] = [];

                Object.keys(data).forEach((userId) => {
                    const userQueries = data[userId];
                    if (!userQueries) return;

                    Object.keys(userQueries).forEach((queryId) => {
                        const q = userQueries[queryId];
                        flatList.push({
                            id: queryId,
                            userId,
                            userName: q.userName || "Guest User",
                            userEmail: q.userEmail || "No Email",
                            query: q.query || "No message",
                            date: q.date || new Date().toISOString(),
                            status: q.status || "Pending",
                            adminReply: q.adminReply || ""
                        });
                    });
                });

                flatList.sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );

                setQueries(flatList);
            } else {
                setQueries([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    /* ================= RESOLVE ================= */
    const handleResolve = async (userId: string, queryId: string) => {
        await update(ref(rtdb, `support_queries/${userId}/${queryId}`), {
            status: "Resolved"
        });
    };

    /* ================= DELETE ================= */
    const handleDelete = async (userId: string, queryId: string) => {
        if (!confirm("Delete this query?")) return;
        await remove(ref(rtdb, `support_queries/${userId}/${queryId}`));
    };

    /* ================= SAVE REPLY ================= */
    const handleSaveReply = async () => {
        if (!replyingTo || !replyingTo.text.trim()) return;

        const { userId, queryId, text } = replyingTo;

        await update(ref(rtdb, `support_queries/${userId}/${queryId}`), {
            adminReply: text,
            repliedAt: new Date().toISOString()
        });

        setReplyingTo(null);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Support Queries
            </h2>

            {loading ? (
                <p className="text-gray-500 animate-pulse">
                    Loading support tickets...
                </p>
            ) : queries.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border">
                    <MessageSquare className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No support queries yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {queries.map((q) => (
                        <div
                            key={q.id}
                            className={`p-5 rounded-xl border shadow-sm
                ${q.status === "Resolved"
                                    ? "bg-gray-50 opacity-80"
                                    : "bg-white border-orange-100"}
              `}
                        >
                            {/* HEADER */}
                            <div className="flex justify-between mb-3">
                                <div>
                                    <h4 className="font-bold text-lg">{q.userName}</h4>
                                    <p className="text-xs text-gray-500">{q.userEmail}</p>
                                </div>
                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1
                    ${q.status === "Resolved"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"}
                  `}
                                >
                                    {q.status === "Resolved" ? (
                                        <CheckCircle className="w-3 h-3" />
                                    ) : (
                                        <Clock className="w-3 h-3" />
                                    )}
                                    {q.status}
                                </span>
                            </div>

                            {/* USER QUERY */}
                            <div className="bg-gray-50 p-4 rounded-lg text-sm mb-3 border">
                                {q.query}
                            </div>

                            {/* ADMIN REPLY DISPLAY */}
                            {q.adminReply && (
                                <div className="border-l-2 border-orange-500 pl-4 mb-3">
                                    <p className="text-xs font-bold text-orange-600 mb-1">
                                        Admin Reply
                                    </p>
                                    <p className="text-sm text-gray-700">{q.adminReply}</p>
                                </div>
                            )}

                            {/* REPLY BOX */}
                            {replyingTo?.queryId === q.id && (
                                <div className="bg-orange-50 p-4 rounded-lg mb-3">
                                    <textarea
                                        rows={3}
                                        className="w-full border rounded p-2 text-sm"
                                        placeholder="Write your reply..."
                                        value={replyingTo?.text || ""}
                                        onChange={(e) =>
                                            setReplyingTo({
                                                userId: q.userId,
                                                queryId: q.id,
                                                text: e.target.value
                                            })
                                        }
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <button
                                            onClick={() => setReplyingTo(null)}
                                            className="text-xs px-3 py-1 bg-gray-200 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveReply}
                                            className="text-xs px-3 py-1 bg-orange-600 text-white rounded flex items-center gap-1"
                                        >
                                            <Save className="w-3 h-3" /> Save Reply
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* FOOTER ACTIONS */}
                            <div className="flex justify-between items-center text-xs text-gray-400 border-t pt-3">
                                <span>
                                    Submitted on {new Date(q.date).toLocaleString()}
                                </span>

                                <div className="flex gap-3 items-center">
                                    <button
                                        onClick={() =>
                                            setReplyingTo({
                                                userId: q.userId,
                                                queryId: q.id,
                                                text: q.adminReply || ""
                                            })
                                        }
                                        className="text-blue-600 font-bold flex items-center gap-1"
                                    >
                                        {q.adminReply ? (
                                            <>
                                                <Edit className="w-3 h-3" /> Edit Reply
                                            </>
                                        ) : (
                                            <>
                                                <Reply className="w-3 h-3" /> Reply
                                            </>
                                        )}
                                    </button>

                                    {q.status !== "Resolved" && (
                                        <button
                                            onClick={() => handleResolve(q.userId, q.id)}
                                            className="text-green-600 font-bold flex items-center gap-1"
                                        >
                                            <CheckCircle className="w-4 h-4" /> Resolve
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(q.userId, q.id)}
                                        className="text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
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
