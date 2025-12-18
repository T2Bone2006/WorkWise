"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { seedAIProfiles } from "@/lib/supabase/seed-ai-profiles";

export function SeedAIProfilesButton() {
    const [isPending, startTransition] = useTransition();

    const handleSeed = () => {
        startTransition(async () => {
            const result = await seedAIProfiles();

            if (result.error) {
                toast.error("Failed to seed AI profiles", {
                    description: result.error,
                });
                return;
            }

            toast.success("AI profiles seeded successfully!", {
                description: `Added AI profile data for ${result.count} workers`,
            });
        });
    };

    return (
        <Button onClick={handleSeed} disabled={isPending}>
            {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding...
                </>
            ) : (
                "Seed AI Profiles"
            )}
        </Button>
    );
}