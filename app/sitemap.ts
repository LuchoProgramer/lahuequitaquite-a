import { MetadataRoute } from 'next'

/**
 * Sitemap dinámico para La Huequita Quiteña
 * 
 * Este sitemap ayuda a Google y otras IAs a descubrir todas las páginas.
 * Se genera dinámicamente en cada request.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lahuequitaquitena.com'

    // Páginas estáticas
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/productos`,
            lastModified: new Date(),
            changeFrequency: 'hourly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/terminos`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/privacidad`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/politicas`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ]

    // Obtener productos dinámicamente
    let productPages: MetadataRoute.Sitemap = []

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tienda/productos/`, {
            headers: {
                'X-Tenant': process.env.NEXT_PUBLIC_TENANT_ID || '',
            },
            next: { revalidate: 3600 }, // Revalidar cada hora
        })

        if (response.ok) {
            const data = await response.json()
            const productos = data.data || []

            productPages = productos.map((producto: any) => ({
                url: `${baseUrl}/productos/${producto.slug}`,
                lastModified: new Date(producto.updated_at || new Date()),
                changeFrequency: 'daily' as const,
                priority: producto.es_premium ? 0.8 : 0.7,
            }))
        }
    } catch (error) {
        console.error('Error fetching products for sitemap:', error)
        // Si falla, continuar con páginas estáticas
    }

    return [...staticPages, ...productPages]
}
