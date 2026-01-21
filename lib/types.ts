export interface Product {
    id: number;
    nombre: string;
    slug: string;
    precio: string;
    descripcion: string;
    image?: string; // Propiedad que viene del API
    imagen?: string; // Propiedad legacy usada en componentes
    categoria_nombre: string;
    es_premium: boolean;
    stock_total: number;
    meta_descripcion?: string;
    sucursal_id?: number | string;
    disponible_sucursal?: boolean;
    presentaciones?: {
        id: number;
        nombre_presentacion: string;
        cantidad: number;
        precio: string;
    }[];
}

export interface HomeData {
    success: boolean;
    info: {
        nombre_comercial: string;
        direccion: string;
        telefono: string;
    };
    categorias: {
        id: number;
        nombre: string;
        descripcion?: string;
    }[];
    destacados: Product[];
}

export interface Sucursal {
    id: number;
    nombre: string;
    direccion?: string;
    telefono?: string;
    es_principal: boolean;
    lat?: number;
    lng?: number;
}
