"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AlertCircle, Loader2 } from "lucide-react";

interface JobLocationMapProps {
    postcode?: string | null;
    address?: string;
    className?: string;
}

// Normalize postcode format
function normalizePostcode(postcode: string): string {
    // Remove all spaces and convert to uppercase
    const cleaned = postcode.toUpperCase().replace(/\s+/g, "");

    // Insert space before last 3 characters for standard format (e.g., M1 1AA, SW1A 1AA)
    if (cleaned.length >= 5) {
        return cleaned.slice(0, -3) + " " + cleaned.slice(-3);
    }

    return cleaned;
}

// Geocode a UK postcode using postcodes.io
async function geocodePostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
    try {
        // Normalize the postcode
        const normalized = normalizePostcode(postcode);

        // Try with space first (standard format)
        const response = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`);

        if (response.ok) {
            const data = await response.json();
            if (data.status === 200 && data.result) {
                return {
                    lat: data.result.latitude,
                    lng: data.result.longitude,
                };
            }
        }

        // Try without space as fallback
        const noSpacePostcode = postcode.replace(/\s+/g, "").toUpperCase();
        const fallbackResponse = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(noSpacePostcode)}`);

        if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            if (fallbackData.status === 200 && fallbackData.result) {
                return {
                    lat: fallbackData.result.latitude,
                    lng: fallbackData.result.longitude,
                };
            }
        }

        console.error(`Postcode not found: ${postcode}`);
        return null;
    } catch (error) {
        console.error(`Geocoding error for postcode:`, error);
        return null;
    }
}

export function JobLocationMap({ postcode, address, className = "" }: JobLocationMapProps) {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCoords() {
            setLoading(true);
            setError(null);

            // Use postcode prop if provided, otherwise show error
            const postcodeToUse = postcode?.trim();

            if (!postcodeToUse) {
                setError("No postcode available for this job");
                setLoading(false);
                return;
            }

            const geocoded = await geocodePostcode(postcodeToUse);

            if (!geocoded) {
                setError(`Could not locate postcode: ${postcodeToUse}`);
                setLoading(false);
                return;
            }

            setCoords(geocoded);
            setLoading(false);
        }

        fetchCoords();
    }, [postcode]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
                <div className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
            </div>
        );
    }

    if (error || !coords) {
        return (
            <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`}>
                <div className="text-center py-12">
                    <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{error || "Map unavailable"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`overflow-hidden rounded-lg border border-border ${className}`}>
            <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={15}
                attributionControl={false}
                className="h-full w-full"
                scrollWheelZoom={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                />

                {/* 500m radius circle */}
                <Circle
                    center={[coords.lat, coords.lng]}
                    radius={500}
                    pathOptions={{
                        color: "#2563eb",
                        weight: 2,
                        fillColor: "#2563eb",
                        fillOpacity: 0.1,
                    }}
                />

                {/* Job location marker with glow */}
                <CircleMarker
                    center={[coords.lat, coords.lng]}
                    radius={12}
                    pathOptions={{
                        color: "#2563eb",
                        weight: 0,
                        fillColor: "rgba(37, 99, 235, 0.3)",
                        fillOpacity: 1,
                    }}
                />
                <CircleMarker
                    center={[coords.lat, coords.lng]}
                    radius={8}
                    pathOptions={{
                        color: "#ffffff",
                        weight: 2,
                        fillColor: "#2563eb",
                        fillOpacity: 1,
                    }}
                />
            </MapContainer>
        </div>
    );
}
