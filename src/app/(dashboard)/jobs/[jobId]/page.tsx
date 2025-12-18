import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobDetailsView } from "@/components/dashboard/JobDetailsView";

export default async function JobDetailsPage({
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
        redirect("/login");
    }

    const { data: job } = await supabase
        .from("jobs")
        .select(`
            *,
            assigned_worker:workers!jobs_assigned_worker_id_fkey(
                id,
                full_name,
                email,
                phone,
                trade_type
            )
        `)
        .eq("id", jobId)
        .eq("client_id", user.id)
        .single();

    if (!job) {
        redirect("/jobs");
    }

    return <JobDetailsView job={job} />;
}
