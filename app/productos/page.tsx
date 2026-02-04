import React from "react";
import Navbar from "@/components/navbar/Navbar";
import ProductCatalog from "@/components/catalog/ProductGrid";
import { fetchHomeData, fetchProducts } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Catálogo Completo | La Huequita Quiteña",
    description: "Explora nuestra selección completa de licores nacionales e importados en Quito.",
};

export const revalidate = 3600; // 1 hour

export default async function CatalogPage() {
    const { categorias } = await fetchHomeData();
    const { data: products } = await fetchProducts();

    return (
        <>
            <Navbar />
            <main className="bg-background-dark min-h-screen pt-24 pb-32 px-5">
                <div className="max-w-7xl mx-auto space-y-10">

                    {/* Featured Hero Section - Styled from stitch mockup */}
                    <section className="relative w-full rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] shadow-2xl group cursor-pointer border border-white/5">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')" }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent opacity-90"></div>
                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <span className="px-2 py-1 bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest rounded mb-3 backdrop-blur-sm border border-primary/20">
                                Selección de Temporada
                            </span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2 uppercase tracking-tighter">
                                Espíritus <br className="md:hidden" /> <span className="text-primary">Legendarios</span>
                            </h2>
                            <p className="text-white/70 text-xs md:text-sm mb-4 font-medium uppercase tracking-[0.2em]">Curados especialmente para ti</p>
                            <button className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                                Ver Colección <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </section>

                    {/* Catalog Area */}
                    <ProductCatalog
                        initialProducts={products || []}
                        categories={categorias || []}
                    />
                </div>
            </main>
        </>
    );
}
