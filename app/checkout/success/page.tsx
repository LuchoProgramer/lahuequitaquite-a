"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import confetti from "canvas-confetti";

export default function CheckoutSuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        // Limpiar carrito al llegar aquí (compra finalizada)
        clearCart();

        // Celebración
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#ffffff', '#000000']
        });
    }, []);

    return (
        <div className="min-h-screen bg-background-dark pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20"
            >
                <span className="material-symbols-outlined text-5xl text-primary">check_circle</span>
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <h1 className="text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-white mb-4">
                    ¡Pedido Confirmado!
                </h1>
                <p className="text-gray-400 max-w-lg mx-auto text-lg leading-relaxed mb-8">
                    Gracias por tu preferencia. Se ha abierto WhatsApp para que finalices la coordinación con nuestro equipo.
                </p>

                <div className="bg-surface-dark border border-white/5 p-6 rounded-xl max-w-md mx-auto mb-10">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-bold">¿No se abrió WhatsApp?</p>
                    <p className="text-xs text-gray-400 mb-4">Si tienes bloqueadas las ventanas emergentes, usa este botón:</p>
                    <button
                        onClick={() => window.history.back()}
                        className="text-primary underline text-sm font-bold uppercase tracking-wider hover:text-white transition-colors"
                    >
                        Reintentar abrir WhatsApp
                    </button>
                    {/* Nota: En un flujo real, guardaríamos el link de WhatsApp en localStorage para reabrirlo aquí */}
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                    <Link href="/productos">
                        <button className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-gray-200 transition-colors w-full md:w-auto">
                            Seguir Comprando
                        </button>
                    </Link>
                    <Link href="/">
                        <button className="bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/5 transition-colors w-full md:w-auto">
                            Volver al Inicio
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
