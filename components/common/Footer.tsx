"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useBranch } from "@/contexts/BranchContext";

export default function Footer() {
    const { selectedBranch, availableBranches } = useBranch();
    return (
        <footer className="relative bg-background-dark border-t border-white/5 pt-16 pb-24 md:pb-12 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="mb-6">
                            <img
                                src="/logo-icon.png"
                                alt="La Huequita Quiteña"
                                className="h-20 w-auto object-contain brightness-110 grayscale-[0.2] hover:grayscale-0 transition-all duration-500"
                            />
                        </Link>
                        <p className="text-gray-500 text-xs uppercase tracking-[0.2em] max-w-[280px] leading-relaxed mb-6">
                            La excelencia en licores premium y de barrio, directo a tu puerta en Quito.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 mb-4">
                            <a href="https://www.instagram.com/licorerialahuequitaquitena/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <span className="text-lg font-bold">Ig</span>
                            </a>
                            <a href="https://www.tiktok.com/@lahuequitaquitena" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <span className="text-lg font-bold">Tk</span>
                            </a>
                            <a href="https://facebook.com/lahuequitaquitena" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <span className="text-lg font-bold">Fb</span>
                            </a>
                            <a href={`https://wa.me/${selectedBranch?.telefono?.replace(/\D/g, '') || '593992660222'}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                                <span className="material-symbols-outlined text-lg">chat</span>
                            </a>
                        </div>
                    </div>

                    {/* Contact Info - CRITICAL FOR GOOGLE */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6">Contacto Oficial</h3>
                        <div className="space-y-4 text-gray-400 text-xs font-medium uppercase tracking-widest mb-6">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                <span className="max-w-[250px] leading-relaxed">
                                    {availableBranches.find(b => b.es_principal)?.direccion || "Carcelén, República Dominicana N78-130 y Hernando De Veas"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="material-symbols-outlined text-primary text-lg">phone</span>
                                <span>{availableBranches.find(b => b.es_principal)?.telefono || "+593 99 266 0222"}</span>
                            </div>
                            {/* Email removed as per user request to avoid miscommunication */}
                        </div>

                        {/* Payment Methods */}
                        <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-4">MÉTODOS DE PAGO</h3>
                        <div className="flex items-center gap-3 opacity-75">
                            <span className="text-[10px] uppercase text-gray-400 border border-white/10 px-2 py-1 rounded">Efectivo</span>
                            <span className="text-[10px] uppercase text-gray-400 border border-white/10 px-2 py-1 rounded">Transferencia</span>
                            <span className="text-[10px] uppercase text-gray-400 border border-white/10 px-2 py-1 rounded">Tarjeta (contra entrega)</span>
                        </div>
                    </div>

                    {/* Legal Links - CRITICAL FOR GOOGLE */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6">Transparencia Legal</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/politicas-de-envio" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Políticas de Envío</Link>
                            <Link href="/politicas" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Política de Devoluciones</Link>
                            <Link href="/terminos" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Términos y Condiciones</Link>
                            <Link href="/privacidad" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Aviso de Privacidad</Link>
                            <Link href="/contacto" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Contáctanos</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[9px] text-gray-600 uppercase tracking-[0.4em]">
                        &copy; {new Date().getFullYear()} La Huequita Quiteña. Todos los derechos reservados.
                    </p>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase tracking-widest">
                            <span className="material-symbols-outlined text-sm text-amber-500">warning</span>
                            <span className="font-bold">Venta Prohibida a Menores de 18 Años</span>
                        </div>
                        <p className="text-[8px] text-gray-600 uppercase tracking-wider max-w-md">
                            El consumo excesivo de alcohol es perjudicial para la salud. Beba con moderación.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background elements */}
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        </footer>
    );
}
