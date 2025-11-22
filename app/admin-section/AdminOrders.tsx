/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Package, Truck, CheckCircle, Clock, ChevronDown, AlertCircle, MapPin } from "lucide-react";

// 1. Define the Order Interface
interface Order {
    id: string;
    userId: string;
    date: string;
    status: string;
    total: number;
    method: string;
    shippingAddress?: {
        name: string;
        street: string;
        city: string;
        zip: string;
        phone: string;
    };
    paymentDetails?: {
        upiId?: string;
    };
    items?: any[];
}

export default function AdminOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        setLoading(true);
        const ordersRef = ref(rtdb, "orders/");
        
        try {
            const snapshot = await get(ordersRef);

            if (snapshot.exists()) {
                const data = snapshot.val() as Record<string, any>;
                
                const flattenedOrders: Order[] = [];

                Object.keys(data).forEach((userId) => {
                    const userOrders = data[userId];
                    
                    if (userOrders) {
                        Object.keys(userOrders).forEach((orderId) => {
                            flattenedOrders.push({ 
                                id: orderId, 
                                userId: userId, 
                                ...userOrders[orderId] 
                            });
                        });
                    }
                });

                // Sort by Date (Newest First)
                flattenedOrders.sort((a, b) => 
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                
                setOrders(flattenedOrders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const updateStatus = async (userId: string, orderId: string, newStatus: string) => {
        try {
            await update(ref(rtdb, `orders/${userId}/${orderId}`), { status: newStatus });
            fetchOrders(); // Refresh UI after update
        } catch (error) {
            alert("Failed to update status");
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case "Processing": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Shipped": return "bg-blue-100 text-blue-700 border-blue-200";
            case "OutForDelivery": return "bg-purple-100 text-purple-700 border-purple-200"; 
            case "Delivered": return "bg-green-100 text-green-700 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Orders ({orders.length})</h2>
                <button 
                    onClick={fetchOrders} 
                    className="text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1"
                >
                    Refresh
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 animate-pulse text-center py-10">Loading orders...</p>
            ) : orders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500">No orders found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                            
                            {/* --- Header: Name, ID, Date, Status --- */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-4 pb-4 border-b border-gray-100 gap-4">
                                <div className="w-full md:w-auto">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-lg text-gray-900">
                                            {order.shippingAddress?.name || "Unknown Customer"}
                                        </h3>
                                        {/* Mobile Date (Hidden on Desktop) */}
                                        <span className="md:hidden text-[10px] text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                                    </div>
                                    
                                    <p className="text-xs text-gray-500 font-mono mt-1 break-all">ID: {order.id}</p>
                                    {/* Desktop Date */}
                                    <p className="hidden md:block text-xs text-gray-400 mt-1">{new Date(order.date).toLocaleString()}</p>
                                </div>
                                
                                <div className="w-full md:w-auto flex flex-col md:flex-row items-start md:items-center gap-3">
                                    {/* Status Badge */}
                                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                                        {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                                        {order.status === 'Shipped' && <Package className="w-3 h-3" />}
                                        {order.status === 'OutForDelivery' && <Truck className="w-3 h-3" />}
                                        {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                                        {order.status === 'Cancelled' && <AlertCircle className="w-3 h-3" />}
                                        {order.status === 'OutForDelivery' ? 'Out For Delivery' : order.status}
                                    </span>
                                    
                                    {/* Status Dropdown (Full width on mobile) */}
                                    <div className="relative w-full md:w-auto">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => updateStatus(order.userId, order.id, e.target.value)}
                                            className="w-full md:w-auto appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 cursor-pointer"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="OutForDelivery">Out For Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-2.5 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* --- Order Items List --- */}
                            <div className="bg-gray-50 rounded-lg p-3 text-sm mb-4 border border-gray-100">
                                {order.items && order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between py-2 border-b border-gray-200 last:border-0">
                                        <div className="flex gap-2 overflow-hidden">
                                            <span className="font-bold text-gray-900 whitespace-nowrap">x{item.qty}</span>
                                            <span className="text-gray-700 truncate">{item.title}</span>
                                        </div>
                                        <span className="font-medium whitespace-nowrap ml-2">₹{item.price}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-3 font-bold text-gray-900 mt-1 border-t border-gray-200">
                                    <span>Total Amount</span>
                                    <span className="text-orange-600 text-lg">₹{order.total}</span>
                                </div>
                            </div>

                            {/* --- Footer: Address & Payment --- */}
                            <div className="text-xs text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white pt-2">
                                {/* Address Block */}
                                <div className="p-3 border rounded-lg bg-white">
                                    <p className="font-bold text-gray-800 mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Shipping Address</p>
                                    <p>{order.shippingAddress?.street}</p>
                                    <p>{order.shippingAddress?.city}, {order.shippingAddress?.zip}</p>
                                    <p className="mt-1 text-gray-400">Phone: <span className="text-gray-700">{order.shippingAddress?.phone}</span></p>
                                </div>

                                {/* Payment Block */}
                                <div className="p-3 border rounded-lg bg-white md:text-right flex flex-col md:items-end justify-center">
                                    <p className="font-bold text-gray-800 mb-1">Payment Method</p>
                                    <span className="uppercase bg-orange-50 text-orange-700 px-2 py-1 rounded text-[10px] font-bold tracking-wider w-fit">
                                        {order.method}
                                    </span>
                                    {order.paymentDetails?.upiId && <p className="mt-1">UPI: {order.paymentDetails.upiId}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}