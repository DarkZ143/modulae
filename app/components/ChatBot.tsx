/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation"; 
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, push, set, get } from "firebase/database";
import { MessageCircle, X, Send, Bot, RotateCcw } from "lucide-react";

type Message = {
    id: number;
    text: string;
    sender: "bot" | "user";
    options?: { label: string; value: string }[];
};

const CATEGORIES = [
    "Chairs", "Dining", "Furniture", "Kitchen", 
    "Lamps", "Shoe Racks", "Sofa Sets", "TV Units", "Wardrobes"
];

const DELIVERY_QUERIES = [
    "Where is my order?",
    "How long does delivery take?",
    "Do you deliver on weekends?",
    "Other (Type your query)"
];

export default function ChatBot() {
    const router = useRouter();
    const pathname = usePathname(); 
    
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [chatState, setChatState] = useState<"init" | "name_input" | "menu" | "custom_query">("init");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. Check Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            // Only start if chat is open and empty
            if (isOpen && messages.length === 0) {
                startConversation(currentUser);
            }
        });
        return () => unsubscribe();
    }, [isOpen]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 🔒 HIDE CHATBOT ON ADMIN PAGES
    if (pathname?.startsWith("/admin-section")) {
        return null;
    }

    // --- RESET CHAT FUNCTION ---
    const handleReset = () => {
        setMessages([]);
        setChatState("init"); // Reset state before restarting
        // Small timeout to allow state to clear before restarting
        setTimeout(() => {
            startConversation(user);
        }, 100);
    };

    const startConversation = (currentUser: any) => {
        if (currentUser) {
            setMessages([
                { 
                    id: 1, 
                    text: `Hi ${currentUser.displayName || "there"}! 👋 Welcome to Modulae. How can I help you today?`, 
                    sender: "bot",
                    options: [
                        { label: "📦 Order Products", value: "order" },
                        { label: "🚚 Delivery Related", value: "delivery" },
                        { label: "⭐ Review Product", value: "review" },
                        { label: "🎫 Track Raised Issue", value: "track_issue" }
                    ]
                }
            ]);
            setChatState("menu");
        } else {
            setMessages([
                { id: 1, text: "Hello! 👋 I am the Modulae Assistant. May I know your name?", sender: "bot" }
            ]);
            setChatState("name_input");
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, sender: "user" as const };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Logic based on state
        if (chatState === "name_input") {
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: `Nice to meet you, ${input}. I'm redirecting you to the login page to serve you better...`, sender: "bot" }
                ]);
                setTimeout(() => router.push("/auth/login"), 2000);
            }, 500);
        } 
        
        else if (chatState === "custom_query") {
            // Save to Firebase for Admin
            if (user) {
                const queryRef = push(ref(rtdb, `support_queries/${user.uid}`));
                await set(queryRef, {
                    userEmail: user.email,
                    userName: user.displayName || "User",
                    query: input,
                    date: new Date().toISOString(),
                    status: "Pending"
                });
            }
            
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    { 
                        id: Date.now() + 1, 
                        text: "I have noted your query and sent it to our support team. You can track its status in the 'Track Raised Issue' menu. Anything else?", 
                        sender: "bot",
                        options: [
                            { label: "« Back to Menu", value: "reset" }
                        ]
                    }
                ]);
            }, 800);
        }
    };

    const handleOptionClick = async (value: string, label: string) => {
        setMessages((prev) => [...prev, { id: Date.now(), text: label, sender: "user" }]);

        // 1. RESET
        if (value === "reset") {
            setTimeout(() => handleReset(), 500);
            return;
        }

        // 2. TRACK ISSUE LOGIC (Restored)
        if (value === "track_issue") {
            if (!user) {
                setTimeout(() => {
                    setMessages((prev) => [...prev, { id: Date.now() + 1, text: "Please login first to track issues.", sender: "bot" }]);
                }, 500);
                return;
            }
            
            // Check Firebase for existing issues
            const snapshot = await get(ref(rtdb, `support_queries/${user.uid}`));
            
            if (snapshot.exists()) {
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        { id: Date.now() + 1, text: "Found your active queries. Redirecting you to the status page...", sender: "bot" }
                    ]);
                    setTimeout(() => {
                        setIsOpen(false);
                        router.push("/support-history");
                    }, 1500);
                }, 500);
            } else {
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        { 
                            id: Date.now() + 1, 
                            text: "I couldn't find any raised issues linked to this account.", 
                            sender: "bot",
                            options: [{ label: "« Back to Menu", value: "reset" }]
                        }
                    ]);
                }, 500);
            }
            return;
        }

        // 3. OTHER MENUS
        setTimeout(() => {
            // Order Products
            if (value === "order") {
                const catOptions = CATEGORIES.map(cat => ({ 
                    label: cat, 
                    value: `cat_${cat.toLowerCase().replace(" ", "-")}` 
                }));
                
                setMessages((prev) => [
                    ...prev,
                    { 
                        id: Date.now() + 1, 
                        text: "Which product category are you interested in?", 
                        sender: "bot",
                        options: catOptions
                    }
                ]);
            }
            
            // Redirect to specific category
            else if (value.startsWith("cat_")) {
                const slug = value.replace("cat_", "");
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: "Great choice! Wait while I'm getting you to the page...", sender: "bot" }
                ]);
                setTimeout(() => {
                    setIsOpen(false); 
                    router.push(`/collections/${slug}?page=1`);
                }, 1500);
            }

            // Delivery Flow
            else if (value === "delivery") {
                setMessages((prev) => [
                    ...prev,
                    { 
                        id: Date.now() + 1, 
                        text: "Here are some common delivery questions:", 
                        sender: "bot",
                        options: DELIVERY_QUERIES.map(q => ({ 
                            label: q, 
                            value: q.includes("Other") ? "other_query" : "faq_answer" 
                        }))
                    }
                ]);
            }
            else if (value === "faq_answer") {
                setMessages((prev) => [
                    ...prev,
                    { 
                        id: Date.now() + 1, 
                        text: "We usually deliver within 5-7 business days. You can track your order in 'My Orders'.", 
                        sender: "bot",
                        options: [{ label: "« Back to Menu", value: "reset" }]
                    }
                ]);
            }
            else if (value === "other_query") {
                setChatState("custom_query");
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: "Please type your query below. Our team will review it.", sender: "bot" }
                ]);
            }

            // Review Flow
            else if (value === "review") {
                setMessages((prev) => [
                    ...prev,
                    { id: Date.now() + 1, text: "Redirecting you to your orders page to leave a review...", sender: "bot" }
                ]);
                setTimeout(() => {
                    setIsOpen(false);
                    router.push("/my-orders");
                }, 1500);
            }

        }, 500);
    };

    return (
        <>
            {/* Floating Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 bg-orange-600 text-white p-4 rounded-full shadow-2xl hover:bg-orange-700 transition-all z-50 hover:scale-110"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-slide-up overflow-hidden font-sans">
                    
                    {/* Header */}
                    <div className="bg-orange-600 text-white p-4 flex items-center justify-between shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-full">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-none">Assistant</h3>
                                <p className="text-xs text-orange-100 flex items-center gap-1 mt-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                                </p>
                            </div>
                        </div>

                        {/* ✅ RESET BUTTON */}
                        <button 
                            onClick={handleReset}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
                            title="Reset Chat"
                        >
                            <RotateCcw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
                                <div 
                                    className={`max-w-[80%] p-3 rounded-xl text-sm shadow-sm ${
                                        msg.sender === "user" 
                                        ? "bg-orange-600 text-white rounded-tr-none" 
                                        : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                                
                                {/* Options Chips */}
                                {msg.options && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {msg.options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleOptionClick(opt.value, opt.label)}
                                                className="text-xs bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-full hover:bg-orange-100 transition font-medium"
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 border-t bg-white flex gap-2">
                        <input 
                            type="text" 
                            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            disabled={chatState === "menu"} 
                        />
                        <button 
                            onClick={handleSend}
                            className={`p-2 rounded-full text-white transition ${input.trim() ? 'bg-orange-600 hover:bg-orange-700' : 'bg-gray-300 cursor-not-allowed'}`}
                            disabled={!input.trim()}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}