"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
    ArrowLeft,
    Clock,
    DollarSign,
    AlertCircle,
} from "lucide-react";
import { acceptJob, declineJob, markJobCompleteByWorker } from "@/lib/supabase/worker-job-actions";

// Dynamic import for map (SSR disabled)
const JobLocationMap = dynamic(
    () => import("@/components/worker/JobLocationMap").then((mod) => mod.JobLocationMap),
    {
        ssr: false,
        loading: () => (
            <div className="h-[300px] md:h-[400px] flex items-center justify-center bg-muted rounded-lg">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        ),
    }
);

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
    property_postcode: string | null;
    urgency: string;
    status: string;
    preferred_date: string | null;
    assigned_at: string | null;
    completed_at: string | null;
    client: Client;
}

interface Match {
    total_cost: number | null;
    status: string;
    ai_reasoning: string | null;
}

interface JobDetailsViewProps {
    job: Job;
    match: Match | null;
}

export function JobDetailsView({ job, match }: JobDetailsViewProps) {
    const router = useRouter();
    const [isAccepting, setIsAccepting] = useState(false);
    const [isDeclining, setIsDeclining] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [declineReason, setDeclineReason] = useState("");

    const isAssigned = job.status === "assigned";
    const isInProgress = job.status === "in_progress";
    const isCompleted = job.status === "completed";
    const canAcceptDecline = isAssigned;
    const canComplete = isAssigned || isInProgress;

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "assigned":
                return <Badge className="bg-purple-500 text-white">Pending Response</Badge>;
            case "in_progress":
                return <Badge className="bg-blue-500 text-white">In Progress</Badge>;
            case "completed":
                return <Badge className="bg-emerald-500 text-white"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const handleAccept = async () => {
        setIsAccepting(true);
        const result = await acceptJob(job.id);

        if (result.error) {
            toast.error("Failed to accept job", { description: result.error });
            setIsAccepting(false);
            return;
        }

        toast.success("Job accepted!", {
            description: "The client has been notified. You can now contact them.",
        });
        router.refresh();
        setIsAccepting(false);
    };

    const handleDeclineSubmit = async () => {
        setIsDeclining(true);
        const result = await declineJob(job.id, declineReason || undefined);

        if (result.error) {
            toast.error("Failed to decline job", { description: result.error });
            setIsDeclining(false);
            return;
        }

        toast.success("Job declined", {
            description: "The client has been notified.",
        });
        setShowDeclineModal(false);
        router.push("/worker/dashboard/jobs");
    };

    const handleMarkComplete = async () => {
        setIsCompleting(true);
        const result = await markJobCompleteByWorker(job.id);

        if (result.error) {
            toast.error("Failed to complete job", { description: result.error });
            setIsCompleting(false);
            return;
        }

        toast.success("Job marked as complete!", {
            description: "The client has been notified.",
        });
        router.refresh();
        setIsCompleting(false);
    };

    return (
        <div className="space-y-6">
            {/* Back button */}
            <Link href="/worker/dashboard/jobs">
                <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to My Jobs
                </Button>
            </Link>

            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-start gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                    <Badge className={getUrgencyColor(job.urgency)}>{job.urgency}</Badge>
                    {getStatusBadge(job.status)}
                </div>
                <p className="text-muted-foreground">{job.description}</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Column - Details */}
                <div className="space-y-6">
                    {/* Job Info Card */}
                    <Card className="p-5">
                        <h3 className="font-semibold mb-4">Job Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Property Address</p>
                                    <p className="text-sm text-muted-foreground">{job.property_address}</p>
                                </div>
                            </div>

                            {job.preferred_date && (
                                <div className="flex items-start gap-3">
                                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Preferred Date</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(job.preferred_date), "EEEE, MMMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {job.assigned_at && (
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Assigned</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(job.assigned_at), "MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {job.completed_at && (
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Completed</p>
                                        <p className="text-sm text-muted-foreground">
                                            {format(new Date(job.completed_at), "MMM d, yyyy 'at' h:mm a")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {match?.total_cost && (
                                <div className="flex items-start gap-3">
                                    <DollarSign className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Estimated Cost</p>
                                        <p className="text-sm text-muted-foreground">
                                            £{match.total_cost.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Client Info Card - Only show if accepted or in progress */}
                    {(isInProgress || isCompleted) && (
                        <Card className="p-5">
                            <h3 className="font-semibold mb-4">Client Contact</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Building2 className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">{job.client.company_name}</p>
                                        <p className="text-sm text-muted-foreground">{job.client.full_name}</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {job.client.phone && (
                                        <Button asChild variant="outline" size="sm">
                                            <a href={`tel:${job.client.phone}`}>
                                                <Phone className="h-4 w-4 mr-2" />
                                                {job.client.phone}
                                            </a>
                                        </Button>
                                    )}
                                    <Button asChild variant="outline" size="sm">
                                        <a href={`mailto:${job.client.email}`}>
                                            <Mail className="h-4 w-4 mr-2" />
                                            Email
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Client Info Card - Teaser for assigned status */}
                    {isAssigned && (
                        <Card className="p-5 border-dashed">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Client Contact Hidden</p>
                                    <p className="text-sm text-muted-foreground">
                                        Accept this job to see client contact details
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <Card className="p-5">
                        <h3 className="font-semibold mb-4">Actions</h3>
                        <div className="space-y-3">
                            {canAcceptDecline && (
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                                        onClick={handleAccept}
                                        disabled={isAccepting}
                                    >
                                        {isAccepting ? (
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
                                    <Button
                                        variant="destructive"
                                        className="flex-1"
                                        onClick={() => setShowDeclineModal(true)}
                                        disabled={isDeclining}
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Decline Job
                                    </Button>
                                </div>
                            )}

                            {canComplete && !canAcceptDecline && (
                                <Button
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    onClick={handleMarkComplete}
                                    disabled={isCompleting}
                                >
                                    {isCompleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Completing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Mark as Complete
                                        </>
                                    )}
                                </Button>
                            )}

                            {isCompleted && (
                                <div className="text-center py-4">
                                    <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-2" />
                                    <p className="text-sm font-medium">This job has been completed</p>
                                    <p className="text-xs text-muted-foreground">
                                        Completed on {job.completed_at && format(new Date(job.completed_at), "MMMM d, yyyy")}
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Right Column - Map */}
                <div>
                    <Card className="p-5">
                        <h3 className="font-semibold mb-4">Job Location</h3>
                        <JobLocationMap
                            postcode={job.property_postcode}
                            className="h-[300px] md:h-[400px]"
                        />
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                            500m radius shown around job location
                        </p>
                    </Card>
                </div>
            </div>

            {/* Decline Modal */}
            <Dialog open={showDeclineModal} onOpenChange={setShowDeclineModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Decline this job?</DialogTitle>
                        <DialogDescription>
                            Let the client know why you cannot take this job. This helps them find another tradesperson.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <label className="text-sm font-medium mb-2 block">
                            Reason for declining (optional)
                        </label>
                        <Textarea
                            placeholder="e.g., Schedule conflict, outside my service area..."
                            value={declineReason}
                            onChange={(e) => setDeclineReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeclineModal(false)}
                            disabled={isDeclining}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeclineSubmit}
                            disabled={isDeclining}
                        >
                            {isDeclining ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Declining...
                                </>
                            ) : (
                                "Decline Job"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
