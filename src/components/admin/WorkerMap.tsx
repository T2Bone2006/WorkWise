"use client";

import { useEffect, useState } from "react";
import {MapContainer, TileLayer, Marker, Popup, CircleMarker} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { UK_POSTCODE_AREAS, extractPostcodeArea, getRegionName } from "@/lib/data/uk-postcodes";

import Supercluster from "supercluster";

import { useMapEvents } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";

type ClusterPoint = {
    type: "Feature";
    properties: {
        cluster: boolean;
        workerId?: string;
        trade_type?: string;
    };
    geometry: {
        type: "Point";
        coordinates: [number, number];
    };
};


interface Worker {
    id: string;
    full_name: string;
    trade_type: string;
    postcode: string;
    created_at: string;
}

interface WorkerWithCoords extends Worker {
    lat: number;
    lng: number;
}

interface WorkerMapProps {
    workers: Worker[];
}

// Geocode a UK postcode using postcodes.io
async function geocodePostcode(postcode: string): Promise<{ lat: number; lng: number } | null> {
    try {
        const cleanPostcode = postcode.replace(/\s+/g, "").toUpperCase();
        const response = await fetch(`https://api.postcodes.io/postcodes/${cleanPostcode}`);

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.status === 200 && data.result) {
            return {
                lat: data.result.latitude,
                lng: data.result.longitude,
            };
        }

        return null;
    } catch {
        return null;
    }
}

export const tradeStyles: Record<
    string,
    { color: string; glow: string }
> = {
    electrician: {
        color: "#2563eb", // blue-600
        glow: "rgba(37, 99, 235, 0.4)",
    },

    plumber: {
        color: "#dc2626", // red-600
        glow: "rgba(220, 38, 38, 0.4)",
    },

    gardener: {
        color: "#16a34a", // green-600
        glow: "rgba(22, 163, 74, 0.4)",
    },

    cleaner: {
        color: "#7c3aed", // violet-600
        glow: "rgba(124, 58, 237, 0.4)",
    },

    carpenter: {
        color: "#92400e", // amber-800
        glow: "rgba(146, 64, 14, 0.4)",
    },

    painter: {
        color: "#0ea5e9", // sky-500
        glow: "rgba(14, 165, 233, 0.4)",
    },

    plasterer: {
        color: "#64748b", // slate-500
        glow: "rgba(100, 116, 139, 0.4)",
    },

    roofer: {
        color: "#7c2d12", // orange-900
        glow: "rgba(124, 45, 18, 0.4)",
    },

    tiler: {
        color: "#0f766e", // teal-700
        glow: "rgba(15, 118, 110, 0.4)",
    },

    locksmith: {
        color: "#1e293b", // slate-800
        glow: "rgba(30, 41, 59, 0.4)",
    },

    window_cleaner: {
        color: "#22c55e", // green-500
        glow: "rgba(34, 197, 94, 0.4)",
    },

    handyman: {
        color: "#eab308", // yellow-500
        glow: "rgba(234, 179, 8, 0.4)",
    },

    flooring: {
        color: "#a16207", // amber-700
        glow: "rgba(161, 98, 7, 0.4)",
    },

    fencing: {
        color: "#065f46", // emerald-900
        glow: "rgba(6, 95, 70, 0.4)",
    },

    default: {
        color: "#475569", // slate-600
        glow: "rgba(71, 85, 105, 0.4)",
    },
};


function MapZoomListener({
                             onZoomChange,
                         }: {
    onZoomChange: (zoom: number) => void;
}) {
    useMapEvents({
        zoomend: (e) => {
            const map = e.target as LeafletMap;
            onZoomChange(map.getZoom());
        },
    });

    return null;
}


export default function WorkerMap({ workers }: WorkerMapProps) {
    const [workersWithCoords, setWorkersWithCoords] = useState<WorkerWithCoords[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{ total: number; byRegion: Record<string, number> }>({
        total: 0,
        byRegion: {},
    });
    const [clusters, setClusters] = useState<any[]>([]);
    const [zoom, setZoom] = useState(6);

    useEffect(() => {
        if (!workersWithCoords.length) return;

        const points = workersWithCoords.map((worker) => ({
            type: "Feature",
            properties: {
                cluster: false,
                workerId: worker.id,
                full_name: worker.full_name,
                trade_type: worker.trade_type,
                postcode: worker.postcode,
            },
            geometry: {
                type: "Point",
                coordinates: [worker.lng, worker.lat],
            },
        }));


        const supercluster = new Supercluster({
            radius: 60,
            maxZoom: 14,
        });

        supercluster.load(points);

        const clustered = supercluster.getClusters(
            [-180, -85, 180, 85],
            zoom
        );

        setClusters(clustered);
    }, [workersWithCoords, zoom]);


    useEffect(() => {
        async function geocodeWorkers() {
            setLoading(true);
            const geocoded: WorkerWithCoords[] = [];
            const regionCounts: Record<string, number> = {};

            for (const worker of workers) {

                const regionKey = extractPostcodeArea(worker.postcode);
                regionCounts[regionKey] = (regionCounts[regionKey] || 0) + 1;

                // Geocode the postcode
                const coords = await geocodePostcode(worker.postcode);

                if (coords) {
                    geocoded.push({
                        ...worker,
                        lat: coords.lat,
                        lng: coords.lng,
                    });
                }
            }

            setWorkersWithCoords(geocoded);
            setStats({
                total: workers.length,
                byRegion: regionCounts,
            });
            setLoading(false);
        }

        geocodeWorkers();
    }, [workers]);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)] gap-4 p-4">
            {/* Stats Sidebar */}
            <div className="w-full lg:w-80 flex-shrink-0 order-2 lg:order-1">
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Signup Statistics</h2>



                    {/* Total signups */}
                    <div className="mb-6">
                        <div className="text-sm text-muted-foreground mb-1">Total Signups</div>
                        <div className="text-4xl font-bold text-primary">{stats.total}</div>
                    </div>

                    {/* Geocoded count */}
                    <div className="mb-6">
                        <div className="text-sm text-muted-foreground mb-1">Mapped on Map</div>
                        <div className="text-2xl font-semibold">
                            {loading ? "Loading..." : workersWithCoords.length}
                        </div>
                        {!loading && workersWithCoords.length < stats.total && (
                            <div className="text-xs text-muted-foreground mt-1">
                                ({stats.total - workersWithCoords.length} postcodes could not be geocoded)
                            </div>
                        )}
                    </div>

                    {/* By Region */}
                    <div>
                        <div className="text-sm text-muted-foreground mb-3">By Region</div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {Object.entries(stats.byRegion)
                                .sort((a, b) => b[1] - a[1])
                                .map(([region, count]) => (
                                    <div
                                        key={region}
                                        className="flex items-center justify-between py-2 px-3 bg-accent/50 rounded-lg"
                                    >
                                        <div>
                                            <span className="font-medium">{region}</span>
                                            <span className="text-sm text-muted-foreground ml-2">
                                            ({getRegionName(region)})
                                        </span>
                                        </div>
                                        <span className="font-bold">{count}</span>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map */}
            <div className="flex-1 order-1 lg:order-2 min-h-[400px] lg:min-h-0">
                <div className="bg-card border border-border rounded-xl overflow-hidden h-full shadow-sm">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
                            <div className="text-center">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-sm text-muted-foreground">Geocoding postcodes...</p>
                            </div>
                        </div>
                    )}
                    <MapContainer
                        center={[53.5, -1.5]}
                        zoom={6}
                        attributionControl={false}
                        className="h-full w-full"
                    >
                        <MapZoomListener onZoomChange={setZoom} />


                    <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                        />

                        {clusters.map((cluster) => {
                            const [lng, lat] = cluster.geometry.coordinates;

                            // CLUSTER
                            if (cluster.properties.cluster) {
                                const count = cluster.properties.point_count;

                                const radius =
                                    count < 10 ? 14 :
                                        count < 30 ? 18 :
                                            count < 100 ? 24 : 30;

                                return (
                                    <CircleMarker
                                        key={`cluster-${cluster.id}`}
                                        center={[lat, lng]}
                                        radius={radius}
                                        pathOptions={{
                                            color: "#0f172a",
                                            weight: 1,
                                            fillColor: "#0f172a",
                                            fillOpacity: 0.25,
                                        }}
                                        eventHandlers={{
                                            click: (e) => {
                                                const map = e.target._map;
                                                map.setView([lat, lng], zoom + 2);
                                            },
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: "absolute",
                                                transform: "translate(-50%, -50%)",
                                                color: "#0f172a",
                                                fontWeight: 600,
                                                fontSize: "12px",
                                            }}
                                        >
                                            {count}
                                        </div>

                                    </CircleMarker>
                                );
                            }

                            const props = cluster.properties;

                            const style =
                                tradeStyles[props.trade_type] || tradeStyles.default;

                            return (
                                <CircleMarker
                                    key={props.workerId}
                                    center={[lat, lng]}
                                    radius={7}
                                    pathOptions={{
                                        color: style.color,
                                        weight: 1,
                                        fillColor: style.color,
                                        fillOpacity: 0.45,
                                    }}
                                >
                                    {/* Glow */}
                                    <CircleMarker
                                        center={[lat, lng]}
                                        radius={12}
                                        pathOptions={{
                                            stroke: false,
                                            fillColor: style.glow,
                                            fillOpacity: 0.35,
                                        }}
                                    />

                                    {/* ✅ Popup restored */}
                                    <Popup>
                                        <div className="w-[180px]">
                                            <div className="text-sm font-semibold">{props.full_name}</div>

                                            <div className="mt-1 text-xs text-muted-foreground capitalize">
                                                {props.trade_type.replace(/_/g, " ")}
                                            </div>

                                            <div className="mt-1 text-xs text-muted-foreground">
                                                {props.postcode}
                                            </div>
                                        </div>
                                    </Popup>

                                </CircleMarker>
                            );

                        })}



                    </MapContainer>
                </div>
            </div>
        </div>
    );
}
