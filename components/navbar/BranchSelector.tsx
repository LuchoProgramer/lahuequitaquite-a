"use client";

import React, { useState } from "react";
import { useBranch } from "@/contexts/BranchContext";
import BranchModal from "./BranchModal";

export default function BranchSelector() {
    const { selectedBranch, availableBranches, loading } = useBranch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (loading || availableBranches.length <= 1) return null;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-primary transition-all border border-white/5 px-4 py-2 bg-white/5 rounded-lg active:scale-95"
            >
                <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                <span className="max-w-[150px] truncate">{selectedBranch?.nombre || "Cargando..."}</span>
                <span className="material-symbols-outlined text-[16px] opacity-40">unfold_more</span>
            </button>

            <BranchModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}
