"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Background with Dark Overlay */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black z-10" />
                <img
                    src="/hero-liquor.jpg"
                    alt="Licores Premium La Huequita"
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Hero Content */}
            <div className="relative z-20 text-center px-6 max-w-4xl">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-accent uppercase tracking-[0.4em] text-xs font-bold mb-4 block"
                >
                    Desde 1990 • Quito, Ecuador
                </motion.span>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight italic"
                >
                    El espíritu de la ciudad en <br />
                    <span className="text-gold-gradient non-italic font-bold">una selección única</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light"
                >
                    De barrio por tradición, premium por elección. Descubre nuestra curaduría
                    de licores nacionales e importados con entrega inmediata.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link
                        href="/productos"
                        className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-accent lux-transition flex items-center justify-center gap-2 group"
                    >
                        Explorar Catálogo
                        <ChevronRight size={18} className="group-hover:translate-x-1 lux-transition" />
                    </Link>
                    <Link
                        href="/premium"
                        className="w-full sm:w-auto px-10 py-4 border border-white/20 text-white font-bold uppercase tracking-widest text-sm hover:border-accent hover:text-accent lux-transition"
                    >
                        Colección Premium
                    </Link>
                </motion.div>
            </div>

            {/* Bottom Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
                <div className="h-12 w-[1px] bg-gradient-to-b from-white/10 via-accent to-transparent animate-pulse" />
            </div>
        </section>
    );
}
