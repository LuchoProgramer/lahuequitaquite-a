# 📡 API Reference - LedgerXpertz Backend

## Base URL

```
https://api.ledgerxpertz.com/api
```

---

## Autenticación

### Header Requerido (Multi-Tenancy)

Todos los endpoints requieren el header `X-Tenant` para identificar el tenant:

```typescript
headers: {
  "X-Tenant": "la_huequita",
  "Content-Type": "application/json"
}
```

---

## Endpoints Públicos (Sin Autenticación)

### 1. Sucursales

#### GET `/tienda/sucursales/`

Lista las sucursales habilitadas para el tenant.

**Query Parameters:**
- `solo_mapa` (optional): `true|false` - Filtra solo sucursales visibles en mapa

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Sucursal Matriz",
      "direccion": "Av. 6 de Diciembre N34-123",
      "telefono": "+593-2-1234567",
      "es_principal": true,
      "latitud": -0.1806532,
      "longitud": -78.4678382,
      "mostrar_en_mapa": true
    }
  ]
}
```

**Archivo Backend:** `core/api_publico.py:tienda_sucursales_list`

---

### 2. Home Data

#### GET `/tienda/home/`

Devuelve los datos iniciales para la home del e-commerce.

**Query Parameters:**
- `sucursal` (optional): `number` - ID de sucursal para filtrar

**Response:**
```json
{
  "success": true,
  "info": {
    "nombre_comercial": "La Huequita Quiteña",
    "direccion": "Quito, Ecuador",
    "telefono": "+593-2-1234567"
  },
  "categorias": [
    {
      "id": 1,
      "nombre": "Aguardientes",
      "descripcion": "Aguardientes ecuatorianos"
    }
  ],
  "destacados": [
    {
      "id": 1,
      "nombre": "Aguardiente Amarillo",
      "slug": "aguardiente-amarillo",
      "precio": "25.00",
      "image": "https://api.ledgerxpertz.com/media/productos/aguardiente.jpg",
      "categoria_nombre": "Aguardientes",
      "es_premium": true,
      "stock_total": 50
    }
  ]
}
```

**Archivo Backend:** `core/api_publico.py:tienda_home_data`

---

### 3. Lista de Productos

#### GET `/tienda/productos/`

Lista de productos filtrable para la tienda online.

**Query Parameters:**
- `search` (optional): `string` - Búsqueda por nombre o descripción
- `categoria` (optional): `string` - Nombre de categoría
- `sucursal` (optional): `number` - ID de sucursal

**Ejemplos:**
```
GET /tienda/productos/?search=aguardiente
GET /tienda/productos/?categoria=whisky
GET /tienda/productos/?sucursal=1
GET /tienda/productos/?search=amarillo&categoria=aguardiente&sucursal=1
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Aguardiente Amarillo",
      "slug": "aguardiente-amarillo",
      "precio": "25.00",
      "descripcion": "Aguardiente ecuatoriano premium",
      "image": "https://api.ledgerxpertz.com/media/productos/aguardiente.jpg",
      "imagen": "https://api.ledgerxpertz.com/media/productos/aguardiente.jpg",
      "categoria_nombre": "Aguardientes",
      "es_premium": true,
      "stock_total": 50,
      "meta_descripcion": "Aguardiente amarillo ecuatoriano de alta calidad",
      "disponible_sucursal": true,
      "sucursal_id": 1
    }
  ]
}
```

**Archivo Backend:** `core/api_publico.py:tienda_productos_list`

---

### 4. Detalle de Producto

#### GET `/tienda/producto/<slug>/`

Detalle completo de un producto por su slug.

**Path Parameters:**
- `slug`: `string` - Slug del producto

**Query Parameters:**
- `sucursal` (optional): `number` - ID de sucursal

**Ejemplo:**
```
GET /tienda/producto/aguardiente-amarillo/?sucursal=1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nombre": "Aguardiente Amarillo",
    "slug": "aguardiente-amarillo",
    "precio": "25.00",
    "descripcion": "Aguardiente ecuatoriano premium de alta calidad",
    "image": "https://api.ledgerxpertz.com/media/productos/aguardiente.jpg",
    "imagen": "https://api.ledgerxpertz.com/media/productos/aguardiente.jpg",
    "categoria_nombre": "Aguardientes",
    "es_premium": true,
    "stock_total": 50,
    "meta_descripcion": "Aguardiente amarillo ecuatoriano",
    "presentaciones": [
      {
        "id": 1,
        "nombre_presentacion": "Unidad",
        "cantidad": 1,
        "precio": "25.00",
        "sucursal_nombre": "Sucursal Matriz"
      },
      {
        "id": 2,
        "nombre_presentacion": "Caja x6",
        "cantidad": 6,
        "precio": "140.00",
        "sucursal_nombre": "Sucursal Matriz"
      }
    ]
  }
}
```

**Archivo Backend:** `core/api_publico.py:tienda_producto_detalle`

---

### 5. Stock en Tiempo Real

#### GET `/tienda/inventario/<producto_id>/`

Retorna el stock y precio en tiempo real para una sucursal específica.

**Path Parameters:**
- `producto_id`: `number` - ID del producto

**Query Parameters:**
- `sucursal`: `number` - ID de sucursal (requerido)

**Ejemplo:**
```
GET /tienda/inventario/1/?sucursal=1
```

**Response:**
```json
{
  "producto_id": 1,
  "sucursal_id": 1,
  "cantidad": 50,
  "precio": "25.00"
}
```

**Archivo Backend:** `core/api_publico.py:tienda_stock_realtime`

---

### 6. Google Merchant Center Feed

#### GET `/google-merchant/feed.xml`

Genera un feed XML optimizado para Google Merchant Center.

**Response:** XML (application/xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>La Huequita Quiteña - La Huequita</title>
    <link>https://lahuequitaquitena.com</link>
    <description>Catálogo de licores y bebidas premium de La Huequita Quiteña.</description>
    <item>
      <g:id>1</g:id>
      <title>La Huequita Aguardiente Amarillo 40% ABV</title>
      <description>Aguardiente ecuatoriano premium de alta calidad</description>
      <link>https://lahuequitaquitena.com/producto/aguardiente-amarillo</link>
      <g:image_link>https://api.ledgerxpertz.com/media/productos/aguardiente.jpg</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in_stock</g:availability>
      <g:price>25.00 USD</g:price>
      <g:gtin>7501234567890</g:gtin>
      <g:identifier_exists>yes</g:identifier_exists>
      <g:brand>La Huequita</g:brand>
      <g:product_type>Aguardientes</g:product_type>
      <g:google_product_category>499676</g:google_product_category>
      <g:adult>yes</g:adult>
    </item>
  </channel>
</rss>
```

**Características:**
- Filtra productos con `mostrar_en_web=True`
- Excluye productos de tabaco
- Mapea categorías a IDs de Google
- Incluye atributo `adult=yes` para alcohol
- Calcula stock total en todas las sucursales

**Archivo Backend:** `core/api_google_merchant.py:generate_google_merchant_feed`

---

## Universal Commerce Protocol (UCP)

### 1. Catálogo para IA

#### GET `/ucp/catalog/`

Retorna catálogo estructurado para que la IA lo "entienda".

**Response:**
```json
{
  "protocol": "ucp/1.0",
  "merchant": {
    "id": "la_huequita",
    "name": "La Huequita Quiteña",
    "description": "Licorería premium en Quito - La Huequita Quiteña"
  },
  "categories": [
    {
      "id": "cat_1",
      "name": "Aguardientes",
      "items": [
        {
          "id": "PROD001",
          "name": "Aguardiente Amarillo",
          "description": "Aguardiente ecuatoriano premium",
          "price": {
            "amount": 25.00,
            "currency": "USD"
          },
          "availability": {
            "in_stock": true,
            "quantity": 50
          },
          "image_url": "https://api.ledgerxpertz.com/media/productos/aguardiente.jpg",
          "metadata": {
            "abv": 40.0,
            "category": "Aguardientes"
          }
        }
      ]
    }
  ]
}
```

**Archivo Backend:** `ucp/views.py`

---

### 2. Negociación

#### POST `/ucp/negotiate/`

Permite a la IA solicitar descuentos o verificar stock.

**Request:**
```json
{
  "product_id": "PROD001",
  "quantity": 3
}
```

**Response:**
```json
{
  "status": "available",
  "product_id": "PROD001",
  "quantity": 3,
  "pricing": {
    "base_price": 25.00,
    "discount_percentage": 10,
    "final_price": 22.50,
    "total": 67.50
  },
  "offer_expires_in": 300
}
```

**Archivo Backend:** `ucp/views.py`

---

### 3. Ejecutar Compra

#### POST `/ucp/execute/`

Procesa la compra desde la IA.

**Request:**
```json
{
  "items": [
    {
      "product_id": "PROD001",
      "quantity": 2
    }
  ],
  "payment_token": "tok_abc123",
  "customer": {
    "name": "Juan Pérez",
    "phone": "+593999999999",
    "address": "Av. 6 de Diciembre N34-123"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "order_id": 123,
  "total": 50.00,
  "estimated_delivery": "30-45 minutes",
  "tracking_url": "https://lahuequita.com.ec/pedido/123"
}
```

**Archivo Backend:** `ucp/views.py`

---

## Modelos de Datos

### Producto

```python
{
  "id": number,
  "empresa": number,
  "tipo": "producto" | "servicio",
  "nombre": string,
  "descripcion": string,
  "categoria": number,
  "codigo_producto": string,
  "image": string (URL),
  "stock_minimo": number,
  "activo": boolean,
  
  # Google Merchant Center
  "gtin": string,  # Código de barras
  "marca": string,
  "abv": number,  # Grado alcohólico
  
  # E-commerce
  "slug": string,
  "mostrar_en_web": boolean,
  "es_premium": boolean,
  "meta_descripcion": string
}
```

### Sucursal

```python
{
  "id": number,
  "nombre": string,
  "direccion": string,
  "telefono": string,
  "es_matriz": boolean,
  
  # Geolocalización
  "latitud": number,
  "longitud": number,
  "mostrar_en_mapa": boolean
}
```

### Presentacion

```python
{
  "id": number,
  "producto": number,
  "nombre_presentacion": string,
  "cantidad": number,
  "precio": number,
  "canal": "LOCAL" | "UBER" | "RAPPI" | "WEB",
  "porcentaje_adicional": number,
  "sucursal": number
}
```

---

## Códigos de Error

| Código | Descripción |
|--------|-------------|
| 200 | OK - Solicitud exitosa |
| 400 | Bad Request - Parámetros inválidos |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Rate Limiting

No hay rate limiting implementado actualmente en los endpoints públicos.

---

## CORS

El backend está configurado para aceptar peticiones desde:
- `https://tudominio.com`
- `https://www.tudominio.com`
- `http://localhost:3000` (desarrollo)

---

## Notas Importantes

1. **Multi-Tenancy**: Todos los endpoints requieren el header `X-Tenant`
2. **Stock en Tiempo Real**: El stock se calcula dinámicamente desde la tabla `inventarios`
3. **Precios por Canal**: Los precios pueden variar según el canal (LOCAL, WEB, UBER, RAPPI)
4. **Imágenes**: Las URLs de imágenes son absolutas y apuntan al servidor de medios
5. **Slug Único**: Los slugs se generan automáticamente y son únicos por empresa

---

## Ejemplos de Uso

### Frontend (Next.js)

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID;

const headers = {
  "X-Tenant": TENANT_ID,
  "Content-Type": "application/json",
};

// Obtener productos
export async function fetchProducts(search?: string) {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  
  const res = await fetch(`${API_URL}/tienda/productos/?${params}`, {
    headers,
    next: { revalidate: 60 }
  });
  
  return res.json();
}

// Obtener detalle de producto
export async function fetchProductBySlug(slug: string) {
  const res = await fetch(`${API_URL}/tienda/producto/${slug}/`, {
    headers,
    next: { revalidate: 60 }
  });
  
  return res.json();
}
```

---

**Última actualización:** Enero 2026  
**Versión:** 1.0  
**Backend:** LedgerXpertz Multi-Tenant System
