/* eslint-disable @typescript-eslint/no-unused-vars */
// 1. Warehouse Location: LUCKNOW, INDIA
const WAREHOUSE_LAT = 26.8467;
const WAREHOUSE_LNG = 80.9462;

// 2. Haversine Formula to calculate distance between two coordinates in KM
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    // Use the fixed Warehouse location as the starting point (lat1, lon1) if passed dynamically, 
    // or you can hardcode them inside here if you prefer. 
    // For this helper, we assume inputs are passed, but let's export the constants for use elsewhere.

    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// 3. Delivery Date Logic based on km distance
export const getDeliveryEstimation = (distance: number) => {
    let daysToAdd = 15; // Default for far locations

    if (distance <= 100) daysToAdd = 2;
    else if (distance > 100 && distance <= 300) daysToAdd = 4;
    else if (distance > 300 && distance <= 700) daysToAdd = 6;
    else daysToAdd = 15;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

    // Format: "Tue, 19 Dec"
    const dateString = deliveryDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    return {
        days: daysToAdd,
        dateString: dateString
    };
};