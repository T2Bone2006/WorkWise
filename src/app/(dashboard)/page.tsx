import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Briefcase, Clock, PoundSterling, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get stats
    const { data: jobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("client_id", user.id);

    const activeJobs = jobs?.filter(j => j.status === 'in_progress')?.length || 0;
    const pendingJobs = jobs?.filter(j => j.status === 'pending')?.length || 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                    Welcome back! Here's an overview of your maintenance operations.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6 border-border/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Briefcase className="h-5 w-5 text-blue-500" />
                        </div>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Active Jobs</p>
                        <p className="text-3xl font-bold">{activeJobs}</p>
                    </div>
                </Card>

                <Card className="p-6 border-border/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Clock className="h-5 w-5 text-orange-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Pending Quotes</p>
                        <p className="text-3xl font-bold">{pendingJobs}</p>
                    </div>
                </Card>

                <Card className="p-6 border-border/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <PoundSterling className="h-5 w-5 text-green-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">This Month</p>
                        <p className="text-3xl font-bold">£4,250</p>
                    </div>
                </Card>

                <Card className="p-6 border-border/30">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Clock className="h-5 w-5 text-purple-500" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Avg Response</p>
                        <p className="text-3xl font-bold">45s</p>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="p-6 border-border/30">
                <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                <p className="text-muted-foreground text-sm">No recent activity</p>
            </Card>
        </div>
    );
}