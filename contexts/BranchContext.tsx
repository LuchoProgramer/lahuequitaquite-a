"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Sucursal } from "@/lib/types";
import { fetchSucursales } from "@/lib/api";

interface BranchContextType {
    selectedBranch: Sucursal | null;
    changeBranch: (branch: Sucursal) => void;
    availableBranches: Sucursal[];
    loading: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: React.ReactNode }) {
    const [selectedBranch, setSelectedBranch] = useState<Sucursal | null>(null);
    const [availableBranches, setAvailableBranches] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🐛 [BranchProvider] MOUNTING/EFFECT TRIGGERED");
        async function loadBranches() {
            try {
                console.log("🚀 [BranchProvider] Fetching sucursales...");
                const { data } = await fetchSucursales();
                console.log("✅ [BranchProvider] Fetched:", data.length, "branches");
                setAvailableBranches(data);

                // Cargar selección previa de localStorage
                const savedBranchId = localStorage.getItem("la-huequita-branch-id");
                if (savedBranchId) {
                    const found = data.find(b => b.id.toString() === savedBranchId);
                    if (found) setSelectedBranch(found);
                } else {
                    // Por defecto la principal
                    const principal = data.find(b => b.es_principal) || data[0];
                    if (principal) setSelectedBranch(principal);
                }
            } catch (err) {
                console.error("Error loading sucursales", err);
            } finally {
                setLoading(false);
            }
        }
        loadBranches();
    }, []);

    const changeBranch = (branch: Sucursal) => {
        setSelectedBranch(branch);
        localStorage.setItem("la-huequita-branch-id", branch.id.toString());
        // Opcionalmente recargar la página para asegurar que los datos del servidor se refresquen
        // window.location.reload(); 
    };

    return (
        <BranchContext.Provider value={{
            selectedBranch,
            changeBranch,
            availableBranches,
            loading
        }}>
            {children}
        </BranchContext.Provider>
    );
}

export function useBranch() {
    const context = useContext(BranchContext);
    if (context === undefined) {
        throw new Error("useBranch must be used within a BranchProvider");
    }
    return context;
}
