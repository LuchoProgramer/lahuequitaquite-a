# 🍷 Requisitos de Google Merchant Center para Productos de Alcohol

> **Documento Técnico:** Especificaciones obligatorias para listar licores en Google Shopping

---

## ⚠️ Restricciones Importantes para Ecuador

### Políticas de Google para Alcohol:

Google **SÍ permite** anuncios de alcohol en Ecuador, pero con restricciones estrictas:

- ✅ **Permitido:** Vender cerveza, vino, licores, aguardiente
- ❌ **Prohibido:** Dirigir anuncios a menores de 18 años
- ❌ **Prohibido:** Remarketing/retargeting de productos de alcohol
- ⚠️ **Requerido:** Verificación de edad en el sitio web (Age Gate)

---

## 📋 Atributos Obligatorios del Feed XML

### **Atributos Estándar (Todos los Productos):**

| Atributo | Obligatorio | Descripción | Ejemplo |
|----------|-------------|-------------|---------|
| `g:id` | ✅ **SÍ** | ID único (SKU) | `AG029` |
| `g:title` | ✅ **SÍ** | Nombre del producto + detalles | `Aguardiente Amarillo 750ml 30% ABV` |
| `g:description` | ✅ **SÍ** | Descripción detallada (min. 150 caracteres) | `Aguardiente tradicional ecuatoriano de alta calidad. Ideal para cocteles. Contenido alcohólico 30%. Botella de 750ml.` |
| `g:link` | ✅ **SÍ** | URL de la página del producto | `https://lahuequita.com.ec/producto/aguardiente-amarillo` |
| `g:image_link` | ✅ **SÍ** | URL de la imagen principal | `https://api.ledgerxpertz.com/media/productos/AG029.webp` |
| `g:availability` | ✅ **SÍ** | Estado del stock | `in stock` / `out of stock` |
| `g:price` | ✅ **SÍ** | Precio con moneda | `25.00 USD` |
| `g:brand` | ✅ **SÍ** | Marca del producto | `La Huequita` o `Zhumir` (marca del fabricante) |
| `g:condition` | ✅ **SÍ** | Estado del producto | `new` |

---

### **Atributos ESPECÍFICOS para Alcohol:**

| Atributo | Obligatorio | Descripción | Ejemplo |
|----------|-------------|-------------|---------|
| `g:google_product_category` | ✅ **SÍ** | Categoría de Google | `Food, Beverages & Tobacco > Beverages > Alcoholic Beverages` o ID: `499676` |
| `g:age_group` | ✅ **SÍ** | Grupo de edad | `adult` |
| `g:product_type` | ⚠️ Recomendado | Tu categoría personalizada | `Bebidas > Licores > Aguardiente` |

---

### **Atributos Opcionales pero MUY Recomendados:**

| Atributo | Importancia | Descripción | Ejemplo |
|----------|-------------|-------------|---------|
| `g:gtin` | 🔥 Alta | Código de barras (UPC/EAN) | `7501234567890` |
| `g:mpn` | 🔥 Alta | Número de parte del fabricante | `AG-750-30` |
| `g:additional_image_link` | 📸 Media | Imágenes adicionales | `https://...AG029_back.webp` |
| `g:sale_price` | 💰 Media | Precio en oferta (si aplica) | `22.00 USD` |
| `g:sale_price_effective_date` | 💰 Media | Fechas de la oferta | `2026-01-15T00:00/2026-01-31T23:59` |

---

## 🚨 Requisitos CRÍTICOS del Sitio Web

### 1. **Age Gate (Verificación de Edad) - OBLIGATORIO**

Tu sitio web **DEBE** tener una pantalla de verificación de edad antes de mostrar productos de alcohol.

**Ejemplo de implementación:**

```typescript
// la-huequita-web/components/AgeGate.tsx
'use client';

import { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

export default function AgeGate({ children }: { children: React.ReactNode }) {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ageVerified = getCookie('age_verified');
    if (ageVerified === 'true') {
      setVerified(true);
    }
    setLoading(false);
  }, []);

  const handleVerify = (isAdult: boolean) => {
    if (isAdult) {
      setCookie('age_verified', 'true', { maxAge: 60 * 60 * 24 * 30 }); // 30 días
      setVerified(true);
    } else {
      window.location.href = 'https://www.google.com';
    }
  };

  if (loading) return <div>Cargando...</div>;

  if (!verified) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <div className="bg-surface-dark p-8 rounded-2xl max-w-md text-center border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-4">
            Verificación de Edad
          </h1>
          <p className="text-gray-400 mb-8">
            Este sitio contiene productos alcohólicos. Debes ser mayor de 18 años para continuar.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleVerify(true)}
              className="flex-1 bg-primary text-black font-bold py-3 px-6 rounded-lg hover:bg-primary/90"
            >
              Soy mayor de 18
            </button>
            <button
              onClick={() => handleVerify(false)}
              className="flex-1 bg-white/10 text-white font-bold py-3 px-6 rounded-lg hover:bg-white/20"
            >
              Soy menor de 18
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-6">
            Al continuar, confirmas que tienes la edad legal para consumir alcohol en Ecuador.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

**Implementación en Layout:**

```typescript
// la-huequita-web/app/layout.tsx
import AgeGate from '@/components/AgeGate';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AgeGate>
          {children}
        </AgeGate>
      </body>
    </html>
  );
}
```

---

### 2. **Información de ABV (Alcohol By Volume) - OBLIGATORIO**

El **porcentaje de alcohol** debe estar visible en:
- ✅ Título del producto
- ✅ Descripción del producto
- ✅ Página de detalle del producto

**Ejemplo:**
```
Título: "Aguardiente Amarillo 750ml 30% ABV"
Descripción: "Contenido alcohólico: 30% vol."
```

---

### 3. **Páginas Legales Requeridas:**

Google verificará que tu sitio tenga estas páginas:

- [ ] **Política de Devoluciones** (`/politicas/devoluciones`)
- [ ] **Política de Privacidad** (`/politicas/privacidad`)
- [ ] **Términos y Condiciones** (`/terminos`)
- [ ] **Información de Contacto** (`/contacto`)

**Contenido mínimo para Política de Devoluciones (Alcohol):**

```markdown
# Política de Devoluciones

## Productos Alcohólicos

Debido a regulaciones sanitarias y legales en Ecuador, **NO aceptamos devoluciones de productos alcohólicos** una vez entregados, excepto en casos de:

- Producto defectuoso o dañado durante el transporte
- Error en el pedido (producto incorrecto enviado)

### Proceso de Reclamo:
1. Contactar a servicio al cliente dentro de 24 horas de recibido el pedido
2. Enviar fotos del producto dañado
3. Esperar aprobación del reclamo
4. Reemplazo o reembolso según el caso

**Nota:** Todos los pedidos requieren verificación de edad (18+) al momento de la entrega.
```

---

## 🛠️ Ejemplo de Feed XML Completo para Alcohol

```xml
<?xml version="1.0"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>La Huequita - Licorería Premium en Quito</title>
    <link>https://lahuequita.com.ec</link>
    <description>Licores premium con delivery rápido en Quito</description>
    
    <!-- Ejemplo: Aguardiente -->
    <item>
      <g:id>AG029</g:id>
      <g:title>Aguardiente Amarillo 750ml 30% ABV - Delivery Quito</g:title>
      <g:description>Aguardiente tradicional ecuatoriano de alta calidad. Ideal para cocteles y celebraciones. Contenido alcohólico 30% vol. Botella de vidrio de 750ml. Disponible con delivery rápido en Quito. Producto para mayores de 18 años.</g:description>
      <g:link>https://lahuequita.com.ec/producto/aguardiente-amarillo</g:link>
      <g:image_link>https://api.ledgerxpertz.com/media/productos/AG029.webp</g:image_link>
      <g:additional_image_link>https://api.ledgerxpertz.com/media/productos/AG029_back.webp</g:additional_image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>25.00 USD</g:price>
      <g:brand>Zhumir</g:brand>
      <g:gtin>7501234567890</g:gtin>
      <g:mpn>AG-750-30</g:mpn>
      <g:product_type>Bebidas > Licores > Aguardiente</g:product_type>
      <g:google_product_category>499676</g:google_product_category>
      <g:age_group>adult</g:age_group>
    </item>
    
    <!-- Ejemplo: Whisky -->
    <item>
      <g:id>WH001</g:id>
      <g:title>Whisky Johnnie Walker Black Label 750ml 40% ABV</g:title>
      <g:description>Whisky escocés premium Johnnie Walker Black Label. Mezcla de whiskies de malta y grano envejecidos mínimo 12 años. Notas ahumadas y suaves. 40% vol. Botella de 750ml. Delivery en Quito. Solo para mayores de 18 años.</g:description>
      <g:link>https://lahuequita.com.ec/producto/johnnie-walker-black</g:link>
      <g:image_link>https://api.ledgerxpertz.com/media/productos/WH001.webp</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>in stock</g:availability>
      <g:price>45.00 USD</g:price>
      <g:sale_price>39.99 USD</g:sale_price>
      <g:sale_price_effective_date>2026-01-15T00:00/2026-01-31T23:59</g:sale_price_effective_date>
      <g:brand>Johnnie Walker</g:brand>
      <g:gtin>5000267024523</g:gtin>
      <g:product_type>Bebidas > Licores > Whisky > Whisky Escocés</g:product_type>
      <g:google_product_category>499676</g:google_product_category>
      <g:age_group>adult</g:age_group>
    </item>
    
  </channel>
</rss>
```

---

## 🚫 Contenido PROHIBIDO en Títulos y Descripciones

Google rechazará productos que incluyan:

### ❌ Lenguaje Irresponsable:
- "Get drunk fast"
- "Party starter"
- "Emborráchate rápido"
- "Para la fiesta loca"

### ❌ Beneficios Falsos:
- "Mejora tu vida sexual"
- "Te hace más exitoso"
- "Aumenta tu rendimiento deportivo"
- "Beneficios para la salud"

### ❌ Imágenes Prohibidas:
- Personas menores de 25 años consumiendo alcohol
- Consumo excesivo o competencias de bebida
- Alcohol + conducción de vehículos
- Alcohol + maquinaria pesada

### ✅ Lenguaje Permitido:
- "Ideal para cocteles"
- "Perfecto para celebraciones"
- "Sabor premium"
- "Tradición ecuatoriana"
- "Delivery rápido"

---

## 📊 Checklist de Validación Pre-Envío

Antes de subir tu feed a Merchant Center, verifica:

### Datos del Producto:
- [ ] Todos los productos tienen `g:id` único
- [ ] Títulos incluyen tamaño y ABV (ej: "750ml 30% ABV")
- [ ] Descripciones tienen mínimo 150 caracteres
- [ ] Todas las URLs (`g:link`) son accesibles y HTTPS
- [ ] Todas las imágenes (`g:image_link`) son accesibles y HTTPS
- [ ] Precios coinciden exactamente con los del sitio web
- [ ] Stock (`g:availability`) está actualizado

### Atributos Específicos de Alcohol:
- [ ] `g:google_product_category` = `499676` (o subcategoría)
- [ ] `g:age_group` = `adult` en todos los productos
- [ ] Todos los productos tienen `g:brand`
- [ ] ABV está visible en título o descripción

### Sitio Web:
- [ ] Age Gate implementado y funcionando
- [ ] Página de Política de Devoluciones creada
- [ ] Página de Política de Privacidad creada
- [ ] Página de Términos y Condiciones creada
- [ ] Información de contacto visible
- [ ] ABV visible en cada página de producto

### Merchant Center:
- [ ] Cuenta creada y verificada
- [ ] Dominio verificado
- [ ] Configuración de "Adult-oriented content" habilitada
- [ ] Información del negocio completa
- [ ] Configuración de envío y tax correcta

---

## 🔍 Errores Comunes y Soluciones

### Error: "Missing age_group attribute"
**Solución:** Agregar `<g:age_group>adult</g:age_group>` a cada producto.

### Error: "Invalid google_product_category"
**Solución:** Usar `499676` o una subcategoría válida de "Alcoholic Beverages".

### Error: "Website does not have age verification"
**Solución:** Implementar Age Gate como se muestra arriba.

### Error: "Price mismatch"
**Solución:** Asegurar que el precio en el feed coincida EXACTAMENTE con el del sitio web.

### Error: "Image not accessible"
**Solución:** Verificar que las URLs de imágenes sean HTTPS y públicamente accesibles.

### Warning: "Missing GTIN"
**Solución:** Agregar código de barras si está disponible. Si no, agregar `<g:identifier_exists>no</g:identifier_exists>`.

---

## 📈 Optimización para Mejor Rendimiento

### Títulos Optimizados:
```
❌ Malo: "Aguardiente"
✅ Bueno: "Aguardiente Amarillo 750ml 30% ABV - Delivery Quito"
```

### Descripciones Optimizadas:
```
❌ Malo: "Aguardiente de buena calidad."
✅ Bueno: "Aguardiente tradicional ecuatoriano de alta calidad. Ideal para cocteles y celebraciones. Contenido alcohólico 30% vol. Botella de vidrio de 750ml. Disponible con delivery rápido en Quito. Producto para mayores de 18 años. Sabor suave y auténtico."
```

### Imágenes Optimizadas:
- Formato: WebP ✅ (ya lo tienes)
- Tamaño: 1000x1000px mínimo
- Peso: <150KB
- Fondo: Transparente o "Luxury Dark" ✅ (ya lo tienes)
- Calidad: Alta resolución, bien iluminada

---

## 🎯 Próximos Pasos

1. **Agregar ABV a tu Base de Datos:**
   - Crear campo `abv` (Decimal) en modelo `Producto`
   - Migrar datos existentes
   - Actualizar formularios de admin

2. **Implementar Age Gate:**
   - Crear componente `AgeGate.tsx`
   - Agregar a `layout.tsx`
   - Probar en localhost

3. **Crear Páginas Legales:**
   - `/politicas/devoluciones`
   - `/politicas/privacidad`
   - `/terminos`

4. **Actualizar Feed XML:**
   - Modificar template para incluir `age_group`
   - Agregar ABV al título
   - Incluir GTIN si está disponible

5. **Validar en Merchant Center:**
   - Subir feed de prueba
   - Corregir errores reportados
   - Solicitar aprobación

---

**Última actualización:** Enero 2026  
**Versión:** 1.0  
**Responsable:** Equipo La Huequita
