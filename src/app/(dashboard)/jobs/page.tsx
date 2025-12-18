import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobsList } from "@/components/dashboard/jobs-list";

export default async function JobsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: jobs } = await supabase
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
        .eq("client_id", user.id)
        .order("created_at", { ascending: false });

    return <JobsList initialJobs={jobs || []} />;
}