"use client";

import { useState, useMemo } from "react";
import { Upload, Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Briefcase, Plus, Clock, MapPin, AlertCircle, UserCheck, Mail, Phone } from "lucide-react";
import { CreateJobDialog } from "@/components/dashboard/create-job-dialog";
import { BulkJobUpload } from "@/components/dashboard/BulkJobUpload";
import { MatchingLoadingOverlay } from "@/components/dashboard/MatchingLoadingOverlay";
import { format } from "date-fns";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Job {
    id: string;
    title: string;
    description: string;
    property_address: string;
    urgency: string;
    status: string;
    created_at: string;
    preferred_date: string | null;
    assigned_worker_id: string | null;
    assigned_at: string | null;
    assigned_worker: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        trade_type: string;
    } | null;
    matches?: Array<{
        id: string;
        match_score: number;
        estimated_hours: number | null;
        estimated_days: number | null;
        pricing_method: string;
        total_cost: number;
        worker: {
            id: string;
            full_name: string;
            hourly_rate: number;
            day_rate: number;
        };
    }>;
}

interface JobsListProps {
    initialJobs: Job[];
}

export function JobsList({ initialJobs }: JobsListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [jobs] = useState<Job[]>(initialJobs);
    const [matchingJobId, setMatchingJobId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");

    // Filter state from URL params
    const statusFilter = searchParams.get("status") || "all";
    const searchQuery = searchParams.get("search") || "";
    const sortBy = searchParams.get("sort") || "newest";

    // Update URL params
    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all" && value !== "newest" && value !== "") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Filtered and sorted jobs
    const filteredJobs = useMemo(() => {
        let result = [...jobs];

        // Filter by status
        if (statusFilter !== "all") {
            result = result.filter((job) => job.status === statusFilter);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (job) =>
                    job.title.toLowerCase().includes(query) ||
                    job.property_address.toLowerCase().includes(query)
            );
        }

        // Sort
        switch (sortBy) {
            case "oldest":
                result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                break;
            case "urgency":
                const urgencyOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
                result.sort((a, b) =>
                    (urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 4) -
                    (urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 4)
                );
                break;
            case "newest":
            default:
                result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                break;
        }

        return result;
    }, [jobs, statusFilter, searchQuery, sortBy]);

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
        const labels = {
            emergency: "Emergency",
            high: "High",
            medium: "Medium",
            low: "Low",
        };
        return labels[urgency as keyof typeof labels] || urgency;
    };

    const formatStatus = (status: string) => {
        return status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <>
            <div className="space-y-6">
                {/* Page title */}
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
                    <p className="text-muted-foreground">
                        Manage maintenance requests and track job progress
                    </p>
                </div>

                {/* Modern Job Creation Selector */}
                <div className="mb-8">
                    <div className="border-b border-border">
                        <div className="flex gap-1 -mb-px">
                            <button
                                onClick={() => setActiveTab("single")}
                                className={`
                relative px-6 py-4 font-semibold text-sm transition-all
                ${activeTab === "single"
                                    ? "text-primary border-b-2 border-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                }
              `}
                            >
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    <span>Create Single Job</span>
                                </div>
                            </button>

                            <button
                                onClick={() => setActiveTab("bulk")}
                                className={`
                relative px-6 py-4 font-semibold text-sm transition-all
                ${activeTab === "bulk"
                                    ? "text-primary border-b-2 border-primary bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                }
              `}
                            >
                                <div className="flex items-center gap-2">
                                    <Upload className="h-4 w-4" />
                                    <span>Bulk Upload</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Single Job Content */}
                    {activeTab === "single" && (
                        <div className="pt-6">
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 rounded-lg">
                                        <Plus className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2">Create a New Job</h3>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Post a maintenance job and get matched with 3 qualified tradespeople within minutes.
                                            Our AI analyzes your requirements and provides instant quotes.
                                        </p>
                                        <Button onClick={() => setIsCreateDialogOpen(true)} size="lg">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create New Job
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Bulk Upload Content */}
                    {activeTab === "bulk" && (
                        <div className="pt-6">
                            <Card className="p-6">
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                        <Upload className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2">Upload Multiple Jobs</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Perfect for property managers - create multiple jobs at once using our intuitive form
                                            or upload a CSV file with all your maintenance requests.
                                        </p>
                                    </div>
                                </div>
                                <BulkJobUpload onCompleteAction={() => window.location.reload()} />
                            </Card>
                        </div>
                    )}
                </div>

                {/* Jobs list or empty state */}
                {jobs.length === 0 ? (
                    <EmptyState
                        icon={Briefcase}
                        title="No jobs yet"
                        description="Get started by creating your first maintenance job. We'll match you with qualified tradespeople within 2 hours."
                        action={{
                            label: "Create your first job",
                            onClick: () => setIsCreateDialogOpen(true),
                        }}
                    />
                ) : (
                    <div className="space-y-6">
                        {/* Filter Bar */}
                        <Card className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                {/* Search */}
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by title or address..."
                                        value={searchQuery}
                                        onChange={(e) => updateFilters("search", e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                {/* Status Filter */}
                                <Select
                                    value={statusFilter}
                                    onValueChange={(value) => updateFilters("status", value)}
                                >
                                    <SelectTrigger className="w-full md:w-[160px]">
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="assigned">Assigned</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>

                                {/* Sort */}
                                <Select
                                    value={sortBy}
                                    onValueChange={(value) => updateFilters("sort", value)}
                                >
                                    <SelectTrigger className="w-full md:w-[160px]">
                                        <ArrowUpDown className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Date (Newest)</SelectItem>
                                        <SelectItem value="oldest">Date (Oldest)</SelectItem>
                                        <SelectItem value="urgency">Urgency</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </Card>

                        {/* Section header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {statusFilter !== "all" ? `${formatStatus(statusFilter)} Jobs` : "All Jobs"}
                                </h2>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                                    {filteredJobs.length !== jobs.length && ` (${jobs.length} total)`}
                                </p>
                            </div>
                        </div>

                        {/* Jobs grid */}
                        {filteredJobs.length === 0 ? (
                            <Card className="p-12 text-center">
                                <p className="text-muted-foreground">
                                    No jobs match your filters. Try adjusting your search or filter criteria.
                                </p>
                            </Card>
                        ) : (
                        <div className="grid gap-4">
                            {filteredJobs.map((job) => (
                                <Card key={job.id} className="group relative overflow-hidden border-border/30 hover:border-border/60 transition-all hover:shadow-lg">
                                    {/* Accent bar on left */}
                                    <div
                                        className={`absolute left-0 top-0 bottom-0 w-1 ${
                                            job.urgency === 'emergency' ? 'bg-red-500' :
                                                job.urgency === 'high' ? 'bg-orange-500' :
                                                    job.urgency === 'medium' ? 'bg-yellow-500' :
                                                        'bg-blue-500'
                                        }`}
                                    />

                                    <div className="p-6 pl-8">
                                        <div className="space-y-4">
                                            {/* Header row */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`
                      p-2.5 rounded-lg shrink-0
                      ${job.urgency === 'emergency' ? 'bg-red-500/10' :
                                                            job.urgency === 'high' ? 'bg-orange-500/10' :
                                                                job.urgency === 'medium' ? 'bg-yellow-500/10' :
                                                                    'bg-blue-500/10'}
                    `}>
                                                            <Briefcase className={`h-5 w-5 ${
                                                                job.urgency === 'emergency' ? 'text-red-500' :
                                                                    job.urgency === 'high' ? 'text-orange-500' :
                                                                        job.urgency === 'medium' ? 'text-yellow-500' :
                                                                            'text-blue-500'
                                                            }`} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                                                                {job.title}
                                                            </h3>
                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                {job.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2 shrink-0">
                                                    <Badge className={getUrgencyColor(job.urgency)}>
                                                        {formatUrgency(job.urgency)}
                                                    </Badge>
                                                    <Badge className={getStatusColor(job.status)}>
                                                        {formatStatus(job.status)}
                                                    </Badge>
                                                </div>
                                            </div>

                                            {/* Details row */}
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span className="line-clamp-1">{job.property_address}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Clock className="h-4 w-4 shrink-0" />
                                                    <span>Created {format(new Date(job.created_at), "MMM d, yyyy")}</span>
                                                </div>
                                                {job.preferred_date && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                                        <span>Due {format(new Date(job.preferred_date), "MMM d, yyyy")}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Assigned Worker Section */}
                                            {job.assigned_worker && (
                                                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                                                            <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                                                                Assigned Worker
                                                            </p>
                                                            <p className="font-semibold text-emerald-900 dark:text-emerald-100">
                                                                {job.assigned_worker.full_name}
                                                            </p>
                                                            <p className="text-sm text-emerald-700 dark:text-emerald-300 capitalize">
                                                                {job.assigned_worker.trade_type.replace('_', ' ')}
                                                            </p>
                                                            <div className="flex flex-wrap gap-4 mt-2 text-sm">
                                                                <a
                                                                    href={`mailto:${job.assigned_worker.email}`}
                                                                    className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
                                                                >
                                                                    <Mail className="h-3.5 w-3.5" />
                                                                    {job.assigned_worker.email}
                                                                </a>
                                                                {job.assigned_worker.phone && (
                                                                    <a
                                                                        href={`tel:${job.assigned_worker.phone}`}
                                                                        className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline"
                                                                    >
                                                                        <Phone className="h-3.5 w-3.5" />
                                                                        {job.assigned_worker.phone}
                                                                    </a>
                                                                )}
                                                            </div>
                                                            {job.assigned_at && (
                                                                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                                                                    Assigned {format(new Date(job.assigned_at), "MMM d, yyyy 'at' h:mm a")}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Divider */}
                                            <div className="border-t border-border/30" />

                                            {/* Actions row */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => router.push(`/jobs/${job.id}`)}
                                                        className="h-9"
                                                    >
                                                        View Details
                                                    </Button>
                                                    {job.assigned_worker ? (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => router.push(`/jobs/${job.id}/matches`)}
                                                            className="h-9"
                                                        >
                                                            View All Quotes
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => router.push(`/jobs/${job.id}/matches`)}
                                                            className="h-9"
                                                        >
                                                            View Workers
                                                        </Button>
                                                    )}
                                                </div>

                                                {/* Match count if available */}
                                                {job.matches && job.matches.length > 0 && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {job.matches.length} {job.matches.length === 1 ? 'match' : 'matches'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create job dialog */}
            <CreateJobDialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
                onJobCreated={(jobId) => {
                    setMatchingJobId(jobId);
                }}
            />

            {/* Matching loading overlay */}
            {matchingJobId && <MatchingLoadingOverlay jobId={matchingJobId} />}
        </>
    );
}