# 🎯 Estrategia SEO 100% - La Huequita

> **Objetivo:** Dominar el mercado de licorerías en Quito mediante SEO técnico + Google Merchant Center

---

## 📊 Análisis de Ventaja Competitiva

### Por qué La Huequita puede dominar el mercado:

| Competencia (80-90%)                | La Huequita (Tu Ventaja)                 |
| ----------------------------------- | ---------------------------------------- |
| Sin sitio web (solo redes sociales) | ✅ Sitio web profesional Next.js         |
| Sitios estáticos sin inventario    | ✅ Inventario en tiempo real             |
| Sin presencia en Google Shopping    | ✅ Google Merchant Center                |
| Imágenes genéricas                | ✅ Fotografía "Luxury Dark" profesional |
| "Llama para confirmar stock"        | ✅ Stock visible en tiempo real          |
| Sin datos estructurados             | ✅ Schema.org completo                   |

**Resultado esperado:** Top 5 en Google para "licorería [barrio] Quito" en 6 meses.

---

## 🏗️ Arquitectura Técnica

### Flujo de Datos con Dominio Propio

```
┌─────────────────────────────────────┐
│  lahuequita.com.ec (Frontend)       │
│  Next.js en Vercel                  │
│  - SEO optimizado                   │
│  - Schema.org                       │
│  - Sitemap dinámico                 │
└──────────────┬──────────────────────┘
               │ HTTPS API Calls
               ↓
┌─────────────────────────────────────┐
│  api.ledgerxpertz.com               │
│  Django Multi-Tenant                │
│  - Tenant: la_huequita              │
│  - /api/tienda/productos/           │
│  - /api/google-feed.xml (nuevo)     │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  PostgreSQL                         │
│  Schema: la_huequita                │
│  - Productos, Stock, Precios        │
└─────────────────────────────────────┘
```

### Google Merchant Center Integration

```
Google Merchant Center
    ↓ (Lee automáticamente cada 24h)
https://lahuequita.com.ec/google-feed.xml
    ↓ (Next.js API Route)
/api/google-feed (genera XML dinámico)
    ↓ (Consulta backend)
api.ledgerxpertz.com/api/tienda/productos/
    ↓
PostgreSQL (datos en tiempo real)
```

---

## 🚀 Roadmap de Implementación

### **Fase 1: Fundamentos SEO Técnico** (Semana 1)

#### Checklist:

- [ ] **Migración a Dominio Propio**

  - [ ] Registrar `lahuequita.com.ec` (o similar)
  - [ ] Configurar DNS apuntando a Vercel
  - [ ] Actualizar variables de entorno en Vercel
  - [ ] Configurar SSL/HTTPS automático
  - [ ] Redireccionar dominio antiguo (301)
- [ ] **Sitemap XML Dinámico**

  - [ ] Crear `/app/sitemap.xml/route.ts`
  - [ ] Incluir todas las páginas de productos
  - [ ] Incluir categorías
  - [ ] Agregar `lastmod` (última modificación)
  - [ ] Enviar a Google Search Console
- [ ] **Robots.txt**

  - [ ] Crear `/public/robots.txt`
  - [ ] Permitir crawling de productos
  - [ ] Bloquear rutas administrativas
  - [ ] Referenciar sitemap
- [ ] **Canonical URLs**

  - [ ] Agregar `<link rel="canonical">` en layout
  - [ ] Evitar contenido duplicado
- [ ] **Google Search Console**

  - [ ] Verificar dominio
  - [ ] Enviar sitemap
  - [ ] Configurar alertas

---

### **Fase 2: Optimización de Contenido** (Semanas 2-3)

#### Páginas de Producto (Crítico):

- [ ] **Meta Tags Optimizados**

  - [ ] Title: `[Producto] [Tamaño] - Delivery Quito | La Huequita`
  - [ ] Description: Incluir precio, stock, delivery
  - [ ] Open Graph para redes sociales
  - [ ] Twitter Cards
- [ ] **Schema.org - Product**

  ```typescript
  // Implementar en cada página de producto
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": producto.nombre,
    "image": getImageUrl(producto.image),
    "description": producto.descripcion,
    "brand": { "@type": "Brand", "name": "La Huequita" },
    "offers": {
      "@type": "Offer",
      "url": `https://lahuequita.com.ec/producto/${producto.slug}`,
      "priceCurrency": "USD",
      "price": producto.precio,
      "availability": producto.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    }
  }
  ```
- [ ] **Breadcrumbs (Migas de Pan)**

  ```
  Inicio > Categoría > Producto
  ```

  - [ ] Implementar componente visual
  - [ ] Agregar Schema.org BreadcrumbList
- [ ] **Páginas de Categoría**

  - [ ] `/categoria/aguardiente`
  - [ ] `/categoria/whisky`
  - [ ] `/categoria/ron`
  - [ ] Optimizar con H1, meta tags, Schema
- [ ] **Contenido Descriptivo**

  - [ ] Expandir descripciones de productos (mínimo 150 palabras)
  - [ ] Incluir keywords naturales: "delivery quito", "licorería"
  - [ ] Agregar sección "Sobre este producto"

---

### **Fase 3: Google Merchant Center** (Semana 4)

#### Setup Inicial:

- [ ] **Crear Cuenta Merchant Center**

  - [ ] Ir a [merchants.google.com](https://merchants.google.com)
  - [ ] Verificar dominio `lahuequita.com.ec`
  - [ ] Configurar información del negocio
- [ ] **Páginas Legales Requeridas**

  - [ ] `/politicas/devoluciones` - Política de devoluciones
  - [ ] `/politicas/privacidad` - Política de privacidad
  - [ ] `/terminos` - Términos y condiciones
  - [ ] `/contacto` - Información de contacto

#### Desarrollo del Feed:

- [ ] **Backend: Endpoint XML Feed**

  **Archivo:** `LedgerXpertz/core/api_publico.py`

  ```python
  @api_view(['GET'])
  @authentication_classes([])
  @permission_classes([AllowAny])
  def google_merchant_feed(request):
      """
      Genera feed XML para Google Merchant Center
      """
      tenant = request.tenant
      productos = Producto.objects.filter(
          empresa=tenant,
          mostrar_en_web=True,
          activo=True
      )

      # Filtrar solo productos con stock
      from inventarios.models import Inventario
      from django.db.models import Sum

      productos_con_stock = []
      for p in productos:
          stock = Inventario.objects.filter(producto=p).aggregate(
              total=Sum('cantidad')
          )['total'] or 0

          if stock > 0:
              p.stock_total = stock
              productos_con_stock.append(p)

      # Generar XML
      xml = render_to_string('google_feed.xml', {
          'productos': productos_con_stock,
          'base_url': 'https://lahuequita.com.ec'
      })

      return HttpResponse(xml, content_type='application/xml')
  ```
- [ ] **Template XML**

  **Archivo:** `LedgerXpertz/templates/google_feed.xml`

  ```xml
  <?xml version="1.0"?>
  <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
    <channel>
      <title>La Huequita - Licorería Premium en Quito</title>
      <link>{{ base_url }}</link>
      <description>Licores premium con delivery rápido en Quito</description>

      {% for producto in productos %}
      <item>
        <g:id>{{ producto.codigo_producto }}</g:id>
        <g:title>{{ producto.nombre }}</g:title>
        <g:description>{{ producto.descripcion|default:"Licor premium disponible con delivery en Quito" }}</g:description>
        <g:link>{{ base_url }}/producto/{{ producto.slug }}</g:link>
        <g:image_link>https://api.ledgerxpertz.com{{ producto.image.url }}</g:image_link>
        <g:condition>new</g:condition>
        <g:availability>{% if producto.stock_total > 0 %}in stock{% else %}out of stock{% endif %}</g:availability>
        <g:price>{{ producto.presentaciones.first.precio }} USD</g:price>
        <g:brand>La Huequita</g:brand>
        <g:product_type>Bebidas > Licores > {{ producto.categoria.nombre }}</g:product_type>
        <g:google_product_category>Food, Beverages & Tobacco > Beverages > Alcoholic Beverages</g:google_product_category>
      </item>
      {% endfor %}
    </channel>
  </rss>
  ```
- [ ] **Frontend: API Route Proxy**

  **Archivo:** `la-huequita-web/app/api/google-feed/route.ts`

  ```typescript
  import { NextResponse } from 'next/server';

  export async function GET() {
    const response = await fetch(
      'https://api.ledgerxpertz.com/api/tienda/google-feed/',
      {
        headers: {
          'X-Tenant': 'la_huequita'
        }
      }
    );

    const xml = await response.text();

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    });
  }
  ```
- [ ] **Configurar en Merchant Center**

  - [ ] Agregar feed URL: `https://lahuequita.com.ec/api/google-feed`
  - [ ] Configurar actualización diaria
  - [ ] Validar productos
  - [ ] Corregir errores reportados

---

### **Fase 4: SEO Local** (Semana 5)

#### Google Business Profile:

- [ ] **Crear/Optimizar Perfil**

  - [ ] Nombre: "La Huequita - Licorería Premium"
  - [ ] Categoría: Licorería
  - [ ] Dirección exacta con mapa
  - [ ] Horarios de atención
  - [ ] Fotos del local (mínimo 10)
  - [ ] Enlace al sitio web
- [ ] **Schema.org - LocalBusiness**

  **Archivo:** `la-huequita-web/app/layout.tsx`

  ```typescript
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LiquorStore",
    "name": "La Huequita",
    "image": "https://lahuequita.com.ec/logo.png",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Av. 6 de Diciembre N34-123",
      "addressLocality": "Quito",
      "addressRegion": "Pichincha",
      "postalCode": "170150",
      "addressCountry": "EC"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -0.1865938,
      "longitude": -78.4305382
    },
    "telephone": "+593-2-1234567",
    "url": "https://lahuequita.com.ec",
    "priceRange": "$$",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "22:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "23:00"
      }
    ]
  };
  ```
- [ ] **Reseñas de Clientes**

  - [ ] Solicitar reseñas a clientes satisfechos
  - [ ] Objetivo: 20-30 reseñas en 3 meses
  - [ ] Responder a todas las reseñas (positivas y negativas)
- [ ] **Contenido Local**

  - [ ] Crear landing pages por zona:
    - `/delivery-quito-norte`
    - `/delivery-quito-sur`
    - `/delivery-cumbaya`
  - [ ] Incluir mapas, tiempos de entrega, zonas de cobertura

---

### **Fase 5: Contenido y Link Building** (Continuo)

#### Blog de Contenido:

- [ ] **Artículos SEO-Optimizados**

  - [ ] "Top 10 Cocteles con Aguardiente Ecuatoriano"
  - [ ] "Guía de Maridaje: Qué Licor Servir en Cada Ocasión"
  - [ ] "Historia del Ron en Ecuador"
  - [ ] "Cómo Elegir el Whisky Perfecto para Regalar"
  - [ ] "Delivery de Licores en Quito: Guía Completa"
- [ ] **Estrategia de Keywords**

  - Primarias: "licorería quito", "delivery licores quito"
  - Long-tail: "comprar aguardiente amarillo quito", "whisky delivery quito norte"
  - Local: "licorería [barrio específico]"
- [ ] **Link Building**

  - [ ] Colaborar con blogs de gastronomía ecuatorianos
  - [ ] Directorios locales (Páginas Amarillas Ecuador, etc.)
  - [ ] Alianzas con restaurantes/bares

---

## 📋 Checklist de Implementación Técnica

### Archivos a Crear/Modificar:

#### **Frontend (la-huequita-web):**

```
la-huequita-web/
├── app/
│   ├── sitemap.xml/
│   │   └── route.ts                    # ✅ Sitemap dinámico
│   ├── api/
│   │   └── google-feed/
│   │       └── route.ts                # ✅ Proxy del feed XML
│   ├── producto/[slug]/
│   │   └── page.tsx                    # ⚠️ Agregar Schema.org
│   ├── categoria/[slug]/
│   │   └── page.tsx                    # ⚠️ Crear páginas de categoría
│   ├── politicas/
│   │   ├── devoluciones/page.tsx       # ⚠️ Crear
│   │   ├── privacidad/page.tsx         # ⚠️ Crear
│   │   └── terminos/page.tsx           # ⚠️ Crear
│   └── layout.tsx                      # ⚠️ Agregar LocalBusiness Schema
├── components/
│   └── Breadcrumbs.tsx                 # ⚠️ Crear componente
├── public/
│   └── robots.txt                      # ⚠️ Crear
└── lib/
    └── seo.ts                          # ⚠️ Helpers para Schema.org
```

#### **Backend (LedgerXpertz):**

```
LedgerXpertz/
├── core/
│   ├── api_publico.py                  # ⚠️ Agregar google_merchant_feed
│   └── api_urls.py                     # ⚠️ Agregar ruta del feed
└── templates/
    └── google_feed.xml                 # ✅ Crear template XML
```

---

## 📊 KPIs y Métricas de Éxito

### Objetivos a 3 Meses:

| Métrica                     | Baseline | Objetivo 3M                      |
| ---------------------------- | -------- | -------------------------------- |
| Posición promedio en Google | N/A      | Top 10 para keywords principales |
| Tráfico orgánico mensual   | 0        | 500 visitas                      |
| Productos en Merchant Center | 0        | 100% del catálogo               |
| Clics desde Google Shopping  | 0        | 100/mes                          |
| Tasa de conversión          | N/A      | 2%                               |
| Reseñas en Google           | 0        | 20+                              |

### Objetivos a 6 Meses:

| Métrica             | Objetivo 6M       |
| -------------------- | ----------------- |
| Posición promedio   | Top 5             |
| Tráfico orgánico   | 2,000 visitas/mes |
| Clics desde Shopping | 500/mes           |
| Conversión          | 3-5%              |
| Reseñas             | 50+               |

### Herramientas de Medición:

- [ ] **Google Analytics 4**

  - Configurar eventos de conversión
  - Trackear origen del tráfico
  - Medir tiempo en sitio y bounce rate
- [ ] **Google Search Console**

  - Monitorear posiciones de keywords
  - Identificar errores de indexación
  - Analizar CTR de resultados
- [ ] **Google Merchant Center**

  - Revisar productos aprobados/rechazados
  - Analizar impresiones y clics
  - Optimizar títulos y descripciones

---

## 🎯 Keywords Objetivo (Prioridad)

### Alta Prioridad (Implementar primero):

1. **"licorería quito"** - 1,000+ búsquedas/mes
2. **"delivery licores quito"** - 500+ búsquedas/mes
3. **"licorería quito norte"** - 300+ búsquedas/mes
4. **"comprar licores online quito"** - 200+ búsquedas/mes

### Media Prioridad:

5. "aguardiente amarillo precio"
6. "whisky delivery quito"
7. "ron quito"
8. "licorería 24 horas quito"

### Long-Tail (Baja competencia, alta conversión):

9. "comprar [marca específica] quito"
10. "licorería cerca de [barrio]"
11. "delivery licores [barrio] quito"

---

## 💡 Tips de Optimización Continua

### Mensual:

- [ ] Revisar Google Search Console para nuevas oportunidades de keywords
- [ ] Actualizar productos en Merchant Center (nuevos lanzamientos)
- [ ] Publicar 2-4 artículos de blog
- [ ] Solicitar reseñas a clientes recientes

### Trimestral:

- [ ] Auditoría SEO completa (velocidad, enlaces rotos, etc.)
- [ ] Análisis de competencia
- [ ] Actualizar contenido antiguo
- [ ] Revisar y optimizar meta tags de bajo rendimiento

### Anual:

- [ ] Migración a nuevas tecnologías si es necesario
- [ ] Rediseño visual (mantener SEO)
- [ ] Expansión a nuevas ciudades/regiones

---

## 🚨 Errores Comunes a Evitar

1. **No bloquear contenido duplicado**

   - Usar canonical URLs
   - Evitar parámetros de URL innecesarios
2. **Imágenes sin optimizar**

   - Usar WebP (ya lo tienes ✅)
   - Agregar alt text descriptivo
   - Lazy loading
3. **Contenido delgado**

   - Mínimo 150 palabras por producto
   - Descripciones únicas (no copiar del proveedor)
4. **Ignorar mobile**

   - Ya tienes diseño responsive ✅
   - Verificar velocidad en móvil
5. **No actualizar el feed de Merchant Center**

   - Automatizar con cron job diario
   - Monitorear errores semanalmente

---

## 📞 Recursos y Soporte

### Documentación Oficial:

- [Google Merchant Center Help](https://support.google.com/merchants)
- [Schema.org Documentation](https://schema.org/docs/documents.html)
- [Google Search Central](https://developers.google.com/search)

### Herramientas Útiles:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Merchant Center Feed Validator](https://support.google.com/merchants/answer/7052112)

---

## ✅ Próximos Pasos Inmediatos

1. **Esta semana:**

   - [ ] Registrar dominio propio
   - [ ] Crear cuenta en Google Merchant Center
   - [ ] Implementar sitemap.xml
2. **Próxima semana:**

   - [ ] Agregar Schema.org a productos
   - [ ] Desarrollar endpoint del feed XML
   - [ ] Crear páginas legales
3. **Mes 1:**

   - [ ] Subir feed a Merchant Center
   - [ ] Optimizar Google Business Profile
   - [ ] Publicar primeros artículos de blog

---

**Última actualización:** Enero 2026
**Versión:** 1.0
**Responsable:** Equipo La Huequita
