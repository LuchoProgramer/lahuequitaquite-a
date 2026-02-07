"use client";

import React from "react";
import { motion } from "framer-motion";
import { useBranch } from "@/contexts/BranchContext";

export default function ContactoPage() {
    // Get branches from context
    const { availableBranches, loading } = useBranch();

    // Default coordinates for Quito if loading or no branches
    const DEFAULT_CENTER = { lat: -0.090261, lng: -78.4693293 };

    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
                        Contáctanos
                    </h1>
                    <div className="h-1 w-20 bg-primary rounded-full mx-auto" />
                    <p className="mt-6 text-gray-300 max-w-2xl mx-auto">
                        Estamos listos para atenderte. Visita nuestra matriz o contáctanos directamente para realizar tu pedido.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-8"
                    >
                        {loading ? (
                            <div className="animate-pulse space-y-4">
                                <div className="h-8 bg-white/5 rounded w-3/4"></div>
                                <div className="h-20 bg-white/5 rounded w-full"></div>
                                <div className="h-20 bg-white/5 rounded w-full"></div>
                            </div>
                        ) : (
                            <>
                                {/* Matriz - Legal Address */}
                                {availableBranches.filter(b => b.es_principal).map((sucursal) => (
                                    <div key={sucursal.id} className="bg-surface-dark p-6 rounded-2xl border border-primary/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-primary text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                                            Matriz
                                        </div>
                                        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">store</span>
                                            {sucursal.nombre}
                                        </h2>
                                        <div className="space-y-3 text-gray-300 text-sm">
                                            <p className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-primary mt-1">location_on</span>
                                                <span className="uppercase tracking-wide leading-relaxed">
                                                    {sucursal.direccion}
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-primary">phone</span>
                                                <span>{sucursal.telefono}</span>
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {/* Other Branches */}
                                {availableBranches.filter(b => !b.es_principal).map((sucursal) => (
                                    <div key={sucursal.id} className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2 opacity-80">
                                            <span className="material-symbols-outlined text-gray-400">storefront</span>
                                            {sucursal.nombre}
                                        </h2>
                                        <div className="space-y-3 text-gray-400 text-sm">
                                            <p className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-gray-500 mt-1">location_on</span>
                                                <span className="uppercase tracking-wide leading-relaxed">
                                                    {sucursal.direccion}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* General Contact Info */}
                        <div className="bg-surface-dark p-6 rounded-2xl border border-white/5">
                            <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">Atención al Cliente</h3>
                            <div className="space-y-4">
                                <a
                                    href="https://wa.me/593992660222"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 p-4 bg-green-600/10 border border-green-600/20 rounded-xl hover:bg-green-600/20 transition-all group"
                                >
                                    <span className="material-symbols-outlined text-green-500 text-3xl group-hover:scale-110 transition-transform">chat</span>
                                    <div>
                                        <p className="text-green-400 font-bold uppercase text-xs tracking-wider mb-1">WhatsApp Oficial</p>
                                        <p className="text-white font-bold text-lg">+593 99 266 0222</p>
                                    </div>
                                </a>

                                <div className="text-xs text-gray-500 mt-4 leading-relaxed">
                                    <p className="mb-2"><strong>Horarios de Atención:</strong></p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Lunes a Jueves: 14:00 - 00:00</li>
                                        <li>Viernes y Sábados: 14:00 - 02:00</li>
                                        <li>Domingos: 14:00 - 22:00</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Map Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="h-full min-h-[400px] bg-surface-dark rounded-2xl overflow-hidden border border-white/5 relative"
                    >
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0, filter: "grayscale(1) invert(0.9) contrast(1.2)" }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ""}&q=${DEFAULT_CENTER.lat},${DEFAULT_CENTER.lng}&zoom=15`}
                        >
                        </iframe>
                        {/* Fallback if no key (using standard embed for specific location if key is missing/invalid logic needed but for now simple iframe structure) 
                            Actually, standard embed without API key might not work well. 
                            Let's use a standard direct link embed or just a placeholder if no key.
                            For reliability without a key in this demo, I will use a direct standardized embed url for coordinates.
                        */}
                        <div className="absolute inset-0 pointer-events-none border border-white/10 rounded-2xl"></div>

                        {/* Overlay explanation if map doesn't load */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-300 text-center">
                                <span className="material-symbols-outlined align-middle mr-2 text-primary">map</span>
                                Ubicación Referencial: Sector Carcelén, Quito Norte
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
