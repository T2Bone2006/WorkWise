import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { WorkerDashboardView } from "@/components/worker/WorkerDashboardView";

export default async function WorkerDashboardPage() {
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

    // Get worker AI profile to check interview status
    const { data: aiProfile } = await supabase
        .from("worker_ai_profiles")
        .select("interview_completed")
        .eq("worker_id", worker.id)
        .single();

    // Get stats - count pending (assigned) and in-progress jobs separately
    const { count: pendingCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("assigned_worker_id", worker.id)
        .eq("status", "assigned");

    const { count: inProgressCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("assigned_worker_id", worker.id)
        .eq("status", "in_progress");

    const { count: completedCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("assigned_worker_id", worker.id)
        .eq("status", "completed");

    // Get pending jobs (awaiting acceptance)
    const { data: pendingJobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("assigned_worker_id", worker.id)
        .eq("status", "assigned")
        .order("assigned_at", { ascending: false })
        .limit(5);

    // Get active jobs (in progress)
    const { data: activeJobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("assigned_worker_id", worker.id)
        .eq("status", "in_progress")
        .order("assigned_at", { ascending: false })
        .limit(5);

    // Fetch client and quote data for pending jobs
    const pendingJobsWithDetails = await Promise.all(
        (pendingJobs || []).map(async (job) => {
            const [clientResult, matchResult] = await Promise.all([
                supabase
                    .from("b2b_clients")
                    .select("company_name, full_name, email, phone")
                    .eq("id", job.client_id)
                    .single(),
                supabase
                    .from("worker_matches")
                    .select("total_cost")
                    .eq("job_id", job.id)
                    .eq("worker_id", worker.id)
                    .single()
            ]);
            return {
                ...job,
                client: clientResult.data || { company_name: "Unknown", full_name: "Unknown", email: "", phone: null },
                quote: matchResult.data?.total_cost || null
            };
        })
    );

    // Fetch client and quote data for active jobs
    const activeJobsWithDetails = await Promise.all(
        (activeJobs || []).map(async (job) => {
            const [clientResult, matchResult] = await Promise.all([
                supabase
                    .from("b2b_clients")
                    .select("company_name, full_name, email, phone")
                    .eq("id", job.client_id)
                    .single(),
                supabase
                    .from("worker_matches")
                    .select("total_cost")
                    .eq("job_id", job.id)
                    .eq("worker_id", worker.id)
                    .single()
            ]);
            return {
                ...job,
                client: clientResult.data || { company_name: "Unknown", full_name: "Unknown", email: "", phone: null },
                quote: matchResult.data?.total_cost || null
            };
        })
    );

    return (
        <WorkerDashboardView
            worker={worker}
            interviewCompleted={aiProfile?.interview_completed || false}
            stats={{
                pending: pendingCount || 0,
                active: inProgressCount || 0,
                completed: completedCount || 0,
            }}
            pendingJobs={pendingJobsWithDetails}
            activeJobs={activeJobsWithDetails}
        />
    );
}
