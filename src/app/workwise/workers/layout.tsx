import { ThemeProvider } from "@/components/workwise/theme-provider";
import "@/app/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "WorkWise - For Tradespeople",
    description: "Get matched with property managers. Zero commission. Zero fees.",
};

export default function WorkersRootLayout({
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
            {children}
        </ThemeProvider>
    );
}