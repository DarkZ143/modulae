/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { calculateDistance, getDeliveryEstimation } from "@/lib/deliveryLogic";

// Warehouse: Lucknow
const WAREHOUSE = { lat: 26.8467, lng: 80.9462 };

interface LocationData {
    pincode: string;
    locationName: string;
    deliveryDays: number;
    deliveryDateString: string;
    isSet: boolean;
}

interface LocationContextType {
    location: LocationData;
    updatePincode: (code: string) => void;
    updateLiveLocation: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
    const [location, setLocation] = useState<LocationData>({
        pincode: "",
        locationName: "Select your address",
        deliveryDays: 15, // Default max days
        deliveryDateString: "",
        isSet: false,
    });

    // 1. Update via Pincode (Mock Logic)
    const updatePincode = (code: string) => {
        if (code.length !== 6) return;

        // Mock distance based on pincode hash (For demo purposes)
        // In production, you'd use a Pincode API here
        const mockDistance = (parseInt(code) % 800);
        const est = getDeliveryEstimation(mockDistance);

        setLocation({
            pincode: code,
            locationName: `Pincode ${code}`,
            deliveryDays: est.days,
            deliveryDateString: est.dateString,
            isSet: true,
        });
    };

    // 2. Update via Live Location (Real Logic)
    const updateLiveLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const dist = calculateDistance(
                        WAREHOUSE.lat,
                        WAREHOUSE.lng,
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    const est = getDeliveryEstimation(dist);

                    setLocation({
                        pincode: "GPS",
                        locationName: "Current Location",
                        deliveryDays: est.days,
                        deliveryDateString: est.dateString,
                        isSet: true,
                    });
                },
                (error) => {
                    console.error(error);
                    alert("Location access denied. Please enter Pincode manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    // Initialize default date (15 days out)
    useEffect(() => {
        const defaultEst = getDeliveryEstimation(1000); // >700km logic
        setLocation((prev) => ({ ...prev, deliveryDateString: defaultEst.dateString }));
    }, []);

    return (
        <LocationContext.Provider value={{ location, updatePincode, updateLiveLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) throw new Error("useLocation must be used within a LocationProvider");
    return context;
};