import { HomeData, Product, Sucursal } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.ledgerxpertz.com/api";
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "la_huequita";

const headers = {
    "X-Tenant": TENANT_ID,
    "Content-Type": "application/json",
};

export function getImageUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    if (path.startsWith('http')) return path;

    // Asegurarnos de tener el host correcto
    const host = "https://api.ledgerxpertz.com";

    // Asegurarnos de que el path empiece con /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${host}${cleanPath}`;
}

export async function fetchSucursales(): Promise<{ success: boolean; data: Sucursal[] }> {
    const res = await fetch(`${API_URL}/tienda/sucursales/`, { headers });
    if (!res.ok) throw new Error("Failed to fetch sucursales");
    return res.json();
}

export async function fetchHomeData(sucursalId?: number | string): Promise<HomeData> {
    const url = sucursalId ? `${API_URL}/tienda/home/?sucursal=${sucursalId}` : `${API_URL}/tienda/home/`;
    const res = await fetch(url, {
        headers,
        cache: 'no-store',
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
        cache: 'no-store',
    });
    return res.json();
}

export async function fetchProductBySlug(slug: string, sucursalId?: number | string): Promise<{ success: boolean; data: Product }> {
    const url = sucursalId ? `${API_URL}/tienda/producto/${slug}/?sucursal=${sucursalId}` : `${API_URL}/tienda/producto/${slug}/`;
    const res = await fetch(url, {
        headers,
        cache: 'no-store',
    });
    if (!res.ok) throw new Error("Product not found");
    return res.json();
}
