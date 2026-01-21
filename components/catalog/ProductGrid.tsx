"use client";

import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/products/ProductCard";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import CatalogFilters from "./CatalogFilters";
import { Product } from "@/lib/types";
import { useBranch } from "@/contexts/BranchContext";
import { fetchProducts } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface ProductCatalogProps {
    initialProducts: Product[];
    categories: { id: number; nombre: string }[];
}

export default function ProductCatalog({ initialProducts, categories }: ProductCatalogProps) {
    const { selectedBranch } = useBranch();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(false);

    // Debounce search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        if (selectedBranch) {
            setLoading(true);
            fetchProducts(undefined, undefined, selectedBranch.id)
                .then((res) => {
                    if (res.success) setProducts(res.data);
                })
                .finally(() => {
                    // Simular un poco más de tiempo para que se aprecie el premium feel del skeleton
                    setTimeout(() => setLoading(false), 600);
                });
        }
    }, [selectedBranch]);

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory = selectedCategory
                ? product.categoria_nombre?.toLowerCase() === selectedCategory.toLowerCase()
                : true;
            const matchesSearch = product.nombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                product.descripcion?.toLowerCase().includes(debouncedSearch.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [products, selectedCategory, debouncedSearch]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <CatalogFilters
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />
            </aside>

            {/* Product Grid Area */}
            <div className="flex-grow">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                        {selectedCategory || "Colección General"}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">
                        {loading ? "Actualizando..." : (
                            <><span className="text-white font-bold">{filteredProducts.length}</span> Productos</>
                        )}
                    </p>
                </div>

                <div className="relative min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredProducts.length > 0 ? (
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8"
                            >
                                {filteredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        id={product.id}
                                        nombre={product.nombre}
                                        slug={product.slug}
                                        precio={product.precio}
                                        categoria={product.categoria_nombre}
                                        esPremium={product.es_premium}
                                        imagen={product.image || product.imagen}
                                        stock={product.stock_total}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-32 text-center rounded-2xl border border-white/5 border-dashed"
                            >
                                <h3 className="text-xl text-white mb-2 font-bold italic uppercase tracking-wider">Sin coincidencias</h3>
                                <p className="text-gray-500 font-light text-xs max-w-xs mx-auto uppercase tracking-widest leading-relaxed">
                                    No encontramos lo que buscas en {selectedBranch?.nombre}.
                                </p>
                                <button
                                    onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
                                    className="mt-8 text-primary uppercase text-[10px] font-black tracking-widest border-b border-primary pb-1 hover:text-white hover:border-white transition-colors"
                                >
                                    Limpiar filtros
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
