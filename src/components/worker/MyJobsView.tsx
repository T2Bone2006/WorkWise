"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    ClipboardList,
    MapPin,
    Calendar,
    Building2,
    Phone,
    Mail,
    Clock,
    CheckCircle,
    Loader2,
    PoundSterling,
    AlertCircle,
    Play,
} from "lucide-react";
import { markJobCompleteByWorker, acceptJob } from "@/lib/supabase/worker-job-actions";

interface Client {
    company_name: string;
    full_name: string;
    email: string;
    phone: string | null;
}

interface Job {
    id: string;
    title: string;
    description: string;
    property_address: string;
    urgency: string;
    status: string;
    preferred_date: string | null;
    assigned_at: string | null;
    completed_at: string | null;
    client: Client;
    quote: number | null;
}

interface MyJobsViewProps {
    jobs: Job[];
    workerId: string;
}

export function MyJobsView({ jobs }: MyJobsViewProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"pending" | "active" | "completed">("pending");
    const [completingJobId, setCompletingJobId] = useState<string | null>(null);
    const [acceptingJobId, setAcceptingJobId] = useState<string | null>(null);

    // Filter jobs by status
    const pendingJobs = jobs.filter((job) => job.status === "assigned");
    const activeJobs = jobs.filter((job) => job.status === "in_progress");
    const completedJobs = jobs.filter((job) => job.status === "completed");

    // Set initial tab based on what jobs exist
    const getDefaultTab = () => {
        if (pendingJobs.length > 0) return "pending";
        if (activeJobs.length > 0) return "active";
        return "completed";
    };

    const handleAcceptJob = async (jobId: string) => {
        setAcceptingJobId(jobId);
        const result = await acceptJob(jobId);

        if (result.error) {
            toast.error("Failed to accept job", { description: result.error });
            setAcceptingJobId(null);
            return;
        }

        toast.success("Job accepted!", {
            description: "The client has been notified. You can now see their contact details.",
        });
        setAcceptingJobId(null);
        router.refresh();
    };

    const handleMarkComplete = async (jobId: string) => {
        setCompletingJobId(jobId);
        const result = await markJobCompleteByWorker(jobId);

        if (result.error) {
            toast.error("Failed to complete job", { description: result.error });
            setCompletingJobId(null);
            return;
        }

        toast.success("Job marked as complete!", {
            description: "The client has been notified.",
        });
        setCompletingJobId(null);
        router.refresh();
    };

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

    const JobCard = ({ job }: { job: Job }) => {
        const isPending = job.status === "assigned";
        const isActive = job.status === "in_progress";
        const isCompleted = job.status === "completed";

        const handleCardClick = () => {
            router.push(`/worker/dashboard/jobs/${job.id}`);
        };

        return (
            <Card
                className={`p-5 ${isCompleted ? "opacity-75" : ""} cursor-pointer hover:border-primary/50 hover:shadow-md transition-all`}
                onClick={handleCardClick}
            >
                <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h3 className="font-semibold text-lg">{job.title}</h3>
                                <Badge className={getUrgencyColor(job.urgency)}>
                                    {job.urgency}
                                </Badge>
                                {isPending && (
                                    <Badge className="bg-amber-500 text-white">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Awaiting Response
                                    </Badge>
                                )}
                                {isActive && (
                                    <Badge className="bg-blue-500 text-white">
                                        <Play className="h-3 w-3 mr-1" />
                                        In Progress
                                    </Badge>
                                )}
                                {isCompleted && (
                                    <Badge className="bg-emerald-500 text-white">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Completed
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {job.description}
                            </p>
                        </div>

                        {/* Quote/Price Badge */}
                        {job.quote && (
                            <div className="text-right shrink-0">
                                <div className="text-xs text-muted-foreground">Your Quote</div>
                                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                                    £{job.quote.toFixed(2)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">{job.property_address}</span>
                            </div>

                            {job.preferred_date && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">
                                        Preferred: {format(new Date(job.preferred_date), "MMM d, yyyy")}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">
                                    {isCompleted && job.completed_at
                                        ? `Completed ${format(new Date(job.completed_at), "MMM d, yyyy")}`
                                        : job.assigned_at
                                            ? `Assigned ${format(new Date(job.assigned_at), "MMM d, yyyy")}`
                                            : "Not assigned"}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                                <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-muted-foreground">
                                    {job.client.company_name}
                                </span>
                            </div>
                            {!isPending && (
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground pl-6">
                                        {job.client.full_name}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action buttons based on status */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t" onClick={(e) => e.stopPropagation()}>
                        {/* Pending - Accept button */}
                        {isPending && (
                            <>
                                <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => handleAcceptJob(job.id)}
                                    disabled={acceptingJobId === job.id}
                                >
                                    {acceptingJobId === job.id ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Accepting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Accept Job
                                        </>
                                    )}
                                </Button>
                                <Button size="sm" variant="outline">
                                    View Details
                                </Button>
                            </>
                        )}

                        {/* Active - Contact & Complete buttons */}
                        {isActive && (
                            <>
                                {job.client.phone && (
                                    <Button asChild variant="outline" size="sm">
                                        <a href={`tel:${job.client.phone}`}>
                                            <Phone className="h-4 w-4 mr-2" />
                                            Call Client
                                        </a>
                                    </Button>
                                )}
                                <Button asChild variant="outline" size="sm">
                                    <a href={`mailto:${job.client.email}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Email Client
                                    </a>
                                </Button>
                                <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 ml-auto"
                                    onClick={() => handleMarkComplete(job.id)}
                                    disabled={completingJobId === job.id}
                                >
                                    {completingJobId === job.id ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Completing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark Complete
                                        </>
                                    )}
                                </Button>
                            </>
                        )}

                        {/* Completed - View only */}
                        {isCompleted && (
                            <Button size="sm" variant="outline">
                                View Details
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">My Jobs</h1>
                <p className="text-muted-foreground mt-1">
                    Jobs assigned to you by property managers
                </p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue={getDefaultTab()} value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "active" | "completed")}>
                <TabsList className="grid w-full max-w-lg grid-cols-3">
                    <TabsTrigger value="pending" className="gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Pending ({pendingJobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="gap-2">
                        <Play className="h-4 w-4" />
                        Active ({activeJobs.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Done ({completedJobs.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    {pendingJobs.length === 0 ? (
                        <Card className="p-12 text-center">
                            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No pending jobs</h3>
                            <p className="text-muted-foreground">
                                When a property manager assigns you to a job, it will appear here for you to accept.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {pendingJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    {activeJobs.length === 0 ? (
                        <Card className="p-12 text-center">
                            <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No active jobs</h3>
                            <p className="text-muted-foreground">
                                Jobs you accept will appear here until completed.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {activeJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="completed" className="mt-6">
                    {completedJobs.length === 0 ? (
                        <Card className="p-12 text-center">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No completed jobs</h3>
                            <p className="text-muted-foreground">
                                Jobs you complete will appear here.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {completedJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
