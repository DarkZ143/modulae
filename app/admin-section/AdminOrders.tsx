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
            case "OutForDelivery": return "bg-purple-100 text-purple-700 border-purple-200"; // ✅ New Status Color
            case "Delivered": return "bg-green-100 text-green-700 border-green-200";
            case "Cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Orders ({orders.length})</h2>
                <button 
                    onClick={fetchOrders} 
                    className="text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1"
                >
                    Refresh Data
                </button>
            </div>

            {loading ? (
                <p className="text-gray-500 animate-pulse">Loading orders...</p>
            ) : orders.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
                    <p className="text-gray-500">No orders found.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
                            
                            {/* Header: Name & Status */}
                            <div className="flex flex-col md:flex-row justify-between items-start mb-4 pb-4 border-b">
                                <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                        {order.shippingAddress?.name || "Unknown Customer"}
                                    </h3>
                                    <p className="text-xs text-gray-500">ID: {order.id} • {new Date(order.date).toLocaleString()}</p>
                                </div>
                                
                                <div className="mt-3 md:mt-0 flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                                        {order.status === 'Processing' && <Clock className="w-3 h-3" />}
                                        {order.status === 'Shipped' && <Package className="w-3 h-3" />}
                                        {order.status === 'OutForDelivery' && <Truck className="w-3 h-3" />} {/* ✅ Icon for Out For Delivery */}
                                        {order.status === 'Delivered' && <CheckCircle className="w-3 h-3" />}
                                        {order.status === 'Cancelled' && <AlertCircle className="w-3 h-3" />}
                                        {order.status === 'OutForDelivery' ? 'Out For Delivery' : order.status}
                                    </span>
                                    
                                    {/* Status Dropdown */}
                                    <div className="relative">
                                        <select 
                                            value={order.status} 
                                            onChange={(e) => updateStatus(order.userId, order.id, e.target.value)}
                                            className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-1 pl-3 pr-8 rounded text-xs font-medium focus:outline-none focus:border-orange-500 cursor-pointer"
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="OutForDelivery">Out For Delivery</option> {/* ✅ Added Option */}
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                        <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1.5 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            {/* Order Items List */}
                            <div className="bg-gray-50 rounded-lg p-3 text-sm mb-3">
                                {order.items && order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                                        <span className="text-gray-700">
                                            <span className="font-bold text-gray-900">x{item.qty}</span> {item.title}
                                        </span>
                                        <span className="font-medium">₹{item.price}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between pt-2 font-bold text-gray-900 mt-1 border-t border-gray-200">
                                    <span>Total Amount</span>
                                    <span className="text-orange-600">₹{order.total}</span>
                                </div>
                            </div>

                            {/* Footer: Address & Payment */}
                            <div className="text-xs text-gray-500 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold text-gray-700 mb-1">Shipping Address</p>
                                    <p>{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
                                    <p>{order.shippingAddress?.zip}</p>
                                    <p>Phone: <span className="text-gray-900">{order.shippingAddress?.phone}</span></p>
                                </div>
                                <div className="sm:text-right">
                                    <p className="font-semibold text-gray-700 mb-1">Payment Details</p>
                                    <p className="uppercase font-bold text-gray-800">{order.method}</p>
                                    {order.paymentDetails?.upiId && <p>UPI: {order.paymentDetails.upiId}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}