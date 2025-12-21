# Plan de Implementación: La Huequita Quiteña E-commerce

Este documento detalla la hoja de ruta técnica para transformar el sistema de inventario LedgerXpertz en una plataforma de e-commerce multi-tenant, comenzando con el piloto "La Huequita Quiteña".

## 1. Preparación del Backend (LedgerXpertz)
- **Modificación de Modelos:**
    - `Producto`: Añadir `slug`, `mostrar_en_web`, `es_premium`, `meta_descripcion`.
    - Migraciones controladas para no afectar datos existentes.
- **Seguridad y API:**
    - Creación de `core/api_publico.py` para permitir consultas GET sin autenticación.
    - Configuración de CORS para permitir peticiones desde el dominio del frontend.
- **Lógica de Negocio:**
    - Endpoint para validar stock real por sucursal antes de permitir el checkout.

## 2. Frontend de Próxima Generación (Next.js)
- **Framework:** Next.js 15 (App Router).
- **Estética:** White & Black (B&W) Premium con acentos dorados.
- **SEO:** 
    - Generación dinámica de Metadatos.
    - ISR (Incremental Static Regeneration) para fichas de productos.
    - JSON-LD para resultados enriquecidos en Google.
- **UX:** Mobile-first, botones de acción rápida, integración nativa con WhatsApp para soporte.

## 3. Integración Multi-tenant
- Uso del header `X-Tenant` en las peticiones desde Next.js.
- El frontend detectará el subdominio y cambiará automáticamente el contexto de la base de datos en el backend.

---
**Estado Actual:** Git Status verificado. Pendiente push de seguridad.
**Próximo Paso:** Modificación quirúrgica del modelo `Producto` en el backend.
