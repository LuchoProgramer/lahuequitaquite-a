import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // 1. Obtener el hostname (ej: la-huequita.com o ferreteria.com)
    const hostname = request.headers.get('host') || ''

    // 2. Mapear dominios a tenants
    // Lógica: Si el dominio es conocido, usa ese tenant. Si no, fallback al default.
    let tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'la_huequita' // Default seguro

    // EJEMPLO DE MAPEO MULTI-TENANT REAL:
    if (hostname.includes('ferreteria-juanito.com')) {
        tenantId = 'ferreteria_juanito'
    } else if (hostname.includes('otra-empresa.com')) {
        tenantId = 'otra_empresa'
    }

    // TODO: En el futuro, esto podría consultar un KV Store (Redis/Vercel Edge Config)
    // si tienes cientos de dominios, para no hardcodearlos en el if/else.

    // 3. Inyectar el tenant en los headers del request
    // Esto permite que los Server Components lean 'x-tenant-id' sin importar el dominio
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-tenant-id', tenantId)

    // 4. Continuar
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    // Configurar en qué rutas se ejecuta el middleware (excluir estáticos, api interna, imágenes, etc.)
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes) -> OJO: Tal vez querrás que aplique en API también 
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
