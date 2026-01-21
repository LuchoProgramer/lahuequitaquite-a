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
Framework: Django REST Framework
Base de Datos: PostgreSQL (Schemas por tenant)
Multi-tenancy: django-tenants
Hosting: https://api.ledgerxpertz.com
Tenant ID: la_huequita
Python: 3.12+
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
│  BACKEND - Django Multi-Tenant (LedgerXpertz)           │
│  - URL: https://api.ledgerxpertz.com                    │
│  - Endpoints públicos: /api/tienda/*                    │
│  - Endpoints privados: /api/auth/* (requieren login)    │
│  - Google Merchant Feed: /api/google-merchant/feed.xml  │
│  - Universal Commerce Protocol: /api/ucp/*              │
│  - Gestión de inventario en tiempo real                 │
│  - Sistema de sucursales con geolocalización            │
│  - Facturación electrónica SRI (Ecuador)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│  BASE DE DATOS - PostgreSQL                             │
│  - Schema compartido: public (empresas, dominios)       │
│  - Schema tenant: la_huequita                           │
│    * Productos, Stock, Precios, Sucursales              │
│    * Categorías, Presentaciones, Inventarios            │
│    * Facturas, Ventas, Compras                          │
│    * Usuarios, Turnos, Auditorías                       │
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
Django TenantMiddleware identifica el tenant
    ↓
Cambia conexión a schema: la_huequita
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

| Endpoint | Método | Descripción | Archivo Backend |
|----------|--------|-------------|-----------------|
| `/api/tienda/sucursales/` | GET | Lista de sucursales | `core/api_publico.py` |
| `/api/tienda/home/` | GET | Datos de la home (categorías, destacados) | `core/api_publico.py` |
| `/api/tienda/productos/` | GET | Catálogo completo con filtros | `core/api_publico.py` |
| `/api/tienda/producto/<slug>/` | GET | Detalle de un producto | `core/api_publico.py` |
| `/api/tienda/inventario/<id>/` | GET | Stock en tiempo real por sucursal | `core/api_publico.py` |
| `/api/google-merchant/feed.xml` | GET | Feed XML para Google Merchant Center | `core/api_google_merchant.py` |

### Endpoints UCP (Universal Commerce Protocol)

| Endpoint | Método | Descripción | Archivo Backend |
|----------|--------|-------------|-----------------|
| `/api/ucp/catalog/` | GET | Catálogo para IA (Gemini/ChatGPT) | `ucp/views.py` |
| `/api/ucp/negotiate/` | POST | Negociación de precios/descuentos | `ucp/views.py` |
| `/api/ucp/execute/` | POST | Ejecutar compra desde IA | `ucp/views.py` |

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

## Modelo de Datos (Backend)

### Producto
```python
class Producto(models.Model):
    # Campos básicos
    empresa = ForeignKey(Empresa)
    tipo = CharField(choices=['producto', 'servicio'])
    nombre = CharField(max_length=200)
    descripcion = TextField()
    categoria = ForeignKey(Categoria)
    codigo_producto = CharField(max_length=50)
    impuesto = ForeignKey(Impuesto)
    image = ImageField(upload_to='productos/')
    stock_minimo = IntegerField(default=0)
    activo = BooleanField(default=True)
    
    # Google Merchant Center
    gtin = CharField(max_length=14)  # Código de barras
    marca = CharField(max_length=100)
    abv = DecimalField()  # Grado alcohólico
    
    # E-commerce
    slug = SlugField()  # URL amigable
    mostrar_en_web = BooleanField(default=False)
    es_premium = BooleanField(default=False)
    meta_descripcion = TextField()  # SEO
```

### Sucursal
```python
class Sucursal(models.Model):
    nombre = CharField(max_length=200)
    empresa = ForeignKey(Empresa)
    direccion = TextField()
    telefono = CharField(max_length=20)
    codigo_establecimiento = CharField(max_length=3)
    punto_emision = CharField(max_length=3)
    es_matriz = BooleanField(default=False)
    
    # Geolocalización
    latitud = DecimalField(max_digits=11, decimal_places=7)
    longitud = DecimalField(max_digits=11, decimal_places=7)
    mostrar_en_mapa = BooleanField(default=False)
```

### Presentacion
```python
class Presentacion(models.Model):
    producto = ForeignKey(Producto)
    nombre_presentacion = CharField(max_length=50)
    cantidad = PositiveIntegerField()
    precio = DecimalField(max_digits=10, decimal_places=2)
    canal = CharField(choices=[
        ('LOCAL', 'Venta Local / POS'),
        ('UBER', 'Uber Eats'),
        ('RAPPI', 'Rappi'),
        ('WEB', 'Tienda Online'),
    ])
    porcentaje_adicional = DecimalField()  # Para delivery
    sucursal = ForeignKey(Sucursal)
```

### Inventario
```python
class Inventario(models.Model):
    producto = ForeignKey(Producto)
    sucursal = ForeignKey(Sucursal)
    cantidad = IntegerField()
    # ... otros campos de auditoría
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
la_huequita.core_producto
la_huequita.inventarios_inventario
la_huequita.core_sucursal

otro_cliente.core_producto
otro_cliente.inventarios_inventario
otro_cliente.core_sucursal
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

El backend usa `TenantMiddleware` para cambiar automáticamente el schema:

```python
# LedgerXpertz/middleware.py
class TenantMiddleware:
    def process_request(self, request):
        tenant_id = request.META.get('HTTP_X_TENANT')
        tenant = Empresa.objects.get(schema_name=tenant_id)
        connection.set_tenant(tenant)  # Cambia a schema la_huequita
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

### Backend (Django .env)

```bash
DEBUG=False
SECRET_KEY=tu-secret-key
DATABASE_URL=postgresql://usuario:password@localhost:5432/ledgerxpertz_db
ALLOWED_HOSTS=api.ledgerxpertz.com,.localhost
CORS_ALLOWED_ORIGINS=https://tudominio.com,https://www.tudominio.com
```

---

## Características Implementadas

### ✅ Backend (LedgerXpertz)

- [x] Multi-tenancy con django-tenants
- [x] API pública para e-commerce (`api_publico.py`)
- [x] Feed XML para Google Merchant Center (`api_google_merchant.py`)
- [x] Universal Commerce Protocol (UCP) básico
- [x] Gestión de inventario en tiempo real
- [x] Sistema de sucursales con geolocalización
- [x] Facturación electrónica SRI (Ecuador)
- [x] Autenticación con sesiones y JWT
- [x] Roles y permisos (Admin/Vendedor)
- [x] Punto de Venta (POS)
- [x] Reportes y dashboards

### ✅ Frontend (La Huequita Web)

- [x] Age Gate (verificación de edad +18)
- [x] Catálogo de productos con filtros
- [x] Páginas de detalle de producto
- [x] Selección de sucursal
- [x] Stock en tiempo real
- [x] Diseño premium responsive
- [x] Páginas legales (términos, privacidad, políticas)
- [x] Feed XML para Google Merchant Center
- [x] SEO optimizado con metadata
- [x] Integración completa con LedgerXpertz API

### ⚠️ Pendientes

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

### 1. Google Merchant Center ✅ (Backend listo)
- Feed XML automático implementado
- Mapeo de categorías a IDs de Google
- Productos con atributos para alcohol
- Filtrado de productos prohibidos (tabaco)
- **Archivo**: `core/api_google_merchant.py`

### 2. Uber Eats (Planificado)
- Sincronización de menú
- Precios diferenciados (campo `canal` en Presentacion)
- Gestión de pedidos
- **Documentación**: `UBER_EATS_INTEGRATION.md`

### 3. Universal Commerce Protocol ✅ (Implementado)
- Compras desde Gemini/ChatGPT
- Ofertas dinámicas
- Negociación automática
- **Directorio**: `ucp/`
- **Documentación**: `UNIVERSAL_COMMERCE_PROTOCOL.md`

---

## Estrategias Documentadas

### SEO (SEO_STRATEGY.md)
- Optimización técnica
- Google Merchant Center
- SEO local
- Keywords objetivo

### Precios (PRICING_STRATEGY_DELIVERY.md)
- Precios diferenciados por plataforma
- Campo `canal` en Presentacion
- Compensación de comisiones

### Alcohol (MERCHANT_CENTER_ALCOHOL_REQUIREMENTS.md)
- Requisitos legales
- Atributos específicos
- Documentación necesaria

---

## Roadmap

### Fase 1: Lanzamiento Beta (2 semanas) ✅ 70% Completado
1. ✅ Configurar dominio custom
2. ✅ Deploy a Vercel
3. ⚠️ Configurar Google Merchant Center
4. ❌ Implementar checkout básico

### Fase 2: E-commerce Completo (1 mes)
1. Integración de pagos
2. Sistema de pedidos
3. Notificaciones
4. Analytics

### Fase 3: Expansión (3 meses)
1. Integración Uber Eats
2. Universal Commerce Protocol en producción
3. Múltiples tenants
4. Dashboard de métricas

---

## Ventajas Competitivas

### vs Competencia Local

| Competencia | La Huequita (LedgerXpertz) |
|-------------|----------------------------|
| Sin sitio web | ✅ E-commerce completo |
| Inventario manual | ✅ Tiempo real con PostgreSQL |
| Sin Google Shopping | ✅ Feed XML automático |
| Imágenes genéricas | ✅ Fotografía profesional |
| "Llamar para stock" | ✅ Stock visible online |
| Sin facturación electrónica | ✅ Integración SRI Ecuador |

### Tecnología

- **Multi-tenant**: Un código, múltiples clientes
- **Escalable**: Arquitectura moderna (Next.js + Django)
- **AI-Ready**: UCP implementado
- **SEO-First**: Optimizado desde el inicio
- **Compliance**: Facturación electrónica SRI

---

## Estructura del Backend (LedgerXpertz)

```
LedgerXpertz/
├── core/                           # Modelos base y API
│   ├── models.py                   # Producto, Sucursal, Presentacion
│   ├── api_publico.py              # API pública para e-commerce
│   ├── api_google_merchant.py      # Feed XML para Google
│   ├── api_productos.py            # CRUD de productos (privado)
│   ├── api_inventario.py           # Gestión de inventario
│   └── api_urls.py                 # Rutas de la API
│
├── empresas/                       # Multi-tenancy
│   ├── models.py                   # Empresa, Dominio
│   └── middleware.py               # TenantMiddleware
│
├── inventarios/                    # Inventario
│   ├── models.py                   # Inventario, Movimiento
│   └── api.py                      # API de inventario
│
├── facturacion/                    # Facturación SRI
│   ├── models.py                   # Factura, NotaCredito
│   └── api.py                      # API de facturación
│
├── ventas/                         # Punto de Venta
│   ├── models.py                   # Venta, DetalleVenta
│   └── api.py                      # API de ventas
│
└── ucp/                            # Universal Commerce Protocol
    ├── models.py                   # Modelos UCP
    ├── views.py                    # Endpoints UCP
    └── urls.py                     # Rutas UCP
```

---

## Recursos Adicionales

### Documentación del Proyecto
- **FEEDBACK.md**: Review completo del sistema
- **SEO_STRATEGY.md**: Estrategia SEO 100%
- **UBER_EATS_INTEGRATION.md**: Integración con Uber Eats
- **UNIVERSAL_COMMERCE_PROTOCOL.md**: Futuro del comercio con IA
- **MERCHANT_CENTER_ALCOHOL_REQUIREMENTS.md**: Requisitos para alcohol
- **PRICING_STRATEGY_DELIVERY.md**: Estrategia de precios
- **DEPLOY_VERCEL.md**: Guía de deployment
- **SETUP_DOMINIO_Y_MERCHANT_CENTER.md**: Configuración completa

### Documentación del Backend
- **README_DEV.md**: Guía de desarrollo
- **ROADMAP_ECOMMERCE.md**: Roadmap de e-commerce
- **MANUAL_USUARIO.md**: Manual de usuario

---

**Última actualización:** Enero 2026  
**Versión:** 2.0  
**Proyecto:** La Huequita Web (Piloto LedgerXpertz E-commerce)  
**Backend:** LedgerXpertz Multi-Tenant System
