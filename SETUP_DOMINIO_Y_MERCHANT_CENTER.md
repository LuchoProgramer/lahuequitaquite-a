# 🌐 Configuración de Dominio Custom + Google Merchant Center

## Orden de Configuración Recomendado

1. ✅ Deploy inicial a Vercel
2. ✅ Configurar dominio custom
3. ✅ Verificar dominio en Google Search Console
4. ✅ Configurar Google Merchant Center
5. ✅ Agregar productos al feed

---

## Paso 1: Deploy Inicial a Vercel

```bash
# Login en Vercel
vercel login

# Deploy inicial
vercel

# Configurar variables de entorno (ver DEPLOY_VERCEL.md)
vercel env add NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_TENANT_ID production
vercel env add REVALIDATION_SECRET production

# Deploy a producción
vercel --prod
```

---

## Paso 2: Configurar Dominio Custom en Vercel

### Opción A: Desde el Dashboard (Recomendado)

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `la-huequita-web`
3. Ve a **Settings** → **Domains**
4. Click en **Add Domain**
5. Ingresa tu dominio (ej: `lahuequita.com` o `www.lahuequita.com`)

### Opción B: Desde la Terminal

```bash
vercel domains add tudominio.com
```

### Configuración DNS

Vercel te dará instrucciones específicas. Generalmente necesitas:

**Para dominio raíz (lahuequita.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para www (www.lahuequita.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

> [!IMPORTANT]
> - Los cambios DNS pueden tardar hasta 48 horas (usualmente 15-30 minutos)
> - Vercel genera automáticamente el certificado SSL (HTTPS)
> - Recomiendo configurar AMBOS: dominio raíz y www

---

## Paso 3: Verificar Dominio en Google Search Console

**¿Por qué?** Google Merchant Center requiere que verifiques la propiedad del dominio.

### 3.1 Acceder a Search Console

1. Ve a https://search.google.com/search-console
2. Click en **Agregar propiedad**
3. Selecciona **Propiedad de dominio** (no URL prefix)
4. Ingresa tu dominio: `lahuequita.com`

### 3.2 Verificar con DNS (Método Recomendado)

Google te dará un registro TXT para agregar a tu DNS:

```
Type: TXT
Name: @
Value: google-site-verification=ABC123XYZ... (el que te dé Google)
TTL: 3600
```

**Agrega este registro en tu proveedor de dominio** (GoDaddy, Namecheap, etc.)

### 3.3 Verificar

- Espera 5-10 minutos después de agregar el TXT
- Click en **Verificar** en Search Console
- ✅ Una vez verificado, ya puedes usar Merchant Center

---

## Paso 4: Configurar Google Merchant Center

### 4.1 Crear Cuenta

1. Ve a https://merchants.google.com
2. Crea una cuenta con tu email de negocio
3. Selecciona país: **Ecuador**
4. Nombre del negocio: **La Huequita**

### 4.2 Verificar y Reclamar el Sitio Web

1. En Merchant Center, ve a **Herramientas** → **Información empresarial**
2. En **Sitio web**, ingresa: `https://tudominio.com`
3. Click en **Verificar y reclamar**
4. Selecciona **Google Search Console** (ya verificado en Paso 3)
5. ✅ Debería verificarse automáticamente

### 4.3 Configurar Información del Negocio

```yaml
Nombre: La Huequita
Dirección: [Tu dirección física en Ecuador]
Teléfono: [Tu número de contacto]
Email: [Email de atención al cliente]
Categoría: Tienda de licores / Bebidas alcohólicas
```

### 4.4 Configuración de Envío

Según tu `PRICING_STRATEGY_DELIVERY.md`:

```yaml
Método de envío: Entrega local
Área de cobertura: [Tu ciudad/región]
Costo de envío: Según tu estrategia
Tiempo de entrega: 1-2 días hábiles
```

### 4.5 Política de Devoluciones

```yaml
Período de devolución: 7 días
Condiciones: Producto sin abrir, en condiciones originales
Costo de devolución: A cargo del cliente
```

---

## Paso 5: Requisitos Especiales para Alcohol

> [!WARNING]
> Google Merchant Center tiene requisitos ESTRICTOS para productos alcohólicos.

### 5.1 Requisitos Legales (Según tu MERCHANT_CENTER_ALCOHOL_REQUIREMENTS.md)

✅ **Ya implementado en tu sitio:**
- Age Gate (verificación de edad +18)
- Términos y condiciones
- Política de privacidad
- Advertencias de consumo responsable

✅ **Debes tener:**
- Licencia de venta de alcohol en Ecuador
- Certificado de registro sanitario
- Permisos municipales

### 5.2 Configuración en Merchant Center

1. Ve a **Herramientas** → **Información empresarial** → **Productos para adultos**
2. Marca: ✅ **Vendo productos alcohólicos**
3. Sube documentación:
   - Licencia de venta de alcohol
   - Registro sanitario
   - Identificación del negocio

### 5.3 Atributos Requeridos en el Feed de Productos

Para cada producto alcohólico, debes incluir:

```xml
<g:adult>yes</g:adult>
<g:age_group>adult</g:age_group>
<g:availability>in stock</g:availability>
<g:condition>new</g:condition>
<g:price>XX.XX USD</g:price>
<g:link>https://tudominio.com/producto/[slug]</g:link>
<g:image_link>https://tudominio.com/images/[producto].jpg</g:image_link>
<g:brand>[Marca del producto]</g:brand>
<g:gtin>[Código de barras si está disponible]</g:gtin>
```

---

## Paso 6: Crear Feed de Productos

### Opción A: Feed XML Automático (Recomendado)

Crear un endpoint en tu Next.js app:

**Archivo:** `app/feed.xml/route.ts`

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  // Obtener productos desde tu API
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productos/`, {
    headers: {
      'X-Tenant-ID': process.env.NEXT_PUBLIC_TENANT_ID || '',
    },
  });
  
  const productos = await response.json();
  
  // Generar XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>La Huequita - Productos</title>
    <link>https://tudominio.com</link>
    <description>Catálogo de productos La Huequita</description>
    ${productos.map((producto: any) => `
    <item>
      <g:id>${producto.id}</g:id>
      <g:title>${producto.nombre}</g:title>
      <g:description>${producto.descripcion || producto.nombre}</g:description>
      <g:link>https://tudominio.com/producto/${producto.slug}</g:link>
      <g:image_link>${producto.imagen_principal}</g:image_link>
      <g:price>${producto.precio_venta} USD</g:price>
      <g:availability>${producto.stock > 0 ? 'in stock' : 'out of stock'}</g:availability>
      <g:condition>new</g:condition>
      <g:adult>yes</g:adult>
      <g:age_group>adult</g:age_group>
      <g:brand>${producto.marca || 'La Huequita'}</g:brand>
      ${producto.codigo_barras ? `<g:gtin>${producto.codigo_barras}</g:gtin>` : ''}
    </item>
    `).join('')}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

**URL del feed:** `https://tudominio.com/feed.xml`

### Opción B: Google Sheets

Si prefieres manual:
1. Descarga la plantilla de Google
2. Llena los productos manualmente
3. Conecta el sheet en Merchant Center

---

## Paso 7: Agregar Feed a Merchant Center

1. En Merchant Center, ve a **Productos** → **Feeds**
2. Click en **+** (Agregar feed)
3. Selecciona:
   - País: **Ecuador**
   - Idioma: **Español**
   - Destinos: **Anuncios de Shopping gratuitos**
4. Método de entrada:
   - **Obtención programada** (si usas feed.xml)
   - URL: `https://tudominio.com/feed.xml`
   - Frecuencia: **Diaria**

---

## Paso 8: Verificación y Aprobación

### 8.1 Verificar Feed

- Merchant Center procesará el feed (puede tardar 24-48 horas)
- Revisa errores en **Diagnóstico**
- Corrige cualquier problema

### 8.2 Errores Comunes

| Error | Solución |
|-------|----------|
| Missing `adult` attribute | Agregar `<g:adult>yes</g:adult>` |
| Invalid price format | Usar formato: `XX.XX USD` |
| Missing image | Asegurar que todas las imágenes sean accesibles |
| Age verification missing | Verificar que Age Gate funcione |

### 8.3 Aprobación

> [!CAUTION]
> - La aprobación puede tardar 3-7 días hábiles
> - Google puede solicitar documentación adicional
> - Mantén actualizadas las políticas de tu sitio

---

## 📋 Checklist Final

Antes de enviar a revisión:

- [ ] Dominio custom configurado y funcionando con HTTPS
- [ ] Dominio verificado en Google Search Console
- [ ] Age Gate funcionando correctamente
- [ ] Páginas legales accesibles (términos, privacidad, políticas)
- [ ] Feed de productos generándose correctamente
- [ ] Todos los productos tienen imágenes válidas
- [ ] Precios en formato correcto
- [ ] Información de envío configurada
- [ ] Política de devoluciones publicada
- [ ] Documentación legal lista para subir

---

## 🎯 URLs Importantes

```
Sitio web: https://tudominio.com
Feed productos: https://tudominio.com/feed.xml
Términos: https://tudominio.com/terminos
Privacidad: https://tudominio.com/privacidad
Políticas: https://tudominio.com/politicas
```

---

## 📞 Soporte

**Google Merchant Center:**
- Centro de ayuda: https://support.google.com/merchants
- Teléfono: Disponible en el dashboard

**Vercel:**
- Documentación: https://vercel.com/docs
- Soporte: support@vercel.com

---

## 🚀 Próximos Pasos

Una vez aprobado en Merchant Center:

1. Configurar Google Ads (opcional, para anuncios pagos)
2. Optimizar SEO (ya tienes `SEO_STRATEGY.md`)
3. Integrar con Uber Eats (ya tienes `UBER_EATS_INTEGRATION.md`)
4. Monitorear rendimiento en Google Analytics

---

> [!TIP]
> **Tiempo estimado total:** 3-5 días
> - Configuración técnica: 1-2 horas
> - Propagación DNS: 15-30 minutos
> - Revisión de Merchant Center: 3-7 días

¡Éxito con tu lanzamiento! 🎉
