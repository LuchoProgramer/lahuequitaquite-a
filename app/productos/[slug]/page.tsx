import React from "react";
import { Metadata } from "next";
import { fetchProductBySlug, fetchProducts, getImageUrl } from "@/lib/api";
import ProductPageClient from "./ProductPageClient";

// Permitir generación dinámica de páginas que no están pre-renderizadas
// En desarrollo: genera dinámicamente, en producción: usa static params
export const dynamicParams = true;

// Generar rutas estáticas en build time
export async function generateStaticParams() {
    // En desarrollo, retornar array vacío para permitir generación dinámica
    if (process.env.NODE_ENV === 'development') {
        return [];
    }

    try {
        const response = await fetchProducts();
        const products = response.data || [];

        console.log(`Generating static params for ${products.length} products`);

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
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    try {
        const { slug } = await params;
        const response = await fetchProductBySlug(slug);
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
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    // Unwrap params (Next.js 16+)
    const { slug } = await params;

    // Fetch inicial en el servidor para mejor SEO
    let initialProduct = null;
    let jsonLd = null;

    try {
        const response = await fetchProductBySlug(slug);
        initialProduct = response.data;

        if (initialProduct) {
            const imageUrl = getImageUrl(initialProduct.imagen || initialProduct.image);

            jsonLd = {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": initialProduct.nombre,
                "description": initialProduct.meta_descripcion || initialProduct.descripcion || `Compra ${initialProduct.nombre} al mejor precio.`,
                "image": imageUrl ? [imageUrl] : [],
                "sku": initialProduct.id,
                "offers": {
                    "@type": "Offer",
                    "price": initialProduct.precio,
                    "priceCurrency": "USD",
                    "availability": initialProduct.stock_total > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    "url": `https://lahuequitaquitena.com/productos/${initialProduct.slug}`,
                    "seller": {
                        "@type": "Organization",
                        "name": "La Huequita Quiteña",
                        "logo": "https://lahuequitaquitena.com/icon.png"
                    }
                }
            };
        }
    } catch (error) {
        console.error("Error fetching product:", error);
    }

    // Renderizar el componente cliente con datos iniciales
    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <ProductPageClient slug={slug} initialProduct={initialProduct} />
        </>
    );
}
