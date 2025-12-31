"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fetchProductBySlug, getImageUrl, fetchProducts } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { useBranch } from "@/contexts/BranchContext";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;
    const { addItem } = useCart();
    const { selectedBranch } = useBranch();

    const [product, setProduct] = React.useState<Product | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [suggestions, setSuggestions] = React.useState<Product[]>([]);
    const [quantity, setQuantity] = React.useState(1);

    const isOutOfStock = product ? product.stock_total <= 0 : false;

    React.useEffect(() => {
        setLoading(true);
        fetchProductBySlug(slug, selectedBranch?.id)
            .then(res => {
                setProduct(res.data);

                // Lógica de Cross-Selling: Si es alcohol, sugerimos snacks y gaseosas
                const licores = ['RON', 'WHISKY', 'CERVEZA', 'AGUARDIENTE', 'VINO', 'GIN', 'VODKA', 'TEQUILA', 'LICOR DE HIERBAS'];
                const isAlcohol = licores.includes(res.data.categoria_nombre.toUpperCase());

                if (isAlcohol) {
                    // Buscamos complementos: Gaseosas, Snacks y Otros
                    Promise.all([
                        fetchProducts(undefined, 'BEBIDAS NO ALCOHÓLICAS', selectedBranch?.id),
                        fetchProducts(undefined, 'CONFITERÍA', selectedBranch?.id),
                        fetchProducts(undefined, 'OTROS', selectedBranch?.id)
                    ]).then(([bebidas, confiteria, otros]) => {
                        const allSuggestions = [
                            ...(bebidas.data || []),
                            ...(confiteria.data || []),
                            ...(otros.data || [])
                        ];

                        // Prioridad sugerida por el usuario
                        const prioritySlugs = ['coca-cola-135lt', 'coca-cola-1lt', 'agua-tonica', 'sprite-135lt', 'v220', 'panchitos'];

                        const sorted = allSuggestions.sort((a, b) => {
                            const indexA = prioritySlugs.indexOf(a.slug);
                            const indexB = prioritySlugs.indexOf(b.slug);

                            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                            if (indexA !== -1) return -1;
                            if (indexB !== -1) return 1;
                            return 0.5 - Math.random();
                        });

                        setSuggestions(sorted.slice(0, 6));
                    });
                } else {
                    // Si no es alcohol, sugerimos algo del mismo género
                    fetchProducts(undefined, res.data.categoria_nombre, selectedBranch?.id)
                        .then(resp => {
                            setSuggestions(resp.data?.filter((p: Product) => p.slug !== slug).slice(0, 5) || []);
                        });
                }
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug, selectedBranch]);

    if (loading) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center flex-col gap-4">
            <p className="text-white">Producto no encontrado</p>
            <Button onClick={() => router.push("/productos")}>Volver al catálogo</Button>
        </div>
    );

    return (
        <div className="bg-background-dark min-h-screen pb-40">
            {/* Product Hero Image */}
            <div className="relative w-full h-[60vh] min-h-[400px]">
                <div className="absolute inset-0 bg-background-dark flex items-center justify-center overflow-hidden">
                    <img
                        src={getImageUrl(product.imagen) || "https://images.unsplash.com/photo-1569158062925-ddbac4b3ef9a?q=80&w=1887&auto=format&fit=crop"}
                        alt={product.nombre}
                        className={`w-full h-full object-cover grayscale contrast-125 ${isOutOfStock ? 'opacity-40' : ''}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>

                    {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="px-8 py-3 bg-red-600/90 text-white text-xl font-black uppercase tracking-[0.4em] rounded-lg shadow-2xl backdrop-blur-md transform -rotate-12 border-2 border-white/20">
                                Agotado
                            </div>
                        </div>
                    )}
                </div>

                {/* Back and Share Buttons (Desktop Navbar already handles some but let's keep it close to mockup for detail) */}
                <div className="absolute top-6 left-6 z-50">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center size-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 hover:bg-black/60 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    </button>
                </div>
            </div>

            {/* Product Details Content */}
            <div className="relative px-5 -mt-16 z-10 max-w-4xl mx-auto">
                {/* Header Info */}
                <div className="flex flex-col gap-4 mb-8">
                    <div className="flex items-start justify-between">
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-3">
                                <Badge variant="gold">{product.categoria_nombre}</Badge>
                                {product.es_premium && <Badge variant="outline">Premium Collection</Badge>}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white leading-tight mb-2 uppercase font-display">
                                {product.nombre}
                            </h1>
                            <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase opacity-80">
                                {product.categoria_nombre} • Boutique Selection
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center mt-2 p-2 rounded-lg bg-surface-dark/50 border border-white/5 backdrop-blur-sm min-w-[80px]">
                            {isOutOfStock ? (
                                <>
                                    <span className="material-symbols-outlined text-red-500 mb-1 text-[24px]">inventory_2</span>
                                    <span className="text-[10px] text-red-500 font-black uppercase tracking-tighter">Sin Stock</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-xl font-black text-primary leading-none">{product.stock_total}</span>
                                    <span className="text-[10px] text-primary/60 font-black uppercase tracking-tighter mt-1">Disponibles</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Description & Collapsibles */}
                <div className="flex flex-col gap-4 mb-12">
                    {/* Legacy / Main Description */}
                    <details className="flex flex-col rounded-xl border border-white/5 bg-surface-dark/30 px-5 py-2 group" open>
                        <summary className="flex cursor-pointer items-center justify-between py-4 select-none">
                            <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">El Legado</p>
                            <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="pb-6 text-gray-400 text-sm leading-relaxed font-light">
                            {product.descripcion || "Este producto es parte de nuestra selección curada. Disfruta de la mejor calidad tradicional que solo La Huequita Quiteña puede ofrecerte. Forjado con paciencia y artesanía para garantizar una experiencia única."}
                        </div>
                    </details>

                    {/* Tasting Notes (Mocked in Detail but based on real fields like meta_descripcion if available) */}
                    <details className="flex flex-col rounded-xl border border-white/5 bg-surface-dark/30 px-5 py-2 group">
                        <summary className="flex cursor-pointer items-center justify-between py-4 select-none">
                            <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">Notas de Cata</p>
                            <span className="material-symbols-outlined text-primary transition-transform group-open:rotate-180">expand_more</span>
                        </summary>
                        <div className="pb-6 text-gray-400 text-sm leading-relaxed font-light">
                            <ul className="space-y-3">
                                <li className="flex gap-2">
                                    <span className="text-primary font-bold">VISTA:</span>
                                    <span className="opacity-80">Ámbar profundo con destellos cobrizos.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary font-bold">NARIZ:</span>
                                    <span className="opacity-80">Aromas complejos de frutos secos, miel y madera.</span>
                                </li>
                                <li className="flex gap-2">
                                    <span className="text-primary font-bold">BOCA:</span>
                                    <span className="opacity-80">Sedoso, con final largo y notas de chocolate amargo.</span>
                                </li>
                            </ul>
                        </div>
                    </details>
                </div>

                {/* Related Section (Dynamic based on Cross-selling logic) */}
                <div className="mb-12">
                    <h3 className="text-white text-xs font-black uppercase tracking-[0.3em] mb-6 opacity-60">Completa tu Experiencia</h3>
                    <div className="flex overflow-x-auto gap-4 pb-6 no-scrollbar snap-x">
                        {suggestions.length > 0 ? suggestions.map(item => (
                            <Link href={`/producto/${item.slug}`} key={item.id} className="snap-center shrink-0 w-[180px] flex flex-col gap-3 group cursor-pointer">
                                <div className="aspect-[4/5] rounded-xl bg-surface-dark border border-white/5 overflow-hidden">
                                    <img
                                        src={getImageUrl(item.imagen) || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=200&auto=format&fit=crop"}
                                        alt={item.nombre}
                                        className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all"
                                    />
                                </div>
                                <div className="px-1">
                                    <p className="text-white text-[10px] font-bold uppercase truncate leading-tight mb-1">{item.nombre}</p>
                                    <p className="text-primary text-[10px] font-black tracking-widest">${item.precio}</p>
                                </div>
                            </Link>
                        )) : (
                            <p className="text-gray-500 text-[10px] uppercase tracking-widest">Buscando complementos perfectos...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-background-dark/95 backdrop-blur-lg border-t border-white/5 p-5 pb-10 z-[100] md:z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                <div className="max-w-4xl mx-auto flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Inversión Total</span>
                            <span className="text-3xl font-bold text-white tracking-tighter">${(parseFloat(product.precio) * quantity).toFixed(2)}</span>
                        </div>

                        {!isOutOfStock && (
                            <div className="flex items-center border border-white/10 rounded-xl overflow-hidden h-12 bg-white/5 backdrop-blur-sm">
                                <button
                                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                    className="px-4 h-full hover:bg-white/10 text-white transition-colors border-r border-white/10"
                                >
                                    <span className="material-symbols-outlined text-[18px]">remove</span>
                                </button>
                                <span className="w-12 text-center text-sm font-black text-white">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(prev => Math.min(product.stock_total, prev + 1))}
                                    className="px-4 h-full hover:bg-white/10 text-white transition-colors border-l border-white/10"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            if (!isOutOfStock) {
                                // Llamamos a addItem el número de veces de la cantidad o actualizamos CartContext para aceptar quantity
                                // Por simplicidad ahora, lo haré así, pero lo ideal es que addItem soporte cantidad.
                                for (let i = 0; i < quantity; i++) addItem(product);
                                router.push("#"); // Solo para dar feedback visual
                            }
                        }}
                        disabled={isOutOfStock}
                        className={`w-full transition-all text-background-dark font-black text-sm uppercase tracking-[0.2em] h-16 rounded-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(238,189,43,0.3)] ${isOutOfStock
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed grayscale'
                                : 'bg-primary hover:bg-primary/90 active:scale-[0.98]'
                            }`}
                    >
                        <span className="material-symbols-outlined">{isOutOfStock ? 'block' : 'shopping_bag'}</span>
                        {isOutOfStock ? 'Producto Agotado' : 'Añadir al Carrito'}
                    </button>
                </div>
            </div>
        </div>
    );
}
