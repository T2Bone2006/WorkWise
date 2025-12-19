import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import 'react-day-picker/dist/style.css';
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "WorkWise - Property Maintenance Platform",
    description: "Connect with qualified tradespeople in under 2 hours",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster />
        </body>
        </html>
    );
}