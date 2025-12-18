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

    // Get stats - only count jobs where client has assigned this worker
    const { count: activeCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("assigned_worker_id", worker.id)
        .eq("status", "assigned");

    const { count: completedCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("assigned_worker_id", worker.id)
        .eq("status", "completed");

    // Get active jobs (assigned by client to this worker)
    const { data: activeJobs } = await supabase
        .from("jobs")
        .select("*")
        .eq("assigned_worker_id", worker.id)
        .eq("status", "assigned")
        .order("assigned_at", { ascending: false })
        .limit(5);

    // Fetch client data separately for each job
    const activeJobsWithClients = await Promise.all(
        (activeJobs || []).map(async (job) => {
            const { data: client } = await supabase
                .from("b2b_clients")
                .select("company_name, full_name, email, phone")
                .eq("id", job.client_id)
                .single();
            return { ...job, client: client || { company_name: "Unknown", full_name: "Unknown", email: "", phone: null } };
        })
    );

    return (
        <WorkerDashboardView
            worker={worker}
            interviewCompleted={aiProfile?.interview_completed || false}
            stats={{
                active: activeCount || 0,
                completed: completedCount || 0,
            }}
            activeJobs={activeJobsWithClients}
        />
    );
}
