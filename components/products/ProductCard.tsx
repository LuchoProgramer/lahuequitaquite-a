"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { getImageUrl } from "@/lib/api";

interface ProductCardProps {
    id: number;
    nombre: string;
    slug: string;
    precio: string;
    imagen?: string;
    categoria: string;
    esPremium?: boolean;
    stock?: number;
}

export default function ProductCard(product: ProductCardProps) {
    const { addItem } = useCart();
    const { nombre, slug, precio, imagen, categoria, esPremium, stock = 0 } = product;
    const isOutOfStock = stock <= 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        addItem({
            id: product.id,
            nombre,
            slug,
            precio,
            descripcion: "",
            categoria_nombre: categoria,
            es_premium: !!esPremium,
            stock_total: stock,
            imagen
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`group relative flex flex-col bg-surface-dark rounded-xl overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 ${isOutOfStock ? 'opacity-70 grayscale-[0.5]' : ''}`}
        >
            {/* Product Image Area */}
            {/* Product Image Area - Spotlight Effect */}
            <div className="relative w-full aspect-square bg-[#0f0e0d] overflow-hidden">
                {/* Spotlight Gradient */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700"></div>

                <Link href={`/productos/${slug}`} className="absolute inset-0 p-6 flex items-center justify-center">
                    <img
                        src={getImageUrl(imagen) || "https://images.unsplash.com/photo-1569158062925-ddbac4b3ef9a?q=80&w=1887&auto=format&fit=crop"}
                        alt={nombre}
                        className="w-full h-full object-contain drop-shadow-2xl filter brightness-100 group-hover:brightness-110 group-hover:scale-110 transition-all duration-500 will-change-transform"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const fallbackUrl = "https://images.unsplash.com/photo-1569158062925-ddbac4b3ef9a?q=80&w=1887&auto=format&fit=crop";

                            // Prevent infinite loop: if already using fallback, do nothing
                            if (target.src === fallbackUrl) return;

                            // Fallback if production image fails to load
                            target.src = fallbackUrl;
                            // Reset styles for fallback image which usually covers full area
                            target.className = "absolute inset-0 w-full h-full object-cover opacity-60 grayscale";
                        }}
                    />
                </Link>

                {/* badges */}
                {esPremium && (
                    <div className="absolute top-3 left-3 px-2 py-0.5 bg-primary/20 backdrop-blur-sm border border-primary/20 rounded text-[10px] font-bold text-primary uppercase tracking-wider z-10">
                        Premium
                    </div>
                )}

                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                        <div className="px-3 py-1 bg-red-600/90 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded shadow-lg backdrop-blur-sm">
                            Agotado
                        </div>
                    </div>
                )}

                {/* Favorite Button */}
                <button className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors z-10">
                    <span className="material-symbols-outlined text-[18px]">favorite</span>
                </button>
            </div>

            {/* Info Section */}
            <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <Link href={`/productos/${slug}`} className="flex-grow">
                        <h4 className="text-white font-bold text-sm leading-snug uppercase tracking-tight group-hover:text-primary transition-colors">{nombre}</h4>
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-widest mt-0.5">{categoria}</p>
                    </Link>
                </div>

                <div className="flex justify-between items-end mt-3">
                    <div className="flex flex-col">
                        <span className="text-primary font-bold text-lg leading-none">${precio}</span>
                    </div>
                    <button
                        onClick={handleAdd}
                        disabled={isOutOfStock}
                        className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${isOutOfStock
                            ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                            : 'bg-white/5 border border-white/10 text-white hover:bg-primary hover:text-black hover:scale-110 active:scale-95'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[20px]">{isOutOfStock ? 'block' : 'add'}</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
