"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
    MapPin,
    Calendar,
    Building2,
    Phone,
    Mail,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle,
} from "lucide-react";
import { acceptJob, declineJob } from "@/lib/supabase/worker-job-actions";

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
    client: Client;
}

interface JobResponseViewProps {
    job: Job;
    estimatedCost: number;
    initialAction?: "accept" | "decline";
}

export function JobResponseView({ job, estimatedCost, initialAction }: JobResponseViewProps) {
    const router = useRouter();
    const [action, setAction] = useState<"accept" | "decline" | null>(initialAction || null);
    const [declineReason, setDeclineReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

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

    const handleAccept = async () => {
        setIsLoading(true);
        const result = await acceptJob(job.id);

        if (result.error) {
            toast.error("Failed to accept job", { description: result.error });
            setIsLoading(false);
            return;
        }

        setIsComplete(true);
        toast.success("Job accepted!", {
            description: "The client has been notified. You can now contact them.",
        });

        setTimeout(() => {
            router.push("/worker/dashboard/jobs");
        }, 2000);
    };

    const handleDecline = async () => {
        setIsLoading(true);
        const result = await declineJob(job.id, declineReason || undefined);

        if (result.error) {
            toast.error("Failed to decline job", { description: result.error });
            setIsLoading(false);
            return;
        }

        setIsComplete(true);
        toast.success("Job declined", {
            description: "The client has been notified.",
        });

        setTimeout(() => {
            router.push("/worker/dashboard");
        }, 2000);
    };

    // Already responded to this job
    if (job.status !== "assigned") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="p-8 max-w-md text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">Already Responded</h2>
                    <p className="text-muted-foreground mb-6">
                        You've already responded to this job. Current status: {job.status}
                    </p>
                    <Button onClick={() => router.push("/worker/dashboard")}>
                        Go to Dashboard
                    </Button>
                </Card>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <Card className="p-8 max-w-md text-center">
                    <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold mb-2">
                        {action === "accept" ? "Job Accepted!" : "Job Declined"}
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        {action === "accept"
                            ? "The client has been notified. Redirecting to your jobs..."
                            : "The client has been notified. Redirecting..."}
                    </p>
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Job Assignment</h1>
                    <p className="text-muted-foreground">
                        Review the job details and respond
                    </p>
                </div>

                {/* Job Details Card */}
                <Card className="p-6">
                    <div className="space-y-4">
                        {/* Title and Urgency */}
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h2 className="text-xl font-semibold">{job.title}</h2>
                                    <Badge className={getUrgencyColor(job.urgency)}>
                                        {job.urgency}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground">{job.description}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid gap-3 md:grid-cols-2 pt-4 border-t">
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
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="text-muted-foreground">{job.client.company_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-muted-foreground pl-6">{job.client.full_name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Estimated Cost */}
                        {estimatedCost > 0 && (
                            <div className="pt-4 border-t">
                                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                    <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Your Estimated Quote</p>
                                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                        £{estimatedCost.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Action Selection */}
                {!action && (
                    <Card className="p-6">
                        <h3 className="text-lg font-semibold mb-4">How would you like to respond?</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                size="lg"
                                className="h-auto py-4 bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => setAction("accept")}
                            >
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Accept Job
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-auto py-4 border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950/30"
                                onClick={() => setAction("decline")}
                            >
                                <XCircle className="h-5 w-5 mr-2" />
                                Decline Job
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Accept Confirmation */}
                {action === "accept" && (
                    <Card className="p-6 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                    <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Accept this job?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        The client will be notified with your contact details
                                    </p>
                                </div>
                            </div>

                            {/* Client Contact Preview */}
                            <div className="bg-white dark:bg-background rounded-lg p-4 border">
                                <p className="text-sm font-medium mb-3">Client Contact (visible after accepting):</p>
                                <div className="space-y-2">
                                    {job.client.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span>{job.client.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{job.client.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    disabled={isLoading}
                                    onClick={handleAccept}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Accepting...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Confirm Accept
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setAction(null)}
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Decline Confirmation */}
                {action === "decline" && (
                    <Card className="p-6 border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-full">
                                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">Decline this job?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        The client will be notified and can select another worker
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Reason for declining (optional)
                                </label>
                                <Textarea
                                    placeholder="e.g., Fully booked this week, outside service area, etc."
                                    value={declineReason}
                                    onChange={(e) => setDeclineReason(e.target.value)}
                                    rows={3}
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    disabled={isLoading}
                                    onClick={handleDecline}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Declining...
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Confirm Decline
                                        </>
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setAction(null)}
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
