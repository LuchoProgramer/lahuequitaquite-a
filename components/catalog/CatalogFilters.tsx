"use client";

import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CatalogFiltersProps {
    categories: { id: number; nombre: string }[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function CatalogFilters({
    categories,
    selectedCategory,
    onSelectCategory,
    searchQuery,
    onSearchChange,
}: CatalogFiltersProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Mobile Chips - Only visible on small screens */}
            <div className="md:hidden w-full overflow-x-auto no-scrollbar -mx-5 px-5">
                <div className="flex gap-3 min-w-max pb-2">
                    <button
                        onClick={() => onSelectCategory(null)}
                        className={cn(
                            "shrink-0 h-9 px-6 rounded-full text-sm font-bold transition-all",
                            selectedCategory === null ? "bg-primary text-background-dark shadow-lg shadow-primary/20" : "bg-white/5 border border-white/10 text-white/80"
                        )}
                    >
                        Todos
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.nombre)}
                            className={cn(
                                "shrink-0 h-9 px-6 rounded-full text-sm font-bold transition-all",
                                selectedCategory === cat.nombre ? "bg-primary text-background-dark shadow-lg shadow-primary/20" : "bg-white/5 border border-white/10 text-white/80"
                            )}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Sidebar Filters */}
            <div className="hidden md:flex flex-col gap-8 sticky top-32">
                {/* Search Bar */}
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-4">Buscar Selección</h4>
                    <div className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Whisky, Gin, Vino..."
                            className="w-full bg-surface-dark border border-white/5 px-4 py-3 text-sm text-white focus:border-primary/50 outline-none lux-transition rounded-lg"
                        />
                    </div>
                </div>

                {/* Categories List */}
                <div>
                    <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-primary mb-4">Categorías</h4>
                    <div className="flex flex-col space-y-3">
                        <button
                            onClick={() => onSelectCategory(null)}
                            className={cn(
                                "text-left text-xs uppercase tracking-[0.2em] lux-transition",
                                selectedCategory === null ? "text-primary font-bold" : "text-gray-500 hover:text-white"
                            )}
                        >
                            Todos los productos
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.nombre)}
                                className={cn(
                                    "text-left text-xs uppercase tracking-[0.2em] lux-transition",
                                    selectedCategory === cat.nombre ? "text-primary font-bold" : "text-gray-500 hover:text-white"
                                )}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
