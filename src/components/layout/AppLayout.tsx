"use client";

import { useState } from "react";
import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
    children: React.ReactNode;
    userName?: string;
}

export function AppLayout({ children, userName }: AppLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            <AppHeader
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                userName={userName}
            />

            <AppSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <main
                className={cn(
                    "pt-14 transition-all duration-300",
                    sidebarOpen ? "lg:pl-56" : "lg:pl-16"
                )}
            >
                <div className="container max-w-7xl mx-auto p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}