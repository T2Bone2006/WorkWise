import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JobDetailsView } from "@/components/worker/JobDetailsView";

export default async function WorkerJobDetailsPage({
    params,
}: {
    params: Promise<{ jobId: string }>;
}) {
    const { jobId } = await params;
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

    // Get job assigned to this worker
    const { data: job, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("assigned_worker_id", worker.id)
        .single();

    if (error || !job) {
        redirect("/worker/dashboard/jobs");
    }

    // Get client info
    const { data: client } = await supabase
        .from("b2b_clients")
        .select("company_name, full_name, email, phone")
        .eq("id", job.client_id)
        .single();

    // Get match info for this worker (if exists)
    const { data: match } = await supabase
        .from("worker_matches")
        .select("total_cost, status, ai_reasoning")
        .eq("job_id", jobId)
        .eq("worker_id", worker.id)
        .single();

    return (
        <JobDetailsView
            job={{
                ...job,
                client: client || { company_name: "Unknown", full_name: "Unknown", email: "", phone: null },
            }}
            match={match || null}
        />
    );
}
