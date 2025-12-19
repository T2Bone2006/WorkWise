import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { InterviewChat } from "@/components/worker/InterviewChat";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function OnboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/worker/login");
    }

    // Get worker data
    const { data: worker } = await supabase
        .from("workers")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!worker) {
        redirect("/worker/login");
    }

    // Check if already completed
    const { data: profile } = await supabase
        .from("worker_ai_profiles")
        .select("*")
        .eq("worker_id", worker.id)
        .single();

    if (profile?.interview_completed) {
        redirect("/worker/dashboard");
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
            {/* Theme Toggle - Top Right */}
            <ThemeToggle className="absolute top-4 right-4" />

            <div className="w-full max-w-3xl">
                <InterviewChat worker={worker} />
            </div>
        </div>
    );
}