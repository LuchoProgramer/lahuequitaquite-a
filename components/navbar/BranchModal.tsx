"use client";

import React, { useState, useMemo } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Check, Navigation, Clock, Phone, Loader2 } from "lucide-react";

interface BranchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BranchModal({ isOpen, onClose }: BranchModalProps) {
    const { selectedBranch, availableBranches, changeBranch } = useBranch();
    const [search, setSearch] = useState("");
    const [isLocating, setIsLocating] = useState(false);

    const filteredBranches = useMemo(() => {
        return availableBranches.filter(b =>
            b.nombre.toLowerCase().includes(search.toLowerCase()) ||
            (b.direccion && b.direccion.toLowerCase().includes(search.toLowerCase()))
        );
    }, [availableBranches, search]);

    // Función Haversine para calcular distancia en KM
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Radio de la Tierra en KM
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const handleGeoLocation = () => {
        if (!navigator.geolocation) {
            alert("Tu navegador no soporta geolocalización.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                // Si las sucursales no tienen lat/lng, simulamos coordenadas para Quito
                // En producción, estas vendrían del API
                const branchesWithCoords = availableBranches.map(b => ({
                    ...b,
                    lat: b.lat ?? -0.1807 + (Math.random() - 0.5) * 0.1,
                    lng: b.lng ?? -78.4678 + (Math.random() - 0.5) * 0.1
                }));

                const sorted = [...branchesWithCoords].sort((a, b) => {
                    const distA = calculateDistance(latitude, longitude, a.lat, a.lng);
                    const distB = calculateDistance(latitude, longitude, b.lat, b.lng);
                    return distA - distB;
                });

                const closest = sorted[0];
                if (closest) {
                    setTimeout(() => {
                        changeBranch(closest);
                        setIsLocating(false);
                        onClose();
                    }, 800);
                }
            },
            (error) => {
                console.error("Error geolocating", error);
                setIsLocating(false);
                alert("No pudimos obtener tu ubicación. Por favor selecciona una sucursal manualmente.");
            },
            { enableHighAccuracy: true, timeout: 5000 }
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[210] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto flex flex-col max-h-[85vh]"
                        >
                            {/* Header */}
                            <div className="p-8 border-b border-white/5">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter leading-none mb-2">Selecciona tu <br /><span className="text-primary italic font-display lowercase tracking-normal">Sucursal</span></h2>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Precios y disponibilidad según tu ubicación</p>
                                    </div>
                                    <button onClick={onClose} className="p-3 rounded-full hover:bg-white/5 text-gray-400 transition-all">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                {/* Actions Row */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-grow">
                                        <input
                                            type="text"
                                            placeholder="Busca por sector o nombre..."
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-12 py-4 text-sm text-white focus:border-primary/50 outline-none transition-all"
                                            autoFocus
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
                                    </div>
                                    <button
                                        onClick={handleGeoLocation}
                                        disabled={isLocating}
                                        className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-background-dark transition-all active:scale-95 shrink-0 disabled:opacity-50"
                                    >
                                        {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                                        {isLocating ? "Buscando..." : "Cercano a mí"}
                                    </button>
                                </div>
                            </div>

                            {/* Branch List */}
                            <div className="flex-grow overflow-y-auto no-scrollbar p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredBranches.length > 0 ? (
                                        filteredBranches.map((branch) => {
                                            const isSelected = selectedBranch?.id === branch.id;
                                            return (
                                                <button
                                                    key={branch.id}
                                                    onClick={() => {
                                                        changeBranch(branch);
                                                        onClose();
                                                    }}
                                                    className={`flex flex-col p-6 rounded-2xl border transition-all text-left group relative hover:shadow-2xl hover:shadow-primary/5 ${isSelected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-background-dark' : 'bg-white/5 text-primary'}`}>
                                                            <MapPin className="w-5 h-5" />
                                                        </div>
                                                        {isSelected && (
                                                            <div className="bg-primary/20 text-primary px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                                                Seleccionado
                                                            </div>
                                                        )}
                                                    </div>

                                                    <h3 className={`text-lg font-bold uppercase tracking-tight mb-2 ${isSelected ? 'text-primary' : 'text-white'}`}>
                                                        {branch.nombre}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 font-medium leading-relaxed mb-6 group-hover:text-gray-300 transition-colors uppercase tracking-widest line-clamp-2">
                                                        {branch.direccion}
                                                    </p>

                                                    <div className="mt-auto pt-6 border-t border-white/5 flex items-center gap-4 text-gray-600">
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest">Abierto</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" />
                                                            <span className="text-[9px] font-bold uppercase tracking-widest">Llamar</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full py-20 text-center">
                                            <p className="text-gray-500 text-sm uppercase font-black tracking-[0.2em]">No se encontraron sucursales</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Banner */}
                            <div className="p-4 bg-primary text-center">
                                <p className="text-background-dark text-[10px] font-black uppercase tracking-[0.3em]">Envios a todo Quito en menos de 60 minutos</p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
