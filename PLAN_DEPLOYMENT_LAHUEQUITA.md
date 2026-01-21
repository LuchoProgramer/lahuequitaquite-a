# 🚀 Plan de Deployment - lahuequitaquitena.com

## ✅ Archivos Configurados

- [x] `public/robots.txt` - Acceso completo para IAs
- [x] `app/sitemap.ts` - Sitemap dinámico con productos
- [x] `.env.local` - Dominio actualizado
- [x] `app/feed.xml/route.ts` - Feed para Google Merchant Center

---

## 📋 Checklist de Deployment

### Paso 1: Deploy a Vercel (15 minutos)

```bash
cd /Users/luisviteri/Proyectos/Inventario/la-huequita-web

# Login
vercel login

# Deploy inicial
vercel

# Configurar variables de entorno
vercel env add NEXT_PUBLIC_API_URL production
# Valor: https://api.ledgerxpertz.com/api

vercel env add NEXT_PUBLIC_TENANT_ID production
# Valor: la_huequita

vercel env add NEXT_PUBLIC_SITE_URL production
# Valor: https://lahuequitaquitena.com

vercel env add REVALIDATION_SECRET production
# Valor: OTqOn8R7t3N8jhKxKNGV4HBFUSVfvlcckpyPQNg0Pa0

# Deploy a producción
vercel --prod
```

**Resultado:** URL temporal de Vercel (ej: `la-huequita-web-xxx.vercel.app`)

---

### Paso 2: Conectar Dominio (30 minutos)

#### 2.1 Agregar Dominio en Vercel

**Dashboard:**
1. https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Settings → Domains
4. Add Domain: `lahuequitaquitena.com`
5. También agregar: `www.lahuequitaquitena.com`

**CLI:**
```bash
vercel domains add lahuequitaquitena.com
vercel domains add www.lahuequitaquitena.com
```

#### 2.2 Configurar DNS

Vercel te dará estos registros:

**Para dominio raíz (lahuequitaquitena.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Para www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

#### 2.3 Agregar en tu Proveedor de Dominio

Ve al panel de tu proveedor (GoDaddy, Namecheap, etc.) y agrega estos registros.

#### 2.4 Esperar Propagación

⏱️ 15-30 minutos (máximo 48 horas)

Verificar:
```bash
dig lahuequitaquitena.com
nslookup lahuequitaquitena.com
```

---

### Paso 3: Verificar Funcionamiento (10 minutos)

Una vez que el dominio esté activo:

#### 3.1 Verificar Sitio Principal
```
https://lahuequitaquitena.com
```
- [ ] Age Gate aparece
- [ ] Productos se cargan
- [ ] Imágenes funcionan

#### 3.2 Verificar Robots.txt
```
https://lahuequitaquitena.com/robots.txt
```
Deberías ver el archivo con las configuraciones de IAs.

#### 3.3 Verificar Sitemap
```
https://lahuequitaquitena.com/sitemap.xml
```
Deberías ver XML con todas las páginas y productos.

#### 3.4 Verificar Feed de Google Merchant
```
https://lahuequitaquitena.com/feed.xml
```
Deberías ver XML con productos para Google Shopping.

---

### Paso 4: Google Search Console (15 minutos)

#### 4.1 Agregar Propiedad

1. https://search.google.com/search-console
2. Agregar propiedad → **Propiedad de dominio**
3. Dominio: `lahuequitaquitena.com`

#### 4.2 Verificar con DNS

Google te dará un registro TXT:

```
Type: TXT
Name: @
Value: google-site-verification=ABC123XYZ...
TTL: 3600
```

Agrégalo en tu proveedor de dominio.

#### 4.3 Verificar

Espera 5-10 minutos y click "Verificar".

#### 4.4 Enviar Sitemaps

Una vez verificado:
1. Sitemaps → Agregar nuevo sitemap
2. URL: `https://lahuequitaquitena.com/sitemap.xml`
3. Enviar

Repetir con:
- `https://lahuequitaquitena.com/feed.xml`

---

### Paso 5: Google Merchant Center (45 minutos)

#### 5.1 Crear Cuenta

1. https://merchants.google.com
2. País: **Ecuador**
3. Nombre: **La Huequita Quiteña**

#### 5.2 Información del Negocio

```
Nombre comercial: La Huequita Quiteña
Dirección: [Tu dirección en Quito]
Teléfono: [Tu teléfono]
Email: [Tu email]
Sitio web: https://lahuequitaquitena.com
```

#### 5.3 Verificar Sitio Web

1. Herramientas → Información empresarial
2. Sitio web: `https://lahuequitaquitena.com`
3. Verificar y reclamar
4. Método: **Google Search Console** (ya verificado)
5. ✅ Debería verificarse automáticamente

#### 5.4 Configurar Envío

```
Método: Entrega local
Área: Quito, Ecuador
Costo: [Tu tarifa]
Tiempo: 1-2 días hábiles
```

#### 5.5 Política de Devoluciones

```
Período: 7 días
Condiciones: Producto sin abrir, en empaque original
Costo de devolución: A cargo del cliente
```

#### 5.6 Productos para Adultos

1. Información empresarial → Productos para adultos
2. ✅ Marcar: "Vendo productos alcohólicos"
3. Subir documentación:
   - Licencia de venta de alcohol
   - Registro sanitario
   - RUC

#### 5.7 Agregar Feed de Productos

1. Productos → Feeds → + (Agregar feed)
2. Configuración:
   ```
   País: Ecuador
   Idioma: Español
   Destinos: ✅ Anuncios de Shopping gratuitos
   Nombre: La Huequita - Productos
   ```

3. Método de entrada:
   ```
   Tipo: Obtención programada
   URL: https://lahuequitaquitena.com/feed.xml
   Frecuencia: Diaria
   Hora: 02:00 AM
   ```

4. Crear feed

#### 5.8 Esperar Procesamiento

⏱️ 24-48 horas

Revisar en: Productos → Diagnóstico

---

### Paso 6: Actualizar Backend (5 minutos)

El backend tiene hardcoded el dominio. Hay que actualizarlo:

**Archivo:** `LedgerXpertz/core/api_google_merchant.py`

Línea 109:
```python
# Cambiar de:
frontend_base_url = "https://lahuequitaquitena.com"

# A (si quieres hacerlo dinámico):
frontend_base_url = os.getenv('FRONTEND_URL', 'https://lahuequitaquitena.com')
```

O dejarlo como está si el dominio es correcto.

---

## 🎯 URLs Finales

Una vez completado todo:

| Recurso | URL |
|---------|-----|
| **Sitio Web** | https://lahuequitaquitena.com |
| **Robots.txt** | https://lahuequitaquitena.com/robots.txt |
| **Sitemap** | https://lahuequitaquitena.com/sitemap.xml |
| **Feed Google** | https://lahuequitaquitena.com/feed.xml |
| **UCP Catalog** | https://lahuequitaquitena.com/api/ucp/catalog |
| **Términos** | https://lahuequitaquitena.com/terminos |
| **Privacidad** | https://lahuequitaquitena.com/privacidad |
| **Políticas** | https://lahuequitaquitena.com/politicas |

---

## ✅ Verificación Final

### Checklist Completo

- [ ] Dominio apunta a Vercel (DNS configurado)
- [ ] HTTPS funcionando (certificado SSL automático)
- [ ] Age Gate aparece correctamente
- [ ] Productos se cargan desde API
- [ ] Imágenes se ven correctamente
- [ ] robots.txt accesible
- [ ] sitemap.xml accesible
- [ ] feed.xml accesible y con productos
- [ ] Google Search Console verificado
- [ ] Sitemaps enviados a Search Console
- [ ] Google Merchant Center configurado
- [ ] Feed procesado sin errores
- [ ] Documentación de alcohol subida

### Tests de IAs

Una vez todo configurado, prueba:

**ChatGPT:**
```
"Busca licorerías en Quito con delivery"
```

**Gemini:**
```
"¿Dónde puedo comprar aguardiente en Quito?"
```

**Google:**
```
"licorería quito delivery"
```

Deberías aparecer en los resultados.

---

## 📊 Monitoreo Post-Launch

### Primeros 7 Días

- [ ] Revisar Google Search Console diariamente
- [ ] Verificar errores en Merchant Center
- [ ] Monitorear tráfico en Vercel Analytics
- [ ] Revisar logs de errores

### Métricas a Seguir

1. **Search Console:**
   - Impresiones
   - Clics
   - CTR
   - Posición promedio

2. **Merchant Center:**
   - Productos aprobados
   - Productos rechazados
   - Impresiones en Shopping
   - Clics desde Shopping

3. **Vercel:**
   - Visitas totales
   - Páginas más visitadas
   - Errores 404/500

---

## 🐛 Troubleshooting

### Error: "Dominio no resuelve"

**Solución:**
```bash
# Verificar DNS
dig lahuequitaquitena.com

# Si no resuelve, esperar más tiempo
# DNS puede tardar hasta 48h
```

### Error: "Feed no se puede obtener"

**Solución:**
1. Verificar: https://lahuequitaquitena.com/feed.xml
2. Si da error, revisar logs en Vercel
3. Verificar que backend esté respondiendo

### Error: "Productos rechazados en Merchant Center"

**Solución:**
1. Ir a Productos → Diagnóstico
2. Leer error específico
3. Corregir en backend (LedgerXpertz)
4. Esperar próxima sincronización

---

## 📞 Soporte

- **Vercel**: https://vercel.com/support
- **Google Merchant Center**: https://support.google.com/merchants
- **Google Search Console**: https://support.google.com/webmasters

---

## 🎉 ¡Listo para Lanzar!

**Tiempo total estimado:** 2-3 horas

**Próximo paso:** Ejecutar Paso 1 (Deploy a Vercel)

¿Empezamos? 🚀
