import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import WorkerMapClient from "@/components/admin/WorkerMapClient";

export default async function AdminMapPage() {
    const supabase = await createClient();

    const { data: workers, error } = await supabase
        .from("worker_waitlist")
        .select("id, full_name, trade_type, postcode, created_at")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching workers:", error);
    }

    return (
        <div className="min-h-screen bg-background">
            <AdminHeader title="Worker Signups Map" />
            <WorkerMapClient workers={workers || []} />
        </div>
    );
}
