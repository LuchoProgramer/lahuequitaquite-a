import React from "react";
import { Metadata } from "next";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import ProductPageClient from "./ProductPageClient";

// Generar rutas estáticas en build time
export async function generateStaticParams() {
    try {
        const response = await fetchProducts();
        const products = response.data || [];

        // Retornar array de slugs para pre-renderizar
        return products.map((product: any) => ({
            slug: product.slug,
        }));
    } catch (error) {
        console.error("Error generating static params:", error);
        return [];
    }
}

// Generar metadata dinámica para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const response = await fetchProductBySlug(params.slug);
        const product = response.data;

        if (!product) {
            return {
                title: "Producto no encontrado | La Huequita Quiteña",
            };
        }

        const imageUrl = product.imagen || product.image;

        return {
            title: `${product.nombre} | La Huequita Quiteña`,
            description: product.meta_descripcion || product.descripcion || `Compra ${product.nombre} en La Huequita Quiteña. La mejor selección de licores en Quito.`,
            openGraph: {
                title: product.nombre,
                description: product.meta_descripcion || product.descripcion,
                images: imageUrl ? [imageUrl] : [],
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title: product.nombre,
                description: product.meta_descripcion || product.descripcion,
            },
        };
    } catch (error) {
        return {
            title: "Producto | La Huequita Quiteña",
        };
    }
}

// Server Component que renderiza el Client Component
export default async function ProductPage({ params }: { params: { slug: string } }) {
    // Fetch inicial en el servidor para mejor SEO
    let initialProduct = null;

    try {
        const response = await fetchProductBySlug(params.slug);
        initialProduct = response.data;
    } catch (error) {
        console.error("Error fetching product:", error);
    }

    // Renderizar el componente cliente con datos iniciales
    return <ProductPageClient slug={params.slug} initialProduct={initialProduct} />;
}
