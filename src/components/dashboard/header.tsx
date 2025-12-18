"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/lib/supabase/auth-actions";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ClientData {
    full_name: string;
    email: string;
    company_name: string;
}

export function DashboardHeader() {
    const router = useRouter();
    const [clientData, setClientData] = useState<ClientData | null>(null);

    useEffect(() => {
        async function loadClientData() {
            const supabase = createClient();
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const { data } = await supabase
                    .from("b2b_clients")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (data) {
                    setClientData(data);
                }
            }
        }

        loadClientData();
    }, []);

    const handleLogout = async () => {
        toast.success("Logging out...");
        await logout();
    };

    // Get initials from full name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:top-0">
            <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
                {/* Search - hide on small mobile */}
                <div className="hidden sm:flex flex-1 items-center gap-4">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search jobs, workers..."
                            className="pl-9 bg-background"
                        />
                    </div>
                </div>

                {/* Spacer for mobile */}
                <div className="flex-1 sm:hidden" />

                {/* Right side actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
                    </Button>

                    {/* User menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {clientData ? getInitials(clientData.full_name) : "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {clientData?.full_name || "Loading..."}
                                    </p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {clientData?.email || ""}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.push("/settings")}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => toast.info("Billing coming soon")}
                            >
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}