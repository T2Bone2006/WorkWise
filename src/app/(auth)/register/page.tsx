import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex relative">
            {/* Theme Toggle - Top Right */}
            <ThemeToggle className="absolute top-4 right-4 z-10" />

            {/* Left side - Register Form */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
                <div className="w-full max-w-md space-y-8 animate-fade-in">
                    {/* Logo */}
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-semibold">WorkWise</span>
                        </div>
                        <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight">
                            Start your free trial
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Get started with WorkWise today. No credit card required.
                        </p>
                    </div>

                    {/* Register Form */}
                    <RegisterForm />

                    {/* Sign in link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-primary hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right side - Benefits */}
            <div className="hidden lg:flex lg:flex-1 bg-muted items-center justify-center p-12">
                <div className="max-w-md space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center rounded-lg bg-success/10 px-3 py-1 text-sm font-medium text-success">
                            3 months free • No credit card
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight">
                            Everything you need to manage maintenance
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Join property managers who've saved 15+ hours per week with WorkWise.
                        </p>
                    </div>

                    {/* Benefits list */}
                    <div className="space-y-4">
                        {[
                            {
                                title: "2-hour response time",
                                description: "Get qualified tradespeople matched to your jobs instantly"
                            },
                            {
                                title: "One dashboard",
                                description: "Track all jobs, workers, and costs in one place"
                            },
                            {
                                title: "Compliance tracking",
                                description: "Never miss certification renewals again"
                            },
                            {
                                title: "Fair pricing",
                                description: "Transparent day rates, no hidden markups"
                            }
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="mt-1 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="h-3 w-3 text-primary"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={3}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{benefit.title}</p>
                                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}