"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Footer() {
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
                        <p className="text-gray-500 text-xs uppercase tracking-[0.2em] max-w-[280px] leading-relaxed">
                            La excelencia en licores premium y de barrio, directo a tu puerta en Quito.
                        </p>
                    </div>

                    {/* Contact Info - CRITICAL FOR GOOGLE */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6">Contacto Oficial</h3>
                        <div className="space-y-4 text-gray-400 text-xs font-medium uppercase tracking-widest">
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="material-symbols-outlined text-primary text-lg">location_on</span>
                                <span>Matriz Quito: Carcelén</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="material-symbols-outlined text-primary text-lg">phone</span>
                                <span>+593 96 406 5880</span>
                            </div>
                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                <span className="material-symbols-outlined text-primary text-lg">mail</span>
                                <span>info@lahuequitaquitena.com</span>
                            </div>
                        </div>
                    </div>

                    {/* Legal Links - CRITICAL FOR GOOGLE */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6">Transparencia Legal</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/politicas" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Política de Devoluciones</Link>
                            <Link href="/terminos" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Términos y Condiciones</Link>
                            <Link href="/privacidad" className="text-gray-400 text-[10px] uppercase tracking-[0.3em] hover:text-primary transition-colors">Aviso de Privacidad</Link>
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
