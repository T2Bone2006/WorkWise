"use client";

import Link from "next/link";
import { ArrowLeft, Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {useEffect, useState} from "react";

interface AdminHeaderProps {
    title: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // 👈 THIS FIXES HYDRATION



    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
    };

    return (
        <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Link
                    href="/workwise/workers"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Landing</span>
                </Link>
                <div className="h-6 w-px bg-border" />
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                    aria-label="Toggle theme"
                >
                    {theme === "dark" ? (
                        <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                        <Moon className="h-5 w-5 text-blue-500" />
                    )}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                    aria-label="Logout"
                >
                    <LogOut className="h-5 w-5 text-muted-foreground" />
                </button>

                {/* Logo */}
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-lg font-bold text-white">W</span>
                </div>
            </div>
        </header>
    );
}
