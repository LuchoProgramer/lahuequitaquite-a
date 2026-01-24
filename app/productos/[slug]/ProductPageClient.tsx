"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { fetchProductBySlug, getImageUrl, fetchProducts } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useBranch } from "@/contexts/BranchContext";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";

interface ProductPageClientProps {
    slug: string;
    initialProduct: Product | null;
}

export default function ProductPageClient({ slug, initialProduct }: ProductPageClientProps) {
    const router = useRouter();
    const { addItem } = useCart();
    const { selectedBranch } = useBranch();
    const [product, setProduct] = useState<Product | null>(initialProduct);
    const [loading, setLoading] = useState(!initialProduct);
    const [suggestions, setSuggestions] = useState<Product[]>([]);
    const [defaultSuggestions, setDefaultSuggestions] = useState<Product[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Scroll progress for visuals
    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);
    const heroScale = useTransform(scrollY, [0, 500], [1, 1.1]);

    const isOutOfStock = product ? product.stock_total <= 0 : false;

    // --- LÓGICA DE BÚSQUEDA RÁPIDA (DEBOUNCED) ---
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSuggestions(defaultSuggestions);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            setIsSearching(true);
            fetchProducts(searchTerm, undefined, selectedBranch?.id)
                .then(res => {
                    setSuggestions(res.data.slice(0, 10));
                })
                .finally(() => setIsSearching(false));
        }, 400); // Slightly faster debounce for better feel

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, selectedBranch, defaultSuggestions]);

    useEffect(() => {
        if (initialProduct && !selectedBranch) {
            setProduct(initialProduct);
            setLoading(false);
            return;
        }

        setLoading(true);
        fetchProductBySlug(slug, selectedBranch?.id)
            .then(res => {
                setProduct(res.data);

                // --- LÓGICA DE "EL TOQUE FINAL" (CROSS-SELLING) ---
                // Estrategia: "Lista Segura". Si el producto es Alcohol, SOLO mostramos complementos.
                // Categorías de Alcohol conocidas
                const alcoholCategories = ['RON', 'WHISKY', 'CERVEZA', 'AGUARDIENTE', 'ZHUMIR', 'VINO', 'CHAMPAGNE', 'GIN', 'VODKA', 'TEQUILA', 'LICOR', 'VARIOS'];

                const currentCategory = res.data.categoria_nombre.toUpperCase();
                const isAlcohol = alcoholCategories.some(cat => currentCategory.includes(cat));

                if (isAlcohol) {
                    // Solo traemos categorías de la "Lista Segura" (Mixers, Tabaco, Snacks)
                    // Nombres exactos según la base de datos para asegurar matches
                    Promise.all([
                        fetchProducts(undefined, 'Agua con Gas', selectedBranch?.id).catch(() => ({ data: [] })),
                        fetchProducts(undefined, 'Agua Natural', selectedBranch?.id).catch(() => ({ data: [] })),
                        fetchProducts(undefined, 'COLAS/GASEOSAS', selectedBranch?.id).catch(() => ({ data: [] })),
                        fetchProducts(undefined, 'Bebidas energéticas', selectedBranch?.id).catch(() => ({ data: [] })),
                        fetchProducts(undefined, 'Jugos', selectedBranch?.id).catch(() => ({ data: [] })),
                        fetchProducts(undefined, 'CIGARRILLOS', selectedBranch?.id).catch(() => ({ data: [] })),
                        fetchProducts(undefined, 'CONFITERÍA', selectedBranch?.id).catch(() => ({ data: [] })),
                        fetchProducts(undefined, 'BEBIDAS NO ALCOHÓLICAS', selectedBranch?.id).catch(() => ({ data: [] }))
                    ]).then(([aguasGas, aguasNat, gaseosas, energizantes, jugos, cigarros, confiteria, noAlcohol]) => {
                        const allExtras = [
                            ...(aguasGas.data || []),
                            ...(aguasNat.data || []),
                            ...(gaseosas.data || []),
                            ...(energizantes.data || []),
                            ...(jugos.data || []),
                            ...(cigarros.data || []),
                            ...(confiteria.data || []),
                            ...(noAlcohol.data || [])
                        ];

                        // Verificar que no sugerimos el mismo producto
                        const filtered = allExtras.filter(p => p.id !== res.data.id);

                        // Mezclar aleatoriamente para variedad
                        const final = filtered.sort(() => 0.5 - Math.random()).slice(0, 8);
                        setDefaultSuggestions(final);
                        setSuggestions(final);
                    });
                } else {
                    Promise.all([
                        fetchProducts(undefined, 'CONFITERÍA', selectedBranch?.id),
                        fetchProducts(undefined, 'BEBIDAS NO ALCOHÓLICAS', selectedBranch?.id)
                    ]).then(([confiteria, bebidas]) => {
                        const safeSuggestions = [
                            ...(confiteria.data || []),
                            ...(bebidas.data || [])
                        ].filter(p => p.id !== res.data.id && p.slug !== slug);

                        const final = safeSuggestions.sort(() => 0.5 - Math.random()).slice(0, 6);
                        setDefaultSuggestions(final);
                        setSuggestions(final);
                    });
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug, selectedBranch, initialProduct]); // CLEANED DEPENDENCIES: No more searchTerm here

    const addToCart = () => {
        if (!product || isOutOfStock) return;
        for (let i = 0; i < quantity; i++) addItem(product);
        // Feedback visual sutil (vibración o toast) podría ir aquí
    };

    if (loading) return <div className="h-screen bg-[#050505] flex items-center justify-center"><div className="w-12 h-12 border-t-2 border-[#D4AF37] rounded-full animate-spin" /></div>;
    if (!product) return null;

    return (
        <div className="bg-[#050505] min-h-screen text-[#E5E5E5] font-sans selection:bg-[#D4AF37] selection:text-black">

            {/* --- MOBILE: STICKY BOTTOM BAR (Siempre visible en móvil) --- */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-t border-white/5 p-4 lg:hidden pb-safe">
                <div className="flex gap-3">
                    <div className="flex items-center bg-white/5 rounded-lg h-12 border border-white/10">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 text-white/50 hover:text-white">-</button>
                        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(product.stock_total, quantity + 1))} className="px-3 text-white/50 hover:text-white">+</button>
                    </div>
                    <button
                        onClick={addToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 h-12 rounded-lg font-bold uppercase tracking-widest text-xs transition-all ${isOutOfStock ? 'bg-zinc-800 text-zinc-500' : 'bg-[#D4AF37] text-black hover:bg-[#F4CF57]'
                            }`}
                    >
                        {isOutOfStock ? 'Agotado' : `Agregar • $${(parseFloat(product.precio) * quantity).toFixed(2)}`}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row">

                {/* --- LEFT COLUMN: IMMERSIVE VISUAL (Sticky Desktop, Normal Mobile) --- */}
                <div className="w-full lg:w-1/2 lg:h-screen lg:sticky lg:top-0 relative overflow-hidden bg-[#0a0a0a]">
                    <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="w-full h-[50vh] lg:h-full relative">
                        {/* Back Button Overlay */}
                        <div className="absolute top-6 left-6 z-20">
                            <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-black/50 transition-colors">
                                <span className="material-symbols-outlined text-white text-lg">arrow_back</span>
                            </button>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:hidden z-10" />
                        <img
                            src={getImageUrl(product.imagen || product.image) || "https://images.unsplash.com/photo-1569158062925-ddbac4b3ef9a?q=80&w=1887&auto=format&fit=crop"}
                            className={`w-full h-full object-cover lg:object-contain lg:p-20 ${isOutOfStock ? 'grayscale opacity-50' : ''}`}
                            alt={product.nombre}
                        />
                    </motion.div>
                </div>

                {/* --- RIGHT COLUMN: STORYTELLING & DETAILS (Scrollable) --- */}
                <div className="w-full lg:w-1/2 px-6 py-10 lg:py-24 lg:px-20 flex flex-col justify-center min-h-screen relative z-10 -mt-20 lg:mt-0">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Header */}
                        <div className="flex flex-col gap-2 mb-10">
                            <span className="text-[#D4AF37] text-xs font-black tracking-[0.3em] uppercase">{product.categoria_nombre}</span>
                            <h1 className="text-4xl lg:text-6xl font-display text-white font-medium leading-[1.1] mb-2">{product.nombre}</h1>
                            <div className="flex items-center gap-4">
                                <span className="text-2xl text-white/90 font-light">${product.precio}</span>
                                {product.stock_total <= 5 && !isOutOfStock && (
                                    <span className="text-xs text-red-400 font-medium bg-red-400/10 px-2 py-1 rounded">Quedan pocas unidades</span>
                                )}
                            </div>
                        </div>

                        {/* Story */}
                        <div className="prose prose-invert prose-p:text-zinc-400 prose-p:leading-loose max-w-none mb-12">
                            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-4 border-b border-white/10 pb-2">El Legado</h3>
                            <p>{product.descripcion || "Una expresión maestra de la destilería. Seleccionado cuidadosamente para los paladares más exigentes de Quito."}</p>
                        </div>

                        {/* Desktop Actions (Hidden on Mobile) */}
                        <div className="hidden lg:flex flex-col gap-6 mb-16 p-6 border border-white/5 rounded-2xl bg-white/[0.02]">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs uppercase tracking-widest text-zinc-500">Cantidad</span>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-lg w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">-</button>
                                    <span className="font-mono text-lg">{quantity}</span>
                                    <button onClick={() => setQuantity(Math.min(product.stock_total, quantity + 1))} className="text-lg w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors">+</button>
                                </div>
                            </div>
                            <button
                                onClick={addToCart}
                                disabled={isOutOfStock}
                                className={`w-full py-4 uppercase tracking-[0.2em] text-sm font-bold transition-all duration-300 ${isOutOfStock
                                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                                    : 'bg-[#D4AF37] text-black hover:bg-white'
                                    }`}
                            >
                                {isOutOfStock ? 'Agotado' : 'Añadir a la Inversión'}
                            </button>
                            <p className="text-center text-[10px] text-zinc-600 uppercase tracking-widest mt-2">Envío seguro a todo Quito</p>
                        </div>

                        {/* Tasting Notes Accordion */}
                        <div className="mb-20">
                            <h3 className="text-white text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2">Notas del Sommelier</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Aroma</span>
                                    <p className="text-sm text-zinc-400">Intenso, notas de madera y vainilla.</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Paladar</span>
                                    <p className="text-sm text-zinc-400">Sedoso, con toques de frutos secos.</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Final</span>
                                    <p className="text-sm text-zinc-400">Largo y persistente.</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest">Maridaje</span>
                                    <p className="text-sm text-zinc-400">Chocolate oscuro, carnes rojas.</p>
                                </div>
                            </div>
                        </div>

                        {/* --- CROSS SELLING: "EL TOQUE FINAL" --- */}
                        <div className="border-t border-white/10 pt-10 mb-32">
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-display text-3xl italic text-zinc-200">El Toque Final</h4>
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Completa tu orden sin salir de aquí</p>
                                </div>

                                {/* Quick Search Input */}
                                <div className="relative w-full md:w-64 group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-zinc-500 group-focus-within:text-primary transition-colors text-lg">search</span>
                                    <input
                                        type="text"
                                        placeholder="Buscar hielo, cola, snacks..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-full py-3 pl-11 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                                    />
                                    {isSearching && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2 scrollbar-hide snap-x snap-mandatory min-h-[140px]">
                                {isSearching ? (
                                    <div className="w-full flex items-center justify-center py-10">
                                        <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    suggestions.map((item) => (
                                        <div key={item.id} className="min-w-[160px] md:min-w-[200px] snap-start group relative">
                                            <Link href={`/productos/${item.slug}`} className="block">
                                                <div className="aspect-square bg-white/[0.03] rounded-xl mb-3 overflow-hidden relative border border-white/5">
                                                    <img
                                                        src={getImageUrl(item.imagen || item.image) || "/placeholder.jpg"}
                                                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-500"
                                                        alt={item.nombre}
                                                    />
                                                </div>
                                                <h5 className="text-[11px] text-zinc-400 uppercase tracking-wide truncate pr-8">{item.nombre}</h5>
                                                <p className="text-sm font-bold text-white mt-1">${item.precio}</p>
                                            </Link>

                                            {/* Quick Add Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addItem(item);
                                                }}
                                                className="absolute bottom-6 right-0 w-10 h-10 bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary rounded-full flex items-center justify-center text-primary hover:text-black transition-all duration-300 shadow-lg active:scale-90 z-20"
                                            >
                                                <span className="material-symbols-outlined text-xl">add</span>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full flex flex-col items-center justify-center py-10 text-zinc-500 gap-2">
                                        <span className="material-symbols-outlined text-3xl opacity-20">search_off</span>
                                        <p className="text-[10px] uppercase tracking-widest">No encontramos resultados para su búsqueda</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>

        </div>
    );
}
