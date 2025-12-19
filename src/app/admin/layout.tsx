import type { Metadata } from "next";
import { ThemeProvider } from "@/components/workwise/theme-provider";


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
            <div className="min-h-screen bg-background">
                {children}
            </div>
        </ThemeProvider>
    );
}
