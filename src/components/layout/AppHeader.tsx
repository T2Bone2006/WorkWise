"use client";

import { Button } from "@/components/ui/button";
import { Bell, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AppHeaderProps {
    logoutRedirect?: string;
    onMenuClick?: () => void;
    userName?: string;
}

export function AppHeader({ logoutRedirect = "/login" }: AppHeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push(logoutRedirect);
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <div className="flex h-14 items-center justify-between px-4">
                {/* Left side - Logo only, no burger menu */}
                <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary" />
                    <span className="font-semibold text-sm">WorkWise</span>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Bell className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Settings className="h-4 w-4" />
                    </Button>

                    <div className="h-6 w-px bg-border/40 mx-2" />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9"
                        onClick={handleSignOut}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </header>
    );
}