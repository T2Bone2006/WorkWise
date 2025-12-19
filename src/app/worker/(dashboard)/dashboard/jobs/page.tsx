import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MyJobsView } from "@/components/worker/MyJobsView";

export default async function MyJobsPage() {
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

    // Get all jobs assigned to this worker (pending acceptance, active, and completed)
    // Don't require worker_matches - job might be directly assigned
    const { data: jobs, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("assigned_worker_id", worker.id)
        .in("status", ["assigned", "in_progress", "completed"])
        .order("assigned_at", { ascending: false });

    if (error) {
        console.error("Error fetching jobs:", error);
    }

    // Fetch client and match data for each job
    const jobsWithDetails = await Promise.all(
        (jobs || []).map(async (job) => {
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

    return <MyJobsView jobs={jobsWithDetails} workerId={worker.id} />;
}
