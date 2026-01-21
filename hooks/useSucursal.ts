'use client'

import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export const useSucursal = () => {
    // ID 1 por defecto (La Matriz) si no hay cookie
    const [sucursalId, setSucursalId] = useState<string>('1')
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const saved = Cookies.get('sucursal_seleccionada')
        if (saved) setSucursalId(saved)
        setIsLoaded(true)
    }, [])

    const cambiarSucursal = (id: string) => {
        Cookies.set('sucursal_seleccionada', id, { expires: 7 }) // Dura 7 días
        setSucursalId(id)
        window.location.reload() // Recargamos para refrescar stocks
    }

    return { sucursalId, isLoaded, cambiarSucursal }
}
