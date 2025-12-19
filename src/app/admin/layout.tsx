import type { Metadata } from "next";
import { Suspense } from "react";

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
        <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen bg-background">
                {children}
            </div>
        </Suspense>
    );
}
