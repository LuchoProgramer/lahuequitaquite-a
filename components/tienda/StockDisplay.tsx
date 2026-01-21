'use client'

import { useState, useEffect } from 'react'
// Ajustar importación según estructura del proyecto. Si usas alias @/, asegúrate que tsconfig lo soporte.
// Si no, usa ruta relativa.
import { useSucursal } from '../../hooks/useSucursal'

interface Props {
    productId: string | number
    initialPrice: number | string // API returns string or number
}

export default function StockDisplay({ productId, initialPrice }: Props) {
    const { sucursalId, isLoaded } = useSucursal()

    const [stock, setStock] = useState<number | null>(null)
    const [precioReal, setPrecioReal] = useState<number>(Number(initialPrice))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isLoaded) return

        setLoading(true)

        // Fetch a nuestro Proxy de Next.js
        fetch(`/api/tienda/stock?producto=${productId}&sucursal=${sucursalId}`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                // Asumimos que la API devuelve { cantidad: number, precio?: number }
                if (data.cantidad !== undefined) setStock(data.cantidad)
                if (data.precio) setPrecioReal(Number(data.precio))
            })
            .catch(err => {
                console.error("Error fetching stock:", err)
                setStock(0) // Asumir 0 en error para seguridad
            })
            .finally(() => setLoading(false))

    }, [productId, sucursalId, isLoaded])

    // 1. Estado de Carga (Skeleton)
    if (loading || !isLoaded) {
        return (
            <div className="animate-pulse space-y-2 mt-4">
                <div className="h-8 w-24 bg-gray-200 rounded"></div>
                <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
        )
    }

    // 2. Renderizado Real
    return (
        <div className="space-y-4 mt-4 border-t pt-4">
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                    ${Number(precioReal).toFixed(2)}
                </span>
                {stock !== null && stock < 5 && stock > 0 && (
                    <span className="text-sm font-medium text-orange-600 animate-pulse">
                        ¡Solo quedan {stock}!
                    </span>
                )}
            </div>

            {stock === 0 ? (
                <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-bold cursor-not-allowed">
                    Agotado en esta sucursal ({sucursalId == '1' ? 'Matriz' : 'Sucursal ' + sucursalId})
                </button>
            ) : (
                <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-transform active:scale-95 shadow-lg"
                    onClick={() => alert(`Agregado al carrito: Producto ${productId} (Sucursal ${sucursalId})`)}
                >
                    Agregar al Carrito
                </button>
            )}

            <p className="text-xs text-gray-500 text-center">
                Disponibilidad verificada en tiempo real
            </p>
        </div>
    )
}
