import { HomeData, Product, Sucursal } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ledgerxpertz.com/api";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

if (!TENANT_ID) {
    throw new Error("FATAL: NEXT_PUBLIC_TENANT_ID environment variable is not defined. Please configure it in .env.local or Vercel.");
}

const headers = {
    "X-Tenant": TENANT_ID,
    "Content-Type": "application/json",
};

const imageUrlCache = new Map<string, string | null>();

export function getImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (imageUrlCache.has(path)) {
        return imageUrlCache.get(path)!;
    }

    let result: string | null;

    if (path.startsWith('http')) {
        result = path;
    } else {
        // Asegurarnos de tener el host correcto
        const host = "https://api.ledgerxpertz.com";
        // Asegurarnos de que el path empiece con /
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        result = `${host}${cleanPath}`;
    }

    imageUrlCache.set(path, result);
    return result;
}

// Circuit Breaker: Evitar bucles infinitos de peticiones
let sucursalesFetchCount = 0;

export async function fetchSucursales(): Promise<{ success: boolean; data: Sucursal[] }> {
    if (sucursalesFetchCount >= 3) {
        console.warn("🛑 [Circuit Breaker] Detenidas peticiones excesivas a sucursales. Usando versión cacheada vacía para evitar bloqueo.");
        // Devolvemos un array vacío o lo que sea seguro para no romper la UI, pero NO hacemos fetch.
        return { success: false, data: [] };
    }
    sucursalesFetchCount++;
    console.log(`🌐 [API] Fetching sucursales (Intento ${sucursalesFetchCount}/3)`);

    try {
        const res = await fetch(`${API_URL}/tienda/sucursales/`, { headers });
        if (!res.ok) throw new Error("Failed to fetch sucursales");
        return res.json();
    } catch (error) {
        // Si falla, no decrementamos el contador para evitar reintentos infinitos en bucle de error
        throw error;
    }
}

export async function fetchHomeData(sucursalId?: number | string): Promise<HomeData> {
    const url = sucursalId ? `${API_URL}/tienda/home/?sucursal=${sucursalId}` : `${API_URL}/tienda/home/`;
    const res = await fetch(url, {
        headers,
        next: {
            revalidate: 3600, // 1 hour
            tags: ['home']
        }
    });
    if (!res.ok) throw new Error("Failed to fetch home data");
    return res.json();
}

export async function fetchProducts(search?: string, categoria?: string, sucursalId?: number | string) {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (categoria) params.append("categoria", categoria);
    if (sucursalId) params.append("sucursal", sucursalId.toString());

    const res = await fetch(`${API_URL}/tienda/productos/?${params.toString()}`, {
        headers,
        next: {
            revalidate: 3600, // 1 hour
            tags: ['products']
        }
    });
    return res.json();
}

export async function fetchProductBySlug(slug: string, sucursalId?: number | string): Promise<{ success: boolean; data: Product }> {
    const url = sucursalId ? `${API_URL}/tienda/producto/${slug}/?sucursal=${sucursalId}` : `${API_URL}/tienda/producto/${slug}/`;
    const res = await fetch(url, {
        headers,
        next: {
            revalidate: 7200, // 2 hours
            tags: [`product-${slug}`]
        }
    });
    if (!res.ok) throw new Error("Product not found");
    return res.json();
}
