import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Building2 } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex relative">
            {/* Theme Toggle - Top Right */}
            <ThemeToggle className="absolute top-4 right-4 z-10" />

            {/* Left side - Login Form */}
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
                            Welcome back
                        </h2>
                        <p className="mt-2 text-center text-sm text-muted-foreground">
                            Sign in to your property management dashboard
                        </p>
                    </div>

                    {/* Login Form */}
                    <LoginForm />

                    {/* Sign up link */}
                    <p className="text-center text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium text-primary hover:underline"
                        >
                            Start free trial
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right side - Feature showcase (hidden on mobile) */}
            <div className="hidden lg:flex lg:flex-1 bg-muted items-center justify-center p-12">
                <div className="max-w-md space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                            Trusted by 500+ Property Managers
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight">
                            Coordinate maintenance in under 2 hours
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Stop wasting time calling contractors. Connect with qualified tradespeople instantly.
                        </p>
                    </div>

                    {/* Features list */}
                    <div className="space-y-4">
                        {[
                            "2-hour response time guarantee",
                            "Verified tradespeople network",
                            "Real-time job tracking",
                            "Compliance certification tracking",
                        ].map((feature, i) => (
                            <div key={i} className="flex items-start gap-3 animate-slide-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="mt-1 h-5 w-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="h-3 w-3 text-success"
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
                                <p className="text-sm text-foreground">{feature}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}