import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
                        <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>

                    <h1 className="text-3xl font-bold mb-3">You're on the list!</h1>
                    <p className="text-lg text-muted-foreground">
                        Check your email for confirmation. We'll notify you when we launch in your area.
                    </p>
                </div>

                <div className="space-y-4 bg-card border border-border/30 rounded-lg p-6 mb-8">
                    <div className="flex items-start gap-3 text-left">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                            1
                        </div>
                        <div>
                            <p className="font-medium mb-1">Check your email</p>
                            <p className="text-sm text-muted-foreground">
                                We've sent you a confirmation email with next steps
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 text-left">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                            2
                        </div>
                        <div>
                            <p className="font-medium mb-1">We'll be in touch</p>
                            <p className="text-sm text-muted-foreground">
                                You'll get an email when we're ready to launch in your area
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 text-left">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                            3
                        </div>
                        <div>
                            <p className="font-medium mb-1">Start working</p>
                            <p className="text-sm text-muted-foreground">
                                Complete your AI interview and start getting matched with jobs
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Link href="/workwise/workers">
                        <Button variant="outline" className="w-full">
                            ← Back to Landing Page
                        </Button>
                    </Link>

                    <p className="text-xs text-muted-foreground">
                        Know other tradespeople? Share WorkWise with them!
                    </p>
                </div>
            </div>
        </div>
    );
}
