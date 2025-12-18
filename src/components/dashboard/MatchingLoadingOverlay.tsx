"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle } from "lucide-react";

interface MatchingLoadingOverlayProps {
    jobId: string;
}

export function MatchingLoadingOverlay({ jobId }: MatchingLoadingOverlayProps) {
    const router = useRouter();
    const [status, setStatus] = useState<"searching" | "found" | "error">("searching");
    const [matchCount, setMatchCount] = useState(0);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds max
        const pollInterval = 1000; // Check every 1 second

        const pollMatches = async () => {
            attempts++;
            console.log(`🔍 Polling attempt ${attempts}/${maxAttempts} for job ${jobId}`);

            try {
                const response = await fetch(`/api/matches?jobId=${jobId}`);
                const data = await response.json();

                if (data.matches && data.matches.length > 0) {
                    console.log(`✅ Found ${data.matches.length} matches!`);
                    setMatchCount(data.matches.length);
                    setStatus("found");

                    // Wait 2 seconds to show success message, then redirect
                    setTimeout(() => {
                        console.log(`🚀 Redirecting to /jobs/${jobId}/matches`);
                        router.push(`/jobs/${jobId}/matches`);
                    }, 2000);

                    return true; // Stop polling
                }

                // If we've tried enough times and still no matches, show error
                if (attempts >= maxAttempts) {
                    console.log(`❌ No matches found after ${maxAttempts} attempts`);
                    setStatus("error");
                    return true; // Stop polling
                }

                // Continue polling
                console.log(`⏳ No matches yet, will check again in ${pollInterval}ms`);
                setTimeout(pollMatches, pollInterval);

            } catch (error) {
                console.error("❌ Error polling matches:", error);
                if (attempts >= maxAttempts) {
                    setStatus("error");
                    return true;
                }
                setTimeout(pollMatches, pollInterval);
            }
        };

        // Start polling after a short delay to let the matching start
        const initialDelay = setTimeout(() => {
            pollMatches();
        }, 2000); // Wait 2 seconds before first check

        return () => {
            clearTimeout(initialDelay);
        };
    }, [jobId, router]);

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8">
                <div className="flex flex-col items-center text-center space-y-6">
                    {status === "searching" && (
                        <>
                            <Loader2 className="h-16 w-16 text-primary animate-spin" />
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">Finding Workers...</h3>
                                <p className="text-muted-foreground">
                                    Our AI is matching you with qualified tradespeople
                                </p>
                            </div>
                        </>
                    )}

                    {status === "found" && (
                        <>
                            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold">
                                    {matchCount} {matchCount === 1 ? "Worker" : "Workers"} Found!
                                </h3>
                                <p className="text-muted-foreground">Redirecting...</p>
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
}