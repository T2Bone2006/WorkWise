"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    ArrowLeft,
    Award,
    Clock,
    DollarSign,
    MapPin,
    Star,
    CheckCircle,
    Loader2,
    UserCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { assignWorkerToJob } from "@/lib/supabase/match-actions";

interface Match {
    id: string;
    match_score: number;
    reasoning: string;
    estimated_hours: number | null;
    estimated_days: number | null;
    pricing_method: string;
    base_cost: number;
    travel_cost: number;
    total_cost: number;
    cost_breakdown: any;
    status: string;
    worker: {
        id: string;
        full_name: string;
        email: string;
        phone: string;
        trade_type: string;
        hourly_rate: number;
        day_rate: number;
        certifications: any;
    };
}

interface Job {
    id: string;
    title: string;
    description: string;
    property_address: string;
    urgency: string;
    status: string;
    assigned_worker_id: string | null;
}

interface MatchesViewProps {
    job: Job;
    matches: Match[];
}

export function MatchesView({ job, matches }: MatchesViewProps) {
    const router = useRouter();
    const [assigningWorkerId, setAssigningWorkerId] = useState<string | null>(null);

    const handleSelectWorker = async (match: Match) => {
        setAssigningWorkerId(match.worker.id);

        try {
            const result = await assignWorkerToJob(job.id, match.worker.id, match.id);

            if (result.error) {
                toast.error("Failed to assign worker", {
                    description: result.error,
                });
                return;
            }

            toast.success("Worker assigned successfully!", {
                description: `${match.worker.full_name} has been notified and will respond shortly.`,
            });

            router.push("/jobs");
        } catch (error) {
            toast.error("Something went wrong", {
                description: "Please try again later.",
            });
        } finally {
            setAssigningWorkerId(null);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const formatTrade = (trade: string) => {
        return trade.charAt(0).toUpperCase() + trade.slice(1);
    };

    const getCertificationCount = (certs: any) => {
        if (!certs) return 0;
        return Object.keys(certs).length;
    };

    return (
        <div className="space-y-6">
            {/* Back button */}
            <Button
                variant="ghost"
                onClick={() => router.push("/jobs")}
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
            </Button>

            {/* Job info */}
            <div>
                <PageHeader
                    title={`Workers for: ${job.title}`}
                    description={job.description}
                />
                <p className="text-sm text-muted-foreground mt-2">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    {job.property_address}
                </p>
            </div>

            {/* Assigned banner */}
            {job.assigned_worker_id && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                            <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                                Worker Already Assigned
                            </p>
                            <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                This job has been assigned to a worker. You can still view all quotes below.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Matches */}
            {matches.length === 0 ? (
                <Card className="p-12 text-center">
                    <p className="text-muted-foreground">
                        No workers found yet. Please wait a moment and refresh.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {matches.map((match) => {
                        const isAssigned = job.assigned_worker_id === match.worker.id;
                        const jobHasAssignment = job.assigned_worker_id !== null;

                        return (
                        <Card
                            key={match.id}
                            className={`p-6 hover:shadow-lg transition-shadow flex flex-col relative ${
                                isAssigned
                                    ? 'ring-2 ring-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                                    : jobHasAssignment
                                        ? 'opacity-60'
                                        : ''
                            }`}
                        >
                            {/* Selected badge */}
                            {isAssigned && (
                                <div className="absolute -top-2 -right-2">
                                    <Badge className="bg-emerald-500 text-white shadow-lg">
                                        <UserCheck className="h-3 w-3 mr-1" />
                                        Selected
                                    </Badge>
                                </div>
                            )}

                            {/* Content wrapper with flex-1 to push button down */}
                            <div className="flex-1 space-y-6">
                                {/* Worker header */}
                                <div className="flex items-start gap-4">
                                    <Avatar className={`h-16 w-16 flex-shrink-0 ${isAssigned ? 'ring-2 ring-emerald-500' : ''}`}>
                                        <AvatarFallback className={`text-xl ${
                                            isAssigned
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-primary text-primary-foreground'
                                        }`}>
                                            {getInitials(match.worker.full_name)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold truncate">{match.worker.full_name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {formatTrade(match.worker.trade_type)}
                                        </p>

                                        {/* Match score */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500"/>
                                                <span className="font-semibold">{match.match_score}%</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">match</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Certifications</p>
                                        <div className="flex items-center gap-1">
                                            <Award className="h-4 w-4 text-primary"/>
                                            <span className="font-semibold">
                {getCertificationCount(match.worker.certifications)}
              </span>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Experience</p>
                                        <span className="font-semibold">5+ years</span>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4"/>
                                            <span>
                {match.pricing_method === 'hourly'
                    ? `${match.estimated_hours}h @ £${match.worker.hourly_rate}/hr`
                    : `${match.estimated_days}d @ £${match.worker.day_rate}/day`
                }
              </span>
                                        </div>
                                        <span className="font-semibold">
              £{match.base_cost.toFixed(2)}
            </span>
                                    </div>

                                    {match.travel_cost > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Travel</span>
                                            <span>£{match.travel_cost.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-primary"/>
                                            <span className="font-semibold">Total</span>
                                        </div>
                                        <span className="text-2xl font-bold text-primary">
              £{match.total_cost.toFixed(2)}
            </span>
                                    </div>
                                </div>

                                {/* Why this worker */}
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm font-medium mb-1">Why this worker?</p>
                                    <p className="text-sm text-muted-foreground line-clamp-4">
                                        {match.reasoning}
                                    </p>
                                </div>
                            </div>

                            {/* Action button - OUTSIDE flex-1 div, always at bottom */}
                            {isAssigned ? (
                                <Button
                                    className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600"
                                    size="lg"
                                    disabled
                                >
                                    <UserCheck className="mr-2 h-5 w-5"/>
                                    Worker Selected
                                </Button>
                            ) : jobHasAssignment ? (
                                <Button
                                    className="w-full mt-6"
                                    size="lg"
                                    variant="outline"
                                    disabled
                                >
                                    Not Selected
                                </Button>
                            ) : (
                                <Button
                                    className="w-full mt-6"
                                    size="lg"
                                    onClick={() => handleSelectWorker(match)}
                                    disabled={assigningWorkerId !== null}
                                >
                                    {assigningWorkerId === match.worker.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                            Assigning...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="mr-2 h-5 w-5"/>
                                            Select This Worker
                                        </>
                                    )}
                                </Button>
                            )}
                        </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}