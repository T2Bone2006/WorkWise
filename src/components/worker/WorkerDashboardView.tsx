"use client";

import Link from "next/link";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Clock,
    CheckCircle,
    AlertCircle,
    MapPin,
    ArrowRight,
    Phone,
    Building2,
    ClipboardList,
    Play,
    PoundSterling,
} from "lucide-react";

interface Worker {
    id: string;
    full_name: string;
    trade_type: string;
}

interface Job {
    id: string;
    title: string;
    description: string;
    property_address: string;
    urgency: string;
    assigned_at: string;
    preferred_date: string | null;
    client: {
        company_name: string;
        full_name: string;
        email: string;
        phone: string | null;
    };
    quote: number | null;
}

interface WorkerDashboardViewProps {
    worker: Worker;
    interviewCompleted: boolean;
    stats: {
        pending: number;
        active: number;
        completed: number;
    };
    pendingJobs: Job[];
    activeJobs: Job[];
}

export function WorkerDashboardView({
    worker,
    interviewCompleted,
    stats,
    pendingJobs,
    activeJobs,
}: WorkerDashboardViewProps) {
    const firstName = worker.full_name.split(" ")[0];

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "emergency":
                return "bg-red-500 text-white";
            case "high":
                return "bg-orange-500 text-white";
            case "medium":
                return "bg-yellow-500 text-white";
            case "low":
                return "bg-blue-500 text-white";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    return (
        <div className="space-y-8">
            {/* Welcome header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {firstName}!</h1>
                <p className="text-muted-foreground mt-1">
                    Here&apos;s what&apos;s happening with your work today
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                Pending
                            </p>
                            <p className="text-3xl font-bold">{stats.pending}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-amber-500" />
                        </div>
                    </div>
                    {stats.pending > 0 && (
                        <Link href="/worker/dashboard/jobs">
                            <Button variant="link" className="px-0 mt-2">
                                View pending <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    )}
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                In Progress
                            </p>
                            <p className="text-3xl font-bold">{stats.active}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Play className="h-6 w-6 text-blue-500" />
                        </div>
                    </div>
                    {stats.active > 0 && (
                        <Link href="/worker/dashboard/jobs?tab=active">
                            <Button variant="link" className="px-0 mt-2">
                                View active <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    )}
                </Card>

                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                Completed
                            </p>
                            <p className="text-3xl font-bold">{stats.completed}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-emerald-500" />
                        </div>
                    </div>
                    {stats.completed > 0 && (
                        <Link href="/worker/dashboard/jobs?tab=completed">
                            <Button variant="link" className="px-0 mt-2">
                                View completed <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    )}
                </Card>
            </div>

            {/* Profile completion card - show only if interview not completed */}
            {!interviewCompleted && (
                <Card className="p-6 border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                                    Complete Your Profile
                                </h3>
                                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                                    Complete the AI interview to help property managers match you with the right jobs
                                </p>
                            </div>
                        </div>
                        <Link href="/worker/onboard">
                            <Button className="bg-orange-600 hover:bg-orange-700">
                                Start Interview
                            </Button>
                        </Link>
                    </div>
                </Card>
            )}

            {/* Pending Jobs Section */}
            {pendingJobs.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-semibold">Jobs Awaiting Response</h2>
                            <Badge className="bg-amber-500 text-white">{pendingJobs.length}</Badge>
                        </div>
                        {stats.pending > 5 && (
                            <Link href="/worker/dashboard/jobs">
                                <Button variant="ghost" size="sm">
                                    View all <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                            </Link>
                        )}
                    </div>

                    <div className="grid gap-4">
                        {pendingJobs.map((job) => (
                            <Link key={job.id} href={`/worker/dashboard/jobs/${job.id}`}>
                                <Card className="p-5 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all border-amber-200 dark:border-amber-800/50">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-start gap-2 flex-wrap">
                                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                                <Badge className={getUrgencyColor(job.urgency)}>
                                                    {job.urgency}
                                                </Badge>
                                                <Badge className="bg-amber-500 text-white">
                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                    Awaiting Response
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span>{job.property_address}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="h-4 w-4 shrink-0" />
                                                    <span>{job.client.company_name}</span>
                                                </div>
                                            </div>

                                            {job.assigned_at && (
                                                <p className="text-xs text-muted-foreground">
                                                    Assigned {format(new Date(job.assigned_at), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 md:items-end">
                                            {job.quote && (
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Your Quote</div>
                                                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                        £{job.quote.toFixed(2)}
                                                    </div>
                                                </div>
                                            )}
                                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                                                Review & Accept
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Jobs Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-semibold">Active Jobs</h2>
                        {activeJobs.length > 0 && (
                            <Badge className="bg-blue-500 text-white">{activeJobs.length}</Badge>
                        )}
                    </div>
                    {stats.active > 5 && (
                        <Link href="/worker/dashboard/jobs?tab=active">
                            <Button variant="ghost" size="sm">
                                View all <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    )}
                </div>

                {activeJobs.length === 0 ? (
                    <Card className="p-8 text-center">
                        <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No active jobs</h3>
                        <p className="text-muted-foreground">
                            {pendingJobs.length > 0
                                ? "Accept a pending job to start working on it."
                                : "When a property manager assigns you to a job, it will appear here."}
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {activeJobs.map((job) => (
                            <Link key={job.id} href={`/worker/dashboard/jobs/${job.id}`}>
                                <Card className="p-5 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-start gap-2 flex-wrap">
                                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                                <Badge className={getUrgencyColor(job.urgency)}>
                                                    {job.urgency}
                                                </Badge>
                                                <Badge className="bg-blue-500 text-white">
                                                    <Play className="h-3 w-3 mr-1" />
                                                    In Progress
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                {job.description}
                                            </p>

                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span>{job.property_address}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="h-4 w-4 shrink-0" />
                                                    <span>{job.client.company_name}</span>
                                                </div>
                                            </div>

                                            {job.assigned_at && (
                                                <p className="text-xs text-muted-foreground">
                                                    Assigned {format(new Date(job.assigned_at), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 md:items-end">
                                            {job.quote && (
                                                <div className="text-right">
                                                    <div className="text-xs text-muted-foreground">Your Quote</div>
                                                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                                        £{job.quote.toFixed(2)}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                                {job.client.phone && (
                                                    <Button asChild size="sm" variant="outline">
                                                        <a href={`tel:${job.client.phone}`} onClick={(e) => e.stopPropagation()}>
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            Call Client
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button size="sm">View Details</Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
