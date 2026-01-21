# 🚀 Deploy a Vercel - La Huequita Web

## Paso 1: Login en Vercel

```bash
vercel login
```

Esto abrirá tu navegador para autenticarte.

---

## Paso 2: Deploy Inicial

Desde la raíz del proyecto, ejecuta:

```bash
vercel
```

El CLI te hará algunas preguntas:
- **Set up and deploy?** → `Y` (Yes)
- **Which scope?** → Selecciona tu cuenta/organización
- **Link to existing project?** → `N` (No, es nuevo)
- **What's your project's name?** → `la-huequita-web` (o el nombre que prefieras)
- **In which directory is your code located?** → `.` (directorio actual)
- **Want to override the settings?** → `N` (No, Next.js se detecta automáticamente)

Esto creará un **preview deployment** (no producción todavía).

---

## Paso 3: Configurar Variables de Entorno

Tienes **dos opciones**:

### Opción A: Desde la Terminal (Recomendado)

```bash
# Variable pública - API URL
vercel env add NEXT_PUBLIC_API_URL production
# Cuando te pregunte el valor, ingresa: https://api.ledgerxpertz.com/api

# Variable pública - Tenant ID
vercel env add NEXT_PUBLIC_TENANT_ID production
# Valor: la_huequita

# Variable pública - URL del sitio
vercel env add NEXT_PUBLIC_SITE_URL production
# Valor: https://tudominio.com (tu dominio custom)

# Variable privada - Secret para revalidación
vercel env add REVALIDATION_SECRET production
# Valor: OTqOn8R7t3N8jhKxKNGV4HBFUSVfvlcckpyPQNg0Pa0
```

### Opción B: Desde el Dashboard de Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto `la-huequita-web`
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://api.ledgerxpertz.com/api` | Production, Preview, Development |
| `NEXT_PUBLIC_TENANT_ID` | `la_huequita` | Production, Preview, Development |
| `NEXT_PUBLIC_SITE_URL` | `https://tudominio.com` | Production, Preview, Development |
| `REVALIDATION_SECRET` | `OTqOn8R7t3N8jhKxKNGV4HBFUSVfvlcckpyPQNg0Pa0` | Production, Preview, Development |

---

## Paso 4: Deploy a Producción

Una vez configuradas las variables de entorno:

```bash
vercel --prod
```

Esto hará el deploy a producción con todas las variables configuradas.

---

## 🎯 URLs Resultantes

Después del deploy, tendrás:

- **Producción**: `https://la-huequita-web.vercel.app` (o tu dominio custom)
- **Preview**: URLs únicas para cada commit/branch

---

## 🔄 Deploys Automáticos

Vercel ya está conectado a tu repositorio GitHub. Cada vez que hagas push:

- **Push a `main`** → Deploy automático a **Producción**
- **Push a otras branches** → Deploy automático a **Preview**

---

## 🌐 Configurar Dominio Custom (Opcional)

Si tienes un dominio propio:

1. Ve a **Settings** → **Domains** en Vercel
2. Agrega tu dominio (ej: `lahuequita.com`)
3. Configura los DNS según las instrucciones de Vercel

---

## ✅ Verificación Post-Deploy

Después del deploy, verifica:

1. ✅ La página carga correctamente
2. ✅ El Age Gate aparece para productos con alcohol
3. ✅ Los productos se cargan desde la API
4. ✅ Las páginas legales funcionan (términos, privacidad, políticas)
5. ✅ El middleware de edad funciona correctamente

---

## 🔧 Comandos Útiles

```bash
# Ver logs del deployment
vercel logs

# Listar todos tus proyectos
vercel list

# Ver información del proyecto actual
vercel inspect

# Eliminar un deployment específico
vercel remove [deployment-url]

# Pull de variables de entorno desde Vercel
vercel env pull
```

---

## 🐛 Troubleshooting

### Error: "Missing environment variables"
- Asegúrate de haber configurado todas las variables en Vercel
- Redeploy con `vercel --prod`

### Error: "API connection failed"
- Verifica que `NEXT_PUBLIC_API_URL` esté correcta
- Confirma que el backend Django esté accesible públicamente

### Error 404 en rutas
- Next.js maneja las rutas automáticamente
- Verifica que los archivos estén en la estructura correcta de `app/`

---

## 📝 Notas Importantes

> [!IMPORTANT]
> - El `REVALIDATION_SECRET` debe coincidir exactamente con el configurado en Django
> - Las variables con prefijo `NEXT_PUBLIC_` son visibles en el navegador
> - Nunca commitees el archivo `.env.local` al repositorio

> [!TIP]
> - Usa `vercel env pull` para descargar las variables de entorno localmente
> - Configura las variables para todos los ambientes (Production, Preview, Development)

---

## 🎉 ¡Listo!

Tu aplicación estará disponible en producción con todas las configuraciones necesarias.
