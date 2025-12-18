import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    DollarSign,
    CheckCircle,
    Clock,
} from "lucide-react";

export default async function WorkerProfilePage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/worker/login");
    }

    // Get worker record
    const { data: worker } = await supabase
        .from("workers")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!worker) {
        redirect("/worker/login");
    }

    // Get AI profile
    const { data: aiProfile } = await supabase
        .from("worker_ai_profiles")
        .select("*")
        .eq("worker_id", worker.id)
        .single();

    const formatTrade = (trade: string) => {
        return trade
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground mt-1">
                    Your worker profile and settings
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Personal Info Card */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Full Name</p>
                            <p className="font-medium">{worker.full_name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">{worker.email}</p>
                            </div>
                        </div>
                        {worker.phone && (
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{worker.phone}</p>
                                </div>
                            </div>
                        )}
                        {worker.base_postcode && (
                            <div>
                                <p className="text-sm text-muted-foreground">Location</p>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{worker.base_postcode}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Work Info Card */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Briefcase className="h-5 w-5" />
                        Work Information
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Trade</p>
                            <p className="font-medium">{formatTrade(worker.trade_type)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge
                                className={
                                    worker.status === "active"
                                        ? "bg-emerald-500"
                                        : "bg-yellow-500"
                                }
                            >
                                {worker.status === "active" ? (
                                    <>
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Active
                                    </>
                                ) : (
                                    <>
                                        <Clock className="h-3 w-3 mr-1" />
                                        Pending
                                    </>
                                )}
                            </Badge>
                        </div>
                        {worker.service_radius_miles && (
                            <div>
                                <p className="text-sm text-muted-foreground">Service Radius</p>
                                <p className="font-medium">{worker.service_radius_miles} miles</p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Rates Card */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Rates
                    </h2>
                    <div className="space-y-4">
                        {worker.hourly_rate && (
                            <div>
                                <p className="text-sm text-muted-foreground">Hourly Rate</p>
                                <p className="text-2xl font-bold text-primary">
                                    £{worker.hourly_rate}/hr
                                </p>
                            </div>
                        )}
                        {worker.day_rate && (
                            <div>
                                <p className="text-sm text-muted-foreground">Day Rate</p>
                                <p className="text-2xl font-bold text-primary">
                                    £{worker.day_rate}/day
                                </p>
                            </div>
                        )}
                        {worker.travel_fee_per_mile && (
                            <div>
                                <p className="text-sm text-muted-foreground">Travel Fee</p>
                                <p className="font-medium">
                                    £{worker.travel_fee_per_mile}/mile
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                {/* AI Profile Status Card */}
                <Card className="p-6">
                    <h2 className="text-lg font-semibold mb-4">AI Profile Status</h2>
                    {aiProfile?.interview_completed ? (
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                            <CheckCircle className="h-6 w-6 text-emerald-600" />
                            <div>
                                <p className="font-medium text-emerald-900 dark:text-emerald-100">
                                    Interview Completed
                                </p>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                                    Your AI profile is active and matching you with jobs
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg">
                            <Clock className="h-6 w-6 text-yellow-600" />
                            <div>
                                <p className="font-medium text-yellow-900 dark:text-yellow-100">
                                    Interview Pending
                                </p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Complete your AI interview to start receiving job matches
                                </p>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
