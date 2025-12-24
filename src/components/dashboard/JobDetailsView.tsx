"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    MapPin,
    Clock,
    AlertCircle,
    CheckCircle2,
    XCircle,
    UserCheck,
    Phone,
    Mail,
    Loader2,
    Calendar,
    Briefcase,
} from "lucide-react";
import { markJobCompleted, cancelJob } from "@/lib/supabase/job-actions";

interface Job {
    id: string;
    title: string;
    description: string;
    property_address: string;
    urgency: string;
    status: string;
    created_at: string;
    preferred_date: string | null;
    assigned_at: string | null;
    completed_at: string | null;
    assigned_worker: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        trade_type: string;
    } | null;
}

interface JobDetailsViewProps {
    job: Job;
}

export function JobDetailsView({ job }: JobDetailsViewProps) {
    const router = useRouter();
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "emergency":
                return "bg-destructive text-destructive-foreground";
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "completed":
                return "bg-emerald-500 text-white";
            case "cancelled":
                return "bg-gray-500 text-white";
            case "in_progress":
                return "bg-blue-500 text-white";
            case "assigned":
                return "bg-purple-500 text-white";
            case "matched":
                return "bg-cyan-500 text-white";
            case "pending":
                return "bg-secondary text-secondary-foreground";
            default:
                return "bg-secondary text-secondary-foreground";
        }
    };

    const formatUrgency = (urgency: string) => {
        const labels: Record<string, string> = {
            emergency: "Emergency",
            high: "High",
            medium: "Medium",
            low: "Low",
        };
        return labels[urgency] || urgency;
    };

    const formatStatus = (status: string) => {
        return status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const handleMarkCompleted = async () => {
        setIsCompleting(true);
        try {
            const result = await markJobCompleted(job.id);
            if (result.error) {
                toast.error("Failed to mark job as completed", {
                    description: result.error,
                });
                return;
            }
            toast.success("Job marked as completed!");
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsCompleting(false);
        }
    };

    const handleCancelJob = async () => {
        setIsCancelling(true);
        try {
            const result = await cancelJob(job.id);
            if (result.error) {
                toast.error("Failed to cancel job", {
                    description: result.error,
                });
                return;
            }
            toast.success("Job cancelled");
            setShowCancelDialog(false);
            router.refresh();
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsCancelling(false);
        }
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

            {/* Job Header */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2.5 rounded-lg ${
                            job.urgency === 'emergency' ? 'bg-red-500/10' :
                            job.urgency === 'high' ? 'bg-orange-500/10' :
                            job.urgency === 'medium' ? 'bg-yellow-500/10' :
                            'bg-blue-500/10'
                        }`}>
                            <Briefcase className={`h-6 w-6 ${
                                job.urgency === 'emergency' ? 'text-red-500' :
                                job.urgency === 'high' ? 'text-orange-500' :
                                job.urgency === 'medium' ? 'text-yellow-500' :
                                'text-blue-500'
                            }`} />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <Badge className={getUrgencyColor(job.urgency)}>
                            {formatUrgency(job.urgency)}
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                            {formatStatus(job.status)}
                        </Badge>
                    </div>
                </div>

                {/* Status Controls */}
                {(job.status === "pending" || job.status === "matched") && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(true)}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Job
                        </Button>
                    </div>
                )}
                {(job.status === "assigned" || job.status === "in_progress") && (
                    <div className="flex gap-2">
                        <Button
                            onClick={handleMarkCompleted}
                            disabled={isCompleting}
                            className="bg-emerald-500 hover:bg-emerald-600"
                        >
                            {isCompleting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                            )}
                            Mark as Completed
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(true)}
                            className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancel Job
                        </Button>
                    </div>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Job Details Card */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Job Details</h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Description</p>
                            <p className="text-foreground">{job.description}</p>
                        </div>

                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-muted-foreground">Property Address</p>
                                <p className="font-medium">{job.property_address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm text-muted-foreground">Created</p>
                                <p className="font-medium">
                                    {format(new Date(job.created_at), "MMMM d, yyyy 'at' h:mm a")}
                                </p>
                            </div>
                        </div>

                        {job.preferred_date && (
                            <div className="flex items-start gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Preferred Date</p>
                                    <p className="font-medium">
                                        {format(new Date(job.preferred_date), "MMMM d, yyyy")}
                                    </p>
                                </div>
                            </div>
                        )}

                        {job.assigned_at && (
                            <div className="flex items-start gap-2">
                                <UserCheck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Assigned</p>
                                    <p className="font-medium">
                                        {format(new Date(job.assigned_at), "MMMM d, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                            </div>
                        )}

                        {job.completed_at && (
                            <div className="flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="font-medium text-emerald-600">
                                        {format(new Date(job.completed_at), "MMMM d, yyyy 'at' h:mm a")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Worker Contact Card - only show when assigned */}
                {job.assigned_worker && (
                    <Card className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                <UserCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                                Assigned Worker
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Name</p>
                                <p className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                                    {job.assigned_worker.full_name}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 mb-1">Trade</p>
                                <p className="font-medium text-emerald-900 dark:text-emerald-100 capitalize">
                                    {job.assigned_worker.trade_type.replace('_', ' ')}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800 space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    <a
                                        href={`mailto:${job.assigned_worker.email}`}
                                        className="text-emerald-700 dark:text-emerald-300 hover:underline"
                                    >
                                        {job.assigned_worker.email}
                                    </a>
                                </div>

                                {job.assigned_worker.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        <a
                                            href={`tel:${job.assigned_worker.phone}`}
                                            className="text-emerald-700 dark:text-emerald-300 hover:underline"
                                        >
                                            {job.assigned_worker.phone}
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4">
                                {job.assigned_worker.phone && (
                                    <Button
                                        asChild
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        <a href={`tel:${job.assigned_worker.phone}`}>
                                            <Phone className="mr-2 h-4 w-4" />
                                            Call Worker
                                        </a>
                                    </Button>
                                )}
                                <Button
                                    asChild
                                    variant="outline"
                                    className="flex-1 border-emerald-600 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                                >
                                    <a href={`mailto:${job.assigned_worker.email}`}>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Email Worker
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}

                {/* No worker assigned message */}
                {!job.assigned_worker && job.status !== "completed" && job.status !== "cancelled" && (
                    <Card className="p-6 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-semibold mb-2">No Worker Assigned</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            View matched workers and select one to assign to this job.
                        </p>
                        <Button onClick={() => router.push(`/jobs/${job.id}/matches`)}>
                            View Workers
                        </Button>
                    </Card>
                )}
            </div>

            {/* View Quotes Button */}
            {job.assigned_worker && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push(`/jobs/${job.id}/matches`)}
                    >
                        View All Quotes
                    </Button>
                </div>
            )}

            {/* Cancel Confirmation Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel Job</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this job? This action cannot be undone.
                            The assigned worker will be notified.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            disabled={isCancelling}
                        >
                            Keep Job
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelJob}
                            disabled={isCancelling}
                        >
                            {isCancelling ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <XCircle className="mr-2 h-4 w-4" />
                            )}
                            Cancel Job
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
