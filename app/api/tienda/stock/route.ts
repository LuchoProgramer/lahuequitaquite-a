import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const productoId = searchParams.get('producto')
    const sucursalId = searchParams.get('sucursal')

    if (!productoId || !sucursalId) {
        return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
    }

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ledgerxpertz.com/api";
    const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

    // Llamada "Server-to-Server" a Django (Rápida y Segura)
    try {
        // Asumiendo que existe un endpoint en Django que recibe sucursal como query param
        // Ajusta la URL según tu backend real. El usuario sugirió /api/tienda/inventario/{id}
        // pero arriba vimos que usa /tienda/productos/?sucursal=...
        // Voy a usar el estándar que vimos en api.ts: /tienda/producto/{slug}/?sucursal=...
        // PERO aquí recibimos productoId. Si productoId es el ID numérico, necesitamos un endpoint que acepte ID.
        // Si el usuario pasa slug, usamos slug. 
        // El usuario en el prompt usó: fetch(`${process.env.API_URL}/api/tienda/inventario/${productoId}?sucursal=${sucursalId}`)
        // Asumiré que ese endpoint existe o existirá en Django.

        const res = await fetch(`${API_URL}/tienda/inventario/${productoId}/?sucursal=${sucursalId}`, {
            cache: 'no-store', // IMPORTANTE: Esto nunca se debe cachear
            headers: {
                'X-Tenant': TENANT_ID || 'la_huequita',
                'Content-Type': 'application/json'
            }
        })

        if (!res.ok) {
            // Si falla el endpoint específico, intentamos fallback o devolvemos error
            // Tal vez el producto no existe en esa sucursal
            console.error("Error fetching stock from Django:", res.status, res.statusText);
            throw new Error('Error en Django')
        }

        const data = await res.json()
        return NextResponse.json(data)

    } catch (error) {
        console.error("Proxy error:", error);
        return NextResponse.json({ cantidad: 0, error: 'Error fetching stock' }, { status: 500 })
    }
}
