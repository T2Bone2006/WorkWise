"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { seedWorkers } from "@/lib/supabase/seed-workers";

export function SeedButton() {
    const [isPending, startTransition] = useTransition();

    const handleSeed = () => {
        startTransition(async () => {
            const result = await seedWorkers();

            if (result?.error) {
                toast.error("Failed to seed workers", {
                    description: result.error,
                });
                return;
            }

            toast.success("Workers seeded successfully!", {
                description: `Added ${result.count} workers to the database`,
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
                "Seed Workers"
            )}
        </Button>
    );
}