"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            <AppHeader />

            <AppSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
            />

            <main
                className={cn(
                    "pt-14 min-h-screen transition-all duration-200 ease-in-out",
                    "md:pl-16", // Mobile: no left padding (sidebar overlays)
                    sidebarOpen ? "md:pl-56" : "md:pl-16" // Desktop: adjust for sidebar
                )}
            >
                <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}