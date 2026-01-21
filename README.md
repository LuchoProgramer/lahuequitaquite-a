# 🍾 La Huequita Web - E-commerce Frontend

> **Frontend de comercio electrónico para el sistema multi-tenant LedgerXpertz**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)

---

## 📋 Descripción

**La Huequita Web** es el proyecto piloto que transforma [LedgerXpertz](https://api.ledgerxpertz.com) (sistema de inventario multi-tenant) en una plataforma completa de e-commerce. Este frontend demuestra cómo un tenant puede tener su propia tienda online conectada al inventario en tiempo real.

### Características Principales

- ✅ **Age Gate** - Verificación de edad para productos alcohólicos
- ✅ **Catálogo en Tiempo Real** - Stock sincronizado con LedgerXpertz
- ✅ **Multi-Sucursal** - Selección de sucursal y stock por ubicación
- ✅ **SEO Optimizado** - Metadata, sitemap, y Google Merchant Center ready
- ✅ **Diseño Premium** - Estética moderna con Tailwind CSS 4
- ✅ **Responsive** - Mobile-first design
- ✅ **TypeScript** - Type safety en todo el código

---

## 🏗️ Arquitectura

```
┌─────────────────────┐
│   tudominio.com     │  ← Frontend (Next.js en Vercel)
│   (Este repo)       │
└──────────┬──────────┘
           │ API Calls
           │ X-Tenant: la_huequita
           ↓
┌─────────────────────┐
│  LedgerXpertz API   │  ← Backend (Django Multi-Tenant)
│  api.ledgerxpertz   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│   PostgreSQL        │  ← Base de Datos (Schema: la_huequita)
└─────────────────────┘
```

Ver [ARQUITECTURA.md](./ARQUITECTURA.md) para más detalles.

---

## 🚀 Quick Start

### Prerequisitos

- Node.js 18+ 
- npm o yarn
- Acceso al backend LedgerXpertz

### Instalación

```bash
# Clonar el repositorio
git clone git@github.com:LuchoProgramer/lahuequitaquite-a.git
cd lahuequitaquite-a

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ⚙️ Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# URL del Backend Django
NEXT_PUBLIC_API_URL=https://api.ledgerxpertz.com/api

# Tenant ID para este deploy
NEXT_PUBLIC_TENANT_ID=la_huequita

# URL del sitio web (para feed de productos y SEO)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Token secreto para revalidación de caché (Webhooks de Django)
REVALIDATION_SECRET=tu_token_secreto_aqui
```

---

## 📁 Estructura del Proyecto

```
la-huequita-web/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Home con Age Gate
│   ├── productos/           # Catálogo de productos
│   ├── producto/[slug]/     # Detalle de producto
│   ├── terminos/            # Términos y condiciones
│   ├── privacidad/          # Política de privacidad
│   ├── politicas/           # Políticas de la tienda
│   ├── feed.xml/            # Feed para Google Merchant Center
│   └── api/                 # API Routes
├── components/              # Componentes React
│   ├── AgeGate.tsx         # Verificación de edad
│   ├── catalog/            # Componentes del catálogo
│   ├── products/           # Componentes de productos
│   ├── tienda/             # Componentes de la tienda
│   └── common/             # Componentes comunes
├── lib/                     # Utilidades
│   ├── api.ts              # Cliente API para LedgerXpertz
│   └── types.ts            # Tipos TypeScript
├── contexts/               # React Contexts
│   ├── CartContext.tsx     # Estado del carrito
│   └── BranchContext.tsx   # Selección de sucursal
├── middleware.ts           # Middleware de Next.js (Age Gate)
└── docs/                   # Documentación adicional
```

---

## 📚 Documentación

- **[ARQUITECTURA.md](./ARQUITECTURA.md)** - Arquitectura completa del sistema
- **[DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)** - Guía de deployment a Vercel
- **[SETUP_DOMINIO_Y_MERCHANT_CENTER.md](./SETUP_DOMINIO_Y_MERCHANT_CENTER.md)** - Configuración de dominio y Google Merchant Center
- **[SEO_STRATEGY.md](./SEO_STRATEGY.md)** - Estrategia SEO completa
- **[FEEDBACK.md](./FEEDBACK.md)** - Review técnico del proyecto
- **[UBER_EATS_INTEGRATION.md](./UBER_EATS_INTEGRATION.md)** - Integración con Uber Eats
- **[UNIVERSAL_COMMERCE_PROTOCOL.md](./UNIVERSAL_COMMERCE_PROTOCOL.md)** - Futuro del comercio con IA
- **[MERCHANT_CENTER_ALCOHOL_REQUIREMENTS.md](./MERCHANT_CENTER_ALCOHOL_REQUIREMENTS.md)** - Requisitos para productos alcohólicos
- **[PRICING_STRATEGY_DELIVERY.md](./PRICING_STRATEGY_DELIVERY.md)** - Estrategia de precios multi-plataforma

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 16.1.0 (App Router)
- **Lenguaje**: TypeScript 5
- **Estilos**: Tailwind CSS 4
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **Hosting**: Vercel

### Backend (LedgerXpertz)
- **Framework**: Django 4.x
- **API**: Django REST Framework
- **Base de Datos**: PostgreSQL (Multi-tenant con schemas)
- **Autenticación**: JWT (para endpoints privados)

---

## 🎯 Roadmap

### ✅ Fase 1: MVP (Completado)
- [x] Integración con API de LedgerXpertz
- [x] Age Gate
- [x] Catálogo de productos
- [x] Páginas de detalle
- [x] Diseño responsive
- [x] Páginas legales

### 🚧 Fase 2: E-commerce Completo (En Progreso)
- [ ] Checkout funcional
- [ ] Integración de pagos
- [ ] Sistema de pedidos
- [ ] Notificaciones (WhatsApp/Email)
- [ ] Google Analytics

### 📅 Fase 3: Optimización (Planificado)
- [ ] Google Merchant Center
- [ ] SEO avanzado (Schema.org, sitemap)
- [ ] Integración Uber Eats
- [ ] Universal Commerce Protocol (UCP)

---

## 🤝 Contribuir

Este es un proyecto privado para La Huequita. Si eres parte del equipo:

1. Crea una rama desde `main`
2. Haz tus cambios
3. Crea un Pull Request
4. Espera la revisión

---

## 📄 Licencia

Proyecto privado - Todos los derechos reservados © 2026 La Huequita

---

## 🔗 Enlaces

- **Sitio Web**: [tudominio.com](https://tudominio.com) (próximamente)
- **Backend API**: [api.ledgerxpertz.com](https://api.ledgerxpertz.com)
- **Documentación Backend**: Contactar al equipo de LedgerXpertz

---

## 📞 Soporte

Para preguntas técnicas o soporte:
- **Email**: [tu-email@ejemplo.com]
- **WhatsApp**: [Tu número]

---

**Desarrollado con ❤️ para La Huequita Quiteña**
