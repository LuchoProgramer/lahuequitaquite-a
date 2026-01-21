# 🏗️ Arquitectura del Sistema - La Huequita Web

## Resumen Ejecutivo

**La Huequita Web** es el frontend de e-commerce para el sistema de inventario multi-tenant **LedgerXpertz**. Este proyecto es un **piloto** que demuestra cómo convertir LedgerXpertz en una plataforma completa de comercio electrónico.

---

## Stack Tecnológico

### Frontend (Este Repositorio)
```
Tecnología: Next.js 16.1.0 (App Router)
Hosting: Vercel
Dominio: [Tu dominio custom]
Framework CSS: Tailwind CSS 4
Animaciones: Framer Motion
Iconos: Lucide React
Lenguaje: TypeScript 5
```

### Backend (LedgerXpertz)
```
Tecnología: Django 4.x (Multi-Tenant)
Base de Datos: PostgreSQL (Schemas por tenant)
API: Django REST Framework
Hosting: https://api.ledgerxpertz.com
Tenant ID: la_huequita
```

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│  USUARIO (Navegador)                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  FRONTEND - Next.js en Vercel                           │
│  - Dominio: tudominio.com                               │
│  - Age Gate (verificación de edad)                      │
│  - Catálogo de productos                                │
│  - Páginas de producto                                  │
│  - Feed XML para Google Merchant Center                 │
│  - SEO optimizado                                       │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS API Calls
                     │ Header: X-Tenant: la_huequita
                     ↓
┌─────────────────────────────────────────────────────────┐
│  BACKEND - Django Multi-Tenant                          │
│  - URL: https://api.ledgerxpertz.com                    │
│  - Endpoints públicos: /api/tienda/*                    │
│  - Gestión de inventario en tiempo real                 │
│  - Sistema de sucursales                                │
│  - Integración con Uber Eats (futuro)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  BASE DE DATOS - PostgreSQL                             │
│  - Schema: la_huequita                                  │
│  - Productos, Stock, Precios, Sucursales                │
│  - Categorías, Presentaciones                           │
└─────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

### 1. Consulta de Productos

```
Usuario visita: tudominio.com/productos
    ↓
Next.js Server Component hace fetch a:
    https://api.ledgerxpertz.com/api/tienda/productos/
    Headers: { "X-Tenant": "la_huequita" }
    ↓
Django identifica el tenant y consulta schema la_huequita
    ↓
PostgreSQL retorna productos con stock en tiempo real
    ↓
Next.js renderiza el catálogo con ISR (revalidate: 60s)
    ↓
Usuario ve productos actualizados
```

### 2. Google Merchant Center Feed

```
Google Merchant Center solicita:
    tudominio.com/feed.xml (cada 24h)
    ↓
Next.js API Route (/app/feed.xml/route.ts)
    ↓
Fetch a: https://api.ledgerxpertz.com/api/tienda/productos/
    Headers: { "X-Tenant": "la_huequita" }
    ↓
Genera XML con productos en stock
    ↓
Google indexa productos para Shopping
```

### 3. Verificación de Edad

```
Usuario visita tudominio.com
    ↓
Middleware verifica cookie age_verified
    ↓
Si no existe → Redirige a Age Gate
    ↓
Usuario confirma +18 años
    ↓
Cookie guardada (24h)
    ↓
Acceso permitido al catálogo
```

---

## Endpoints del Backend (LedgerXpertz)

### Endpoints Públicos (Sin autenticación)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/tienda/sucursales/` | GET | Lista de sucursales |
| `/api/tienda/home/` | GET | Datos de la home (categorías, destacados) |
| `/api/tienda/productos/` | GET | Catálogo completo con filtros |
| `/api/tienda/producto/{slug}/` | GET | Detalle de un producto |
| `/api/tienda/stock/` | GET | Consulta de stock por sucursal |

### Parámetros de Query

```typescript
// Filtrar por búsqueda
GET /api/tienda/productos/?search=aguardiente

// Filtrar por categoría
GET /api/tienda/productos/?categoria=whisky

// Filtrar por sucursal
GET /api/tienda/productos/?sucursal=1

// Combinado
GET /api/tienda/productos/?search=amarillo&categoria=aguardiente&sucursal=1
```

---

## Modelo de Datos (Simplificado)

### Producto
```typescript
{
  id: number;
  nombre: string;
  slug: string;
  precio: string;
  descripcion: string;
  image: string;
  categoria_nombre: string;
  es_premium: boolean;
  stock_total: number;
  meta_descripcion?: string;
  presentaciones?: Presentacion[];
}
```

### Sucursal
```typescript
{
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  es_principal: boolean;
  lat?: number;
  lng?: number;
}
```

### Presentacion
```typescript
{
  id: number;
  nombre_presentacion: string;
  cantidad: number;
  precio: string;
}
```

---

## Multi-Tenancy

### Cómo Funciona

LedgerXpertz usa **PostgreSQL Schemas** para separar datos de cada cliente:

```sql
-- Cada tenant tiene su propio schema
CREATE SCHEMA la_huequita;
CREATE SCHEMA otro_cliente;

-- Las tablas se replican en cada schema
la_huequita.productos
la_huequita.inventarios
la_huequita.sucursales

otro_cliente.productos
otro_cliente.inventarios
otro_cliente.sucursales
```

### Identificación del Tenant

El frontend identifica el tenant mediante el header `X-Tenant`:

```typescript
// lib/api.ts
const headers = {
    "X-Tenant": "la_huequita",  // Desde .env.local
    "Content-Type": "application/json",
};
```

---

## Variables de Entorno

### Frontend (.env.local)

```bash
# URL del backend Django
NEXT_PUBLIC_API_URL=https://api.ledgerxpertz.com/api

# Identificador del tenant
NEXT_PUBLIC_TENANT_ID=la_huequita

# URL del sitio (para feed de productos)
NEXT_PUBLIC_SITE_URL=https://tudominio.com

# Token para revalidación de caché
REVALIDATION_SECRET=OTqOn8R7t3N8jhKxKNGV4HBFUSVfvlcckpyPQNg0Pa0
```

### Backend (Django settings.py)

```python
# CORS para permitir peticiones desde el frontend
CORS_ALLOWED_ORIGINS = [
    "https://tudominio.com",
    "https://www.tudominio.com",
]

# Tenant middleware
MIDDLEWARE = [
    'django_tenants.middleware.main.TenantMainMiddleware',
    # ... otros middlewares
]
```

---

## Características Implementadas

### ✅ Funcionalidades Actuales

- [x] Age Gate (verificación de edad +18)
- [x] Catálogo de productos con filtros
- [x] Páginas de detalle de producto
- [x] Selección de sucursal
- [x] Stock en tiempo real
- [x] Diseño premium responsive
- [x] Páginas legales (términos, privacidad, políticas)
- [x] Feed XML para Google Merchant Center
- [x] SEO optimizado con metadata
- [x] Integración con LedgerXpertz API

### ⚠️ Pendientes (Según FEEDBACK.md)

- [ ] Checkout completo
- [ ] Integración de pagos
- [ ] Sistema de pedidos
- [ ] Notificaciones (WhatsApp/Email)
- [ ] Tracking de pedidos
- [ ] Google Analytics
- [ ] Schema.org completo
- [ ] Sitemap dinámico

---

## Integraciones Planificadas

### 1. Google Merchant Center
- Feed XML automático
- Productos con atributos para alcohol
- Actualización diaria

### 2. Uber Eats (Ver UBER_EATS_INTEGRATION.md)
- Sincronización de menú
- Precios diferenciados (precio_delivery)
- Gestión de pedidos

### 3. Universal Commerce Protocol (Ver UNIVERSAL_COMMERCE_PROTOCOL.md)
- Compras desde Gemini/ChatGPT
- Ofertas dinámicas
- Negociación automática

---

## Estrategias Documentadas

### SEO (SEO_STRATEGY.md)
- Optimización técnica
- Google Merchant Center
- SEO local
- Keywords objetivo

### Precios (PRICING_STRATEGY_DELIVERY.md)
- Precios diferenciados por plataforma
- Campo `precio_delivery` para Uber Eats
- Compensación de comisiones

### Alcohol (MERCHANT_CENTER_ALCOHOL_REQUIREMENTS.md)
- Requisitos legales
- Atributos específicos
- Documentación necesaria

---

## Roadmap

### Fase 1: Lanzamiento Beta (2 semanas)
1. Configurar dominio custom
2. Deploy a Vercel
3. Configurar Google Merchant Center
4. Implementar checkout básico

### Fase 2: E-commerce Completo (1 mes)
1. Integración de pagos
2. Sistema de pedidos
3. Notificaciones
4. Analytics

### Fase 3: Expansión (3 meses)
1. Integración Uber Eats
2. Universal Commerce Protocol
3. Múltiples tenants
4. Dashboard de métricas

---

## Ventajas Competitivas

### vs Competencia Local

| Competencia | La Huequita (LedgerXpertz) |
|-------------|----------------------------|
| Sin sitio web | ✅ E-commerce completo |
| Inventario manual | ✅ Tiempo real |
| Sin Google Shopping | ✅ Merchant Center |
| Imágenes genéricas | ✅ Fotografía profesional |
| "Llamar para stock" | ✅ Stock visible online |

### Tecnología

- **Multi-tenant**: Un código, múltiples clientes
- **Escalable**: Arquitectura moderna (Next.js + Django)
- **AI-Ready**: Preparado para UCP
- **SEO-First**: Optimizado desde el inicio

---

## Recursos Adicionales

- **FEEDBACK.md**: Review completo del sistema
- **SEO_STRATEGY.md**: Estrategia SEO 100%
- **UBER_EATS_INTEGRATION.md**: Integración con Uber Eats
- **UNIVERSAL_COMMERCE_PROTOCOL.md**: Futuro del comercio con IA
- **MERCHANT_CENTER_ALCOHOL_REQUIREMENTS.md**: Requisitos para alcohol
- **PRICING_STRATEGY_DELIVERY.md**: Estrategia de precios
- **DEPLOY_VERCEL.md**: Guía de deployment
- **SETUP_DOMINIO_Y_MERCHANT_CENTER.md**: Configuración completa

---

**Última actualización:** Enero 2026  
**Versión:** 1.0  
**Proyecto:** La Huequita Web (Piloto LedgerXpertz E-commerce)
