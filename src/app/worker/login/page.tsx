import Link from "next/link";
import { WorkerLoginForm } from "@/components/forms/WorkerLoginForm";

export default function WorkerLoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-muted-foreground">
                        Sign in to your tradesperson account
                    </p>
                </div>

                {/* Login form */}
                <div className="bg-card rounded-lg border p-8 shadow-sm">
                    <WorkerLoginForm />
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                        href="/worker/register"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}