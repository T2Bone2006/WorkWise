"use client";

import dynamic from "next/dynamic";

type Worker = {
    id: string;
    full_name: string;
    trade_type: string;
    postcode: string;
    created_at: string;
};

const WorkerMap = dynamic(() => import("./WorkerMap"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
        </div>
    ),
});

export default function WorkerMapClient({ workers }: { workers: Worker[] }) {
    return <WorkerMap workers={workers} />;
}
