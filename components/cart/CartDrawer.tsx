"use client";

import React from "react";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getImageUrl } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
    const WHATSAPP_NUMBER = "593992660222";

    const handleCheckout = () => {
        const message = `¡Hola La Huequita Quiteña! 👋 Quisiera realizar el siguiente pedido:%0A%0A` +
            items.map(item => `• ${item.quantity}x ${item.nombre} - $${(parseFloat(item.precio) * item.quantity).toFixed(2)}`).join('%0A') +
            `%0A%0A*Total a pagar: $${totalPrice.toFixed(2)}*%0A%0A¿Me podrían confirmar la disponibilidad para entrega?`;

        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background-dark border-l border-white/5 z-[110] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tighter font-display">Tu Selección</h2>
                            <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            {items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-gray-700">
                                        <span className="material-symbols-outlined text-[40px]">shopping_basket</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-bold uppercase tracking-widest text-sm mb-2">Carrito Vacío</p>
                                        <p className="text-gray-500 text-xs uppercase tracking-widest">Añade algo especial</p>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={onClose}>Explorar Catálogo</Button>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-right-4">
                                        <div className="w-20 h-24 bg-surface-dark border border-white/5 flex-shrink-0 p-2 rounded-lg overflow-hidden">
                                            <img
                                                src={getImageUrl(item.imagen) || "https://images.unsplash.com/photo-1569158062925-ddbac4b3ef9a?q=80&w=1887&auto=format&fit=crop"}
                                                alt={item.nombre}
                                                className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                            />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-1">
                                                    <h4 className="text-xs font-black text-white uppercase tracking-tight line-clamp-2 leading-tight">{item.nombre}</h4>
                                                    <button onClick={() => removeItem(item.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1">
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                                <p className="text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-3">${item.precio}</p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center border border-white/10 rounded-lg overflow-hidden h-8">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="px-2 h-full hover:bg-white/5 text-gray-400 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">remove</span>
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-black text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="px-2 h-full hover:bg-white/5 text-gray-400 transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer / Summary */}
                        {items.length > 0 && (
                            <div className="p-6 bg-surface-dark/50 backdrop-blur-md border-t border-white/5 space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 uppercase tracking-widest text-[9px] font-black">Subtotal ({totalItems})</span>
                                        <span className="text-white font-bold tracking-tighter">${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 uppercase tracking-widest text-[9px] font-black">Envío (Quito)</span>
                                        <span className="text-primary text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[12px]">local_shipping</span>
                                            Por confirmar
                                        </span>
                                    </div>
                                    <div className="h-[1px] bg-white/5 my-4" />
                                    <div className="flex justify-between items-end">
                                        <span className="font-black text-white uppercase tracking-[0.3em] text-xs">Total</span>
                                        <span className="text-3xl font-black text-primary tracking-tighter leading-none">${totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>

                                <Link href="/checkout" onClick={onClose}>
                                    <Button
                                        variant="gold"
                                        className="w-full gap-3 py-6 h-16 shadow-[0_10px_30px_rgba(238,189,43,0.2)]"
                                    >
                                        <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                        Ir a Pagar / Confirmar
                                    </Button>
                                </Link>

                                <p className="text-[9px] text-center text-gray-500 uppercase tracking-[0.3em] leading-relaxed opacity-50">
                                    Finaliza tu compra conversando con nosotros
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
