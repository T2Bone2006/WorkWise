"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Building2,
    Briefcase,
    Users,
    BarChart3,
    Settings,
    HelpCircle,
    Menu,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Workers", href: "/workers", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

const secondaryNavigation = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help", href: "/help", icon: HelpCircle },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-card px-4 py-4 shadow-sm sm:px-6 lg:hidden border-b border-border">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(true)}
                    className="-m-2.5"
                >
                    <span className="sr-only">Open sidebar</span>
                    <Menu className="h-6 w-6" aria-hidden="true" />
                </Button>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-semibold">WorkWise</span>
                </div>
            </div>

            {/* Mobile sidebar */}
            <div
                className={cn(
                    "relative z-50 lg:hidden",
                    mobileMenuOpen ? "block" : "hidden"
                )}
                role="dialog"
                aria-modal="true"
            >
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />

                {/* Sidebar panel */}
                <div className="fixed inset-0 flex">
                    <div className="relative mr-16 flex w-full max-w-xs flex-1">
                        {/* Close button */}
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileMenuOpen(false)}
                                className="-m-2.5"
                            >
                                <span className="sr-only">Close sidebar</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                            </Button>
                        </div>

                        {/* Sidebar content */}
                        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 ring-1 ring-border">
                            {/* Logo */}
                            <div className="flex h-16 shrink-0 items-center gap-2">
                                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <span className="text-xl font-semibold">WorkWise</span>
                            </div>

                            {/* Navigation */}
                            <nav className="flex flex-1 flex-col">
                                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                    {/* Primary navigation */}
                                    <li>
                                        <ul role="list" className="-mx-2 space-y-1">
                                            {navigation.map((item) => {
                                                const isActive = pathname === item.href;
                                                return (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className={cn(
                                                                "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                                                                isActive
                                                                    ? "bg-secondary text-secondary-foreground"
                                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                                            )}
                                                        >
                                                            <item.icon
                                                                className={cn(
                                                                    "h-5 w-5 shrink-0",
                                                                    isActive ? "text-secondary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>

                                    {/* Secondary navigation */}
                                    <li className="mt-auto">
                                        <ul role="list" className="-mx-2 space-y-1">
                                            {secondaryNavigation.map((item) => {
                                                const isActive = pathname === item.href;
                                                return (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setMobileMenuOpen(false)}
                                                            className={cn(
                                                                "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                                                                isActive
                                                                    ? "bg-secondary text-secondary-foreground"
                                                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                                            )}
                                                        >
                                                            <item.icon
                                                                className={cn(
                                                                    "h-5 w-5 shrink-0",
                                                                    isActive ? "text-secondary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                                                )}
                                                                aria-hidden="true"
                                                            />
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
                    {/* Logo */}
                    <div className="flex h-16 shrink-0 items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-semibold">WorkWise</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            {/* Primary navigation */}
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                                                        isActive
                                                            ? "bg-secondary text-secondary-foreground"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            "h-5 w-5 shrink-0",
                                                            isActive ? "text-secondary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>

                            {/* Secondary navigation */}
                            <li className="mt-auto">
                                <ul role="list" className="-mx-2 space-y-1">
                                    {secondaryNavigation.map((item) => {
                                        const isActive = pathname === item.href;
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        "group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors",
                                                        isActive
                                                            ? "bg-secondary text-secondary-foreground"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            "h-5 w-5 shrink-0",
                                                            isActive ? "text-secondary-foreground" : "text-muted-foreground group-hover:text-foreground"
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}