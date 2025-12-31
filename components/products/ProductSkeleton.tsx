import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
    );
}
