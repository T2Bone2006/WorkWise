import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { JobResponseView } from "@/components/worker/JobResponseView";

export default async function JobResponsePage({
    params,
    searchParams,
}: {
    params: Promise<{ jobId: string }>;
    searchParams: Promise<{ action?: string }>;
}) {
    const { jobId } = await params;
    const { action } = await searchParams;
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect(`/worker/login?redirect=/worker/jobs/${jobId}/respond?action=${action}`);
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
    const { data: job } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .eq("assigned_worker_id", worker.id)
        .single();

    if (!job) {
        redirect("/worker/dashboard");
    }

    // Get client info
    const { data: client } = await supabase
        .from("b2b_clients")
        .select("company_name, full_name, email, phone")
        .eq("id", job.client_id)
        .single();

    // Get match info for cost
    const { data: match } = await supabase
        .from("worker_matches")
        .select("total_cost")
        .eq("job_id", jobId)
        .eq("worker_id", worker.id)
        .single();

    return (
        <JobResponseView
            job={{
                ...job,
                client: client || { company_name: "Unknown", full_name: "Unknown", email: "", phone: null },
            }}
            estimatedCost={match?.total_cost || 0}
            initialAction={action as "accept" | "decline" | undefined}
        />
    );
}
