import { SeedButton } from "@/components/dashboard/SeedButton";
import { SeedAIProfilesButton } from "@/components/dashboard/SeedAIProfilesButton";

export default function SeedPage() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Development Tools</h1>
                <p className="text-muted-foreground">
                    Seed the database with test data (dev only)
                </p>
            </div>

            <div className="max-w-md space-y-4">
                <div className="rounded-lg border p-6 space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Seed Workers</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add 6 test workers to the database (electricians, plumbers, carpenter)
                        </p>
                        <SeedButton />
                    </div>
                </div>

                <div className="rounded-lg border p-6 space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Seed AI Profiles</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Add AI profile data to existing workers (pricing, preferences, common jobs)
                        </p>
                        <SeedAIProfilesButton />
                    </div>
                </div>
            </div>
        </div>
    );
}