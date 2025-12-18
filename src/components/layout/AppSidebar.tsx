"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    Briefcase,
    Settings,
    PanelLeftClose,
    PanelLeft,
    LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const defaultNavigation = [
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Settings", href: "/settings", icon: Settings },
];

interface NavItem {
    name: string;
    href: string;
    icon: LucideIcon;
}

interface AppSidebarProps {
    isOpen: boolean;
    onToggle: () => void;
    navigation?: NavItem[];
    basePath?: string;
}

export function AppSidebar({ isOpen, onToggle, navigation = defaultNavigation, basePath }: AppSidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        // If basePath provided, use exact match for base and prefix match for others
        if (basePath && href === basePath) {
            return pathname === basePath;
        }
        // For non-base paths, use startsWith
        if (basePath) {
            return pathname.startsWith(href);
        }
        // Default exact match
        return pathname === href || pathname.startsWith(href + "/");
    };

    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-14 z-40 h-[calc(100vh-3.5rem)] border-r border-border/40 bg-card transition-all duration-200 ease-in-out md:block",
                    isOpen ? "w-56" : "w-16",
                    "hidden md:block", // Hide on mobile, show toggle button instead
                    "will-change-[width]"
                )}
            >
                {/* Toggle button - properly centered */}
                <div className={cn(
                    "flex h-12 items-center border-b border-border/40",
                    isOpen ? "justify-end px-2" : "justify-center"
                )}>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent"
                        onClick={onToggle}
                        title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isOpen ? (
                            <PanelLeftClose className="h-4 w-4" />
                        ) : (
                            <PanelLeft className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Navigation - icons properly centered */}
                <nav className="flex flex-col gap-1 p-2">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={!isOpen ? item.name : undefined}
                                className={cn(
                                    "flex items-center rounded-md text-sm font-medium transition-colors",
                                    isOpen ? "gap-3 px-3 py-2" : "justify-center py-2",
                                    active
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                {isOpen && (
                                    <span className="truncate">{item.name}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Mobile: Hamburger menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed left-4 bottom-4 z-50 h-12 w-12 md:hidden bg-primary text-primary-foreground shadow-lg"
                onClick={onToggle}
            >
                {isOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </Button>

            {/* Mobile: Slide-out sidebar */}
            <aside
                className={cn(
                    "fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-56 border-r border-border/40 bg-card transition-transform duration-200 md:hidden",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <nav className="flex flex-col gap-1 p-2 mt-12">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={onToggle}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                <span className="truncate">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}