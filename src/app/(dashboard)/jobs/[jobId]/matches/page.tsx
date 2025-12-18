import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MatchesView } from "@/components/dashboard/MatchesView";

export default async function MatchesPage({
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
        .select("*")
        .eq("id", jobId)
        .single();

    const { data: matches } = await supabase
        .from("worker_matches")
        .select(`
      *,
      worker:workers(*)
    `)
        .eq("job_id", jobId)
        .order("match_score", { ascending: false });

    if (!job) {
        redirect("/jobs");
    }

    return <MatchesView job={job} matches={matches || []} />;
}