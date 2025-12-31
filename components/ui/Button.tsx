"use client";

import React from "react";
import { Slot } from "@radix-ui/react-slot";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "outline" | "ghost" | "gold" | "secondary";
    size?: "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const variants = {
            primary: "bg-primary text-background-dark hover:bg-primary/90",
            outline: "border border-white/20 text-white hover:border-primary hover:text-primary",
            ghost: "text-white hover:bg-white/5",
            gold: "bg-primary text-background-dark font-black hover:bg-primary/90 shadow-[0_5px_20px_rgba(238,189,43,0.3)]",
            secondary: "bg-surface-dark text-white border border-white/5 hover:border-white/10",
        };

        const sizes = {
            sm: "px-4 py-2 text-[10px]",
            md: "px-8 py-4 text-xs",
            lg: "px-12 py-5 text-sm",
            icon: "p-2",
        };

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center uppercase tracking-[0.2em] font-black transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
