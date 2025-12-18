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
} from "lucide-react";

interface Worker {
    id: string;
    full_name: string;
    trade_type: string;
}

interface ActiveJob {
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
}

interface WorkerDashboardViewProps {
    worker: Worker;
    interviewCompleted: boolean;
    stats: {
        active: number;
        completed: number;
    };
    activeJobs: ActiveJob[];
}

export function WorkerDashboardView({
    worker,
    interviewCompleted,
    stats,
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-muted-foreground">
                                Active Jobs
                            </p>
                            <p className="text-3xl font-bold">{stats.active}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-purple-500" />
                        </div>
                    </div>
                    {stats.active > 0 && (
                        <Link href="/worker/dashboard/jobs">
                            <Button variant="link" className="px-0 mt-2">
                                View my jobs <ArrowRight className="h-4 w-4 ml-1" />
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

            {/* Active Jobs Section */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">My Active Jobs</h2>
                    {stats.active > 5 && (
                        <Link href="/worker/dashboard/jobs">
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
                            When a property manager assigns you to a job, it will appear here.
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {activeJobs.map((job) => (
                            <Card key={job.id} className="p-5">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-start gap-2">
                                            <h3 className="font-semibold text-lg">{job.title}</h3>
                                            <Badge className={getUrgencyColor(job.urgency)}>
                                                {job.urgency}
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
                                        {job.client.phone && (
                                            <Button asChild size="sm" variant="outline">
                                                <a href={`tel:${job.client.phone}`}>
                                                    <Phone className="h-4 w-4 mr-2" />
                                                    Call Client
                                                </a>
                                            </Button>
                                        )}
                                        <Link href="/worker/dashboard/jobs">
                                            <Button size="sm">View Details</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
