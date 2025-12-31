"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Badge({
    children,
    variant = "default",
    className
}: {
    children: React.ReactNode;
    variant?: "default" | "gold" | "outline";
    className?: string;
}) {
    const variants = {
        default: "bg-white/5 text-gray-400 border border-white/10",
        gold: "bg-primary/20 text-primary border border-primary/30 font-black backdrop-blur-sm",
        outline: "border border-primary text-primary font-black",
    };

    return (
        <span className={cn(
            "px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] inline-block rounded-md",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}
