"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Users,
    Phone,
    MapPin,
    Award,
    PoundSterling,
    Clock,
    Car,
} from "lucide-react";

interface Worker {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    trade_type: string;
    day_rate: number | null;
    hourly_rate: number | null;
    base_postcode: string | null;
    service_radius_miles: number | null;
    travel_fee_per_mile: number | null;
    certifications: any;
    status: string;
}

interface WorkersListProps {
    initialWorkers: Worker[];
}

export function WorkersList({ initialWorkers }: WorkersListProps) {
    const [workers] = useState<Worker[]>(initialWorkers);
    const [filterTrade, setFilterTrade] = useState<string>("all");

    const filteredWorkers =
        filterTrade === "all"
            ? workers
            : workers.filter((w) => w.trade_type === filterTrade);

    const tradeTypes = Array.from(new Set(workers.map((w) => w.trade_type)));

    const formatTradeName = (trade: string) => {
        return trade.charAt(0).toUpperCase() + trade.slice(1);
    };

    const getTradeColor = (trade: string) => {
        const colors: Record<string, string> = {
            electrician: "bg-yellow-500 text-white",
            plumber: "bg-blue-500 text-white",
            carpenter: "bg-orange-500 text-white",
            painter: "bg-purple-500 text-white",
            builder: "bg-red-500 text-white",
        };
        return colors[trade] || "bg-secondary text-secondary-foreground";
    };

    const getCertificationCount = (certifications: any) => {
        if (!certifications) return 0;
        return Object.keys(certifications).length;
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <PageHeader
                title="Workers"
                description="View and manage your network of tradespeople"
            />

            {/* Filters */}
            {workers.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={filterTrade === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterTrade("all")}
                    >
                        All Workers ({workers.length})
                    </Button>
                    {tradeTypes.map((trade) => (
                        <Button
                            key={trade}
                            variant={filterTrade === trade ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilterTrade(trade)}
                        >
                            {formatTradeName(trade)} (
                            {workers.filter((w) => w.trade_type === trade).length})
                        </Button>
                    ))}
                </div>
            )}

            {/* Workers list or empty state */}
            {filteredWorkers.length === 0 ? (
                <EmptyState
                    icon={Users}
                    title="No workers found"
                    description={
                        filterTrade === "all"
                            ? "Add workers to your network to start matching jobs"
                            : `No ${filterTrade}s available`
                    }
                    action={
                        filterTrade !== "all"
                            ? {
                                label: "Clear filter",
                                onClick: () => setFilterTrade("all"),
                            }
                            : undefined
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {filteredWorkers.map((worker) => (
                        <Card key={worker.id} className="p-6 hover:shadow-md transition-shadow">
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold">{worker.full_name}</h3>
                                        <Badge className={getTradeColor(worker.trade_type)}>
                                            {formatTradeName(worker.trade_type)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Award className="h-4 w-4" />
                                        <span>{getCertificationCount(worker.certifications)}</span>
                                    </div>
                                </div>

                                {/* Contact */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Phone className="h-4 w-4" />
                                        <span>{worker.phone || "No phone"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        <span>
                      {worker.base_postcode || "No location"} (
                                            {worker.service_radius_miles || 0} mile radius)
                    </span>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            <span>Hourly Rate</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            £{worker.hourly_rate?.toFixed(2) || "0.00"}/hr
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <PoundSterling className="h-3 w-3" />
                                            <span>Day Rate</span>
                                        </div>
                                        <p className="text-lg font-semibold">
                                            £{worker.day_rate?.toFixed(2) || "0.00"}/day
                                        </p>
                                    </div>
                                </div>

                                {/* Travel */}
                                {worker.travel_fee_per_mile && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                                        <Car className="h-4 w-4" />
                                        <span>
                      £{worker.travel_fee_per_mile.toFixed(2)}/mile travel fee
                    </span>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1">
                                        View Profile
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}