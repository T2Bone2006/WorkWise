"use client";

import { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    ClipboardList,
    User,
} from "lucide-react";

const workerNavigation = [
    { name: "Dashboard", href: "/worker/dashboard", icon: LayoutDashboard },
    { name: "My Jobs", href: "/worker/dashboard/jobs", icon: ClipboardList },
    { name: "Profile", href: "/worker/dashboard/profile", icon: User },
];

export default function WorkerDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            <AppHeader logoutRedirect="/worker/login" />

            <AppSidebar
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                navigation={workerNavigation}
                basePath="/worker/dashboard"
            />

            <main
                className={cn(
                    "pt-14 min-h-screen transition-all duration-200 ease-in-out",
                    "md:pl-16",
                    sidebarOpen ? "md:pl-56" : "md:pl-16"
                )}
            >
                <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
