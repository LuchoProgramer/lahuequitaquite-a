"use client";

import React, { useState } from "react";
import { useBranch } from "@/contexts/BranchContext";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import Link from "next/link";
import BranchModal from "./BranchModal";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { selectedBranch } = useBranch();
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={onClose}
                            className="fixed inset-0 bg-background-dark/80 backdrop-blur-md z-[100]"
                        />

                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-background-dark border-r border-white/5 z-[110] flex flex-col shadow-2xl overflow-y-auto no-scrollbar"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary text-[24px]">local_bar</span>
                                    <span className="text-lg font-black uppercase tracking-tighter text-white font-display">La Huequita</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>

                            {/* Greeting */}
                            <div className="px-6 py-8">
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Bienvenido a</p>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">Tu Cava <br /><span className="text-primary italic font-display lowercase tracking-normal">Personal</span></h3>
                            </div>

                            {/* Branch Quick Switch - Triggering the Full Modal */}
                            <div className="px-6 mb-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-4">Ubicación Actual</h4>
                                <button
                                    onClick={() => {
                                        setIsBranchModalOpen(true);
                                        // No cerramos el menu para que la transicion sea suave al modal
                                    }}
                                    className="w-full flex items-center justify-between p-5 rounded-2xl border border-primary bg-primary/5 text-left transition-all active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <span className="material-symbols-outlined">location_on</span>
                                        </div>
                                        <div>
                                            <span className="block text-xs font-black uppercase tracking-tight text-white mb-0.5">
                                                {selectedBranch?.nombre}
                                            </span>
                                            <p className="text-[9px] text-primary font-black uppercase tracking-widest">Cambiar Sucursal</p>
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-gray-600">chevron_right</span>
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="px-6 flex flex-col gap-6 mb-10">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Explorar</h4>
                                <Link href="/productos" onClick={onClose} className="text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors flex items-center justify-between group">
                                    Catálogo General <span className="material-symbols-outlined text-gray-600 group-hover:text-primary transition-colors">arrow_forward</span>
                                </Link>
                                <Link href="/promociones" onClick={onClose} className="text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors flex items-center justify-between group">
                                    Ofertas Especiales <span className="material-symbols-outlined text-gray-600 group-hover:text-primary transition-colors">arrow_forward</span>
                                </Link>
                                <Link href="/favoritos" onClick={onClose} className="text-lg font-bold text-white uppercase tracking-tighter hover:text-primary transition-colors flex items-center justify-between group">
                                    Mis Favoritos <span className="material-symbols-outlined text-gray-600 group-hover:text-primary transition-colors">arrow_forward</span>
                                </Link>
                            </div>

                            {/* Footer */}
                            <div className="mt-auto p-6 bg-surface-dark/20 border-t border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                                        <Instagram size={18} />
                                    </button>
                                    <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                                        <MessageCircle size={18} />
                                    </button>
                                    <button className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-primary hover:border-primary transition-all">
                                        <Facebook size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Global Branch Modal */}
            <BranchModal
                isOpen={isBranchModalOpen}
                onClose={() => setIsBranchModalOpen(false)}
            />
        </>
    );
}
