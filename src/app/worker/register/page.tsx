import Link from "next/link";
import { WorkerRegisterForm } from "@/components/forms/WorkerRegisterForm";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function WorkerRegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
            {/* Theme Toggle - Top Right */}
            <ThemeToggle className="absolute top-4 right-4" />

            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Join WorkWise</h1>
                    <p className="text-muted-foreground">
                        Create your tradesperson account and start getting quality work
                    </p>
                </div>

                {/* Register form */}
                <div className="bg-card rounded-lg border p-8 shadow-sm">
                    <WorkerRegisterForm />
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/worker/login"
                        className="font-medium text-primary hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}