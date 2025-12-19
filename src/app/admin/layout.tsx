import type { Metadata } from "next";
import { ThemeProvider } from "@/components/workwise/theme-provider";
import {Suspense} from "react";


export const metadata: Metadata = {
    title: "Admin - WorkWise",
    description: "WorkWise Admin Dashboard",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen bg-background">
                {children}
            </div>
            </Suspense>
        </ThemeProvider>
    );
}
