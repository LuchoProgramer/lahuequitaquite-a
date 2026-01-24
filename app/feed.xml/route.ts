/**
 * Google Merchant Center Feed Proxy
 * 
 * Este endpoint hace proxy del feed XML generado por el backend de LedgerXpertz.
 * El backend ya tiene toda la lógica implementada en:
 * - Archivo: core/api_google_merchant.py
 * - Endpoint: /api/google-merchant/feed.xml
 * 
 * Ventajas de usar el backend:
 * - Mapeo automático de categorías a IDs de Google
 * - Filtrado de productos prohibidos (tabaco)
 * - Cálculo de stock en tiempo real
 * - Manejo de imágenes con URLs absolutas
 * - Atributos optimizados para alcohol
 */

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Hacer proxy al feed del backend
    const backendFeedUrl = `${process.env.NEXT_PUBLIC_API_URL}/google-merchant/feed.xml`;

    const response = await fetch(backendFeedUrl, {
      headers: {
        'X-Tenant': process.env.NEXT_PUBLIC_TENANT_ID || 'la_huequita',
      },
      // Desactivar caché temporalmente para debugging
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(`Backend feed error: ${response.status}`);
    }

    // Obtener el XML del backend
    const xml = await response.text();

    // Retornar el XML con headers apropiados
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Error proxying Google Merchant feed:', error);

    // Retornar XML de error
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Error</title>
    <description>Error al obtener el feed de productos. Por favor, contacte al administrador.</description>
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
