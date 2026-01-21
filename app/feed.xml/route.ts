import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener productos desde tu API Django
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/`, {
      headers: {
        'X-Tenant-ID': process.env.NEXT_PUBLIC_TENANT_ID || '',
      },
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const productos = await response.json();

    // Función helper para escapar caracteres XML
    const escapeXml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
    };

    // Generar XML feed para Google Merchant Center
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>La Huequita - Catálogo de Productos</title>
    <link>${process.env.NEXT_PUBLIC_SITE_URL || 'https://lahuequita.com'}</link>
    <description>Catálogo completo de productos de La Huequita</description>
    ${productos.map((producto: any) => {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lahuequita.com';
      const productUrl = `${baseUrl}/producto/${producto.slug}`;
      const imageUrl = producto.imagen_principal?.startsWith('http') 
        ? producto.imagen_principal 
        : `${baseUrl}${producto.imagen_principal}`;
      
      // Determinar disponibilidad
      const availability = producto.stock > 0 ? 'in stock' : 'out of stock';
      
      // Descripción (usar descripción o nombre como fallback)
      const description = escapeXml(producto.descripcion || producto.nombre || 'Producto disponible en La Huequita');
      
      return `
    <item>
      <g:id>${producto.id}</g:id>
      <g:title>${escapeXml(producto.nombre)}</g:title>
      <g:description>${description}</g:description>
      <g:link>${productUrl}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:price>${Number(producto.precio_venta).toFixed(2)} USD</g:price>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:adult>yes</g:adult>
      <g:age_group>adult</g:age_group>
      <g:brand>${escapeXml(producto.marca || 'La Huequita')}</g:brand>
      ${producto.codigo_barras ? `<g:gtin>${producto.codigo_barras}</g:gtin>` : ''}
      ${producto.categoria ? `<g:product_type>${escapeXml(producto.categoria)}</g:product_type>` : ''}
      <g:google_product_category>Food, Beverages &amp; Tobacco &gt; Beverages &gt; Alcoholic Beverages</g:google_product_category>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error generating product feed:', error);
    
    // Retornar XML de error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Error</title>
    <description>Error al generar el feed de productos</description>
  </channel>
</rss>`;

    return new NextResponse(errorXml, {
      status: 500,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}
