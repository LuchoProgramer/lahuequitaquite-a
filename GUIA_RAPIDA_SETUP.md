# 🚀 Guía Rápida: Dominio + Google Merchant Center

## Información Necesaria

Antes de comenzar, ten a mano:
- [ ] Tu dominio (ej: lahuequita.com)
- [ ] Acceso al panel de tu proveedor de dominio (GoDaddy, Namecheap, etc.)
- [ ] Cuenta de Google (para Merchant Center y Search Console)
- [ ] Licencia de venta de alcohol (para Merchant Center)

---

## Paso 1: Deploy a Vercel (15 minutos)

### 1.1 Login en Vercel

```bash
cd /Users/luisviteri/Proyectos/Inventario/la-huequita-web
vercel login
```

### 1.2 Deploy Inicial

```bash
vercel
```

Responde las preguntas:
- **Set up and deploy?** → `Y`
- **Which scope?** → Tu cuenta
- **Link to existing project?** → `N`
- **Project name?** → `la-huequita-web`
- **Directory?** → `.`
- **Override settings?** → `N`

Vercel te dará una URL temporal: `https://la-huequita-web-xxx.vercel.app`

### 1.3 Configurar Variables de Entorno

```bash
# API URL
vercel env add NEXT_PUBLIC_API_URL
# Valor: https://api.ledgerxpertz.com/api

# Tenant ID
vercel env add NEXT_PUBLIC_TENANT_ID
# Valor: la_huequita

# Site URL (temporal, luego cambiarás al dominio real)
vercel env add NEXT_PUBLIC_SITE_URL
# Valor: https://la-huequita-web-xxx.vercel.app

# Revalidation Secret
vercel env add REVALIDATION_SECRET
# Valor: OTqOn8R7t3N8jhKxKNGV4HBFUSVfvlcckpyPQNg0Pa0
```

### 1.4 Deploy a Producción

```bash
vercel --prod
```

✅ **Checkpoint**: Verifica que tu sitio funcione en la URL de Vercel

---

## Paso 2: Conectar Dominio Custom (30 minutos)

### 2.1 Agregar Dominio en Vercel

**Opción A: Dashboard**
1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `la-huequita-web`
3. Settings → Domains
4. Click "Add Domain"
5. Ingresa tu dominio: `tudominio.com`

**Opción B: CLI**
```bash
vercel domains add tudominio.com
```

### 2.2 Configurar DNS

Vercel te mostrará los registros DNS necesarios. Ejemplo:

**Para dominio raíz (tudominio.com):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Para www (www.tudominio.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 3600
```

### 2.3 Agregar Registros en tu Proveedor de Dominio

#### GoDaddy:
1. Login en GoDaddy
2. My Products → Domains → DNS
3. Add Record → Tipo A
4. Agregar los registros de Vercel

#### Namecheap:
1. Login en Namecheap
2. Domain List → Manage → Advanced DNS
3. Add New Record
4. Agregar los registros de Vercel

### 2.4 Esperar Propagación DNS

⏱️ Puede tardar 15-30 minutos (máximo 48 horas)

Verificar propagación:
```bash
dig tudominio.com
# o
nslookup tudominio.com
```

### 2.5 Actualizar Variable de Entorno

Una vez que el dominio esté activo:

```bash
vercel env rm NEXT_PUBLIC_SITE_URL production
vercel env add NEXT_PUBLIC_SITE_URL production
# Valor: https://tudominio.com
```

Redeploy:
```bash
vercel --prod
```

✅ **Checkpoint**: Verifica que `https://tudominio.com` funcione correctamente

---

## Paso 3: Google Search Console (15 minutos)

### 3.1 Agregar Propiedad

1. Ve a https://search.google.com/search-console
2. Click "Agregar propiedad"
3. Selecciona **"Propiedad de dominio"** (no URL prefix)
4. Ingresa: `tudominio.com` (sin https://)

### 3.2 Verificar con DNS

Google te dará un registro TXT:

```
Type: TXT
Name: @
Value: google-site-verification=ABC123XYZ...
TTL: 3600
```

### 3.3 Agregar TXT en tu Proveedor de Dominio

Igual que en el Paso 2.3, pero con el registro TXT de Google.

### 3.4 Verificar en Google

1. Espera 5-10 minutos
2. Click "Verificar" en Search Console
3. ✅ Deberías ver "Propiedad verificada"

✅ **Checkpoint**: Dominio verificado en Search Console

---

## Paso 4: Google Merchant Center (45 minutos)

### 4.1 Crear Cuenta

1. Ve a https://merchants.google.com
2. Click "Comenzar"
3. Selecciona país: **Ecuador**
4. Nombre del negocio: **La Huequita Quiteña**

### 4.2 Información del Negocio

```
Nombre: La Huequita Quiteña
Dirección: [Tu dirección física]
Teléfono: [Tu teléfono]
Email: [Tu email de contacto]
Sitio web: https://tudominio.com
```

### 4.3 Verificar y Reclamar Sitio Web

1. En Merchant Center: Herramientas → Información empresarial
2. Sección "Sitio web"
3. Ingresa: `https://tudominio.com`
4. Click "Verificar y reclamar"
5. Selecciona **"Google Search Console"**
6. ✅ Debería verificarse automáticamente (ya lo hiciste en Paso 3)

### 4.4 Configurar Envío

```
Método: Entrega local
Área de cobertura: Quito, Ecuador
Costo de envío: [Tu costo]
Tiempo de entrega: 1-2 días hábiles
```

### 4.5 Política de Devoluciones

```
Período: 7 días
Condiciones: Producto sin abrir
Costo: A cargo del cliente
```

### 4.6 Productos para Adultos

1. Herramientas → Información empresarial
2. Sección "Productos para adultos"
3. Marca: ✅ **"Vendo productos alcohólicos"**
4. Sube documentación:
   - Licencia de venta de alcohol
   - Registro sanitario
   - RUC

---

## Paso 5: Configurar Feed de Productos (30 minutos)

### 5.1 Verificar Feed

Primero, verifica que tu feed funcione:

```bash
# Abrir en navegador
open https://tudominio.com/feed.xml
```

Deberías ver un XML con tus productos.

### 5.2 Agregar Feed en Merchant Center

1. En Merchant Center: Productos → Feeds
2. Click "+" (Agregar feed)
3. Configuración:
   ```
   País de venta: Ecuador
   Idioma: Español
   Destinos: ✅ Anuncios de Shopping gratuitos
   Nombre del feed: La Huequita - Productos
   ```

4. Método de entrada:
   ```
   Tipo: Obtención programada
   URL: https://tudominio.com/feed.xml
   Frecuencia: Diaria
   Hora: 02:00 AM
   ```

5. Click "Crear feed"

### 5.3 Esperar Procesamiento

⏱️ Google procesará el feed en 24-48 horas

Puedes ver el estado en: Productos → Feeds → [Tu feed]

### 5.4 Revisar Diagnóstico

1. Productos → Diagnóstico
2. Revisa errores y advertencias
3. Corrige problemas si los hay

**Errores comunes:**
- Missing `gtin`: Agregar códigos de barras en el backend
- Invalid price: Verificar formato de precios
- Missing image: Verificar URLs de imágenes

---

## Paso 6: Verificación Final (15 minutos)

### Checklist Final

- [ ] Dominio funcionando con HTTPS
- [ ] Age Gate aparece correctamente
- [ ] Productos se cargan desde la API
- [ ] Feed XML accesible en `/feed.xml`
- [ ] Search Console verificado
- [ ] Merchant Center configurado
- [ ] Feed procesado sin errores

### Probar el Feed

```bash
# Validar XML
curl https://tudominio.com/feed.xml | head -50

# Verificar que tenga productos
curl https://tudominio.com/feed.xml | grep "<item>"
```

---

## Troubleshooting

### Error: "Feed no se puede obtener"

**Solución:**
1. Verifica que `https://tudominio.com/feed.xml` sea accesible
2. Verifica que el backend esté respondiendo
3. Revisa logs en Vercel: `vercel logs`

### Error: "Productos rechazados"

**Solución:**
1. Ve a Productos → Diagnóstico en Merchant Center
2. Lee el error específico
3. Corrige en el backend (LedgerXpertz)

### Error: "Dominio no verificado"

**Solución:**
1. Verifica que el TXT de Google esté en DNS
2. Espera 10-15 minutos
3. Intenta verificar de nuevo

---

## Próximos Pasos

Una vez que todo esté configurado:

1. **Monitorear Merchant Center**
   - Revisa diariamente por 1 semana
   - Corrige errores que aparezcan

2. **Optimizar Productos**
   - Agregar códigos de barras (GTIN)
   - Mejorar descripciones
   - Optimizar imágenes

3. **SEO**
   - Enviar sitemap a Search Console
   - Agregar Schema.org
   - Optimizar meta tags

---

## Tiempos Estimados

| Paso | Tiempo |
|------|--------|
| Deploy a Vercel | 15 min |
| Conectar dominio | 30 min |
| Search Console | 15 min |
| Merchant Center | 45 min |
| Configurar feed | 30 min |
| Verificación | 15 min |
| **TOTAL** | **2.5 horas** |

---

## Contactos de Soporte

- **Vercel**: https://vercel.com/support
- **Google Merchant Center**: https://support.google.com/merchants
- **Google Search Console**: https://support.google.com/webmasters

---

**¿Listo para comenzar?** 🚀

Dime cuál es tu dominio y empezamos con el Paso 1.
