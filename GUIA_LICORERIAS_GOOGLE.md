# 🍷 Guía Técnica: E-commerce de Licores & Google Merchant Center

**Última Actualización:** Enero 2026
**Objetivo:** Guía de implementación estándar para tiendas de alcohol que deseen certificar su feed en Google Shopping sin bloqueos.

---

## 1. 🛡️ Barrera de Edad (Age Gate)

Google exige que impidas el acceso a menores, pero **NO debes bloquear a su robot (Googlebot)**.

### ❌ Lo que NO debes hacer:
*   **Splash Pages:** Páginas de bienvenida `index.html` separadas que tienen un botón "Entrar". (Mala UX, rompe Deep Linking).
*   **Ocultar Contenido (`display: none`):** Si el modal oculta el HTML del producto, Google no puede leer el precio ni el stock y rechazará tus productos.

### ✅ La Implementación Correcta (SEO Friendly):
1.  **Modal Global (Overlay):** Un componente que "flota" sobre la web.
2.  **Renderizado Completo:** La página web (productos, precios) debe cargarse completa en el código HTML "detrás" del modal.
3.  **Ofuscación Visual:** Usa CSS para desenfocar el fondo, no para eliminarlo.
    ```css
    /* Correcto */
    .content-blocked { filter: blur(5px); pointer-events: none; }
    
    /* Incorrecto (Google no lee esto) */
    .content-blocked { display: none; }
    ```
4.  **Persistencia:** Usa una Cookie (`age_verified=true`) por 30 días para no molestar al usuario recurrente.

---

## 2. ⚖️ Footer & Legal

El pie de página debe ser explícito en TODAS las URLs.

**Texto Obligatorio:**
> "Prohibida la venta de bebidas alcohólicas a menores de 18 años. Bebe con moderación. El consumo excesivo es perjudicial para la salud."

---

## 3. 🏷️ Taxonomía Oficial de Google (IDs Críticos)

Usar los IDs incorrectos es la causa #1 de rechazos. No uses IDs genericos o antiguos.

| Categoría | Google ID | Descripción (Inglés/Español) | Uso Correcto |
|-----------|-----------|------------------------------|--------------|
| **CERVEZA** | `496` | Beer | Pilsener, Artesanal, Club |
| **VINO** | `497` | Wine | Tinto, Blanco, Rosado, Espumoso |
| **LICORES (Genérico)**| `498` | Liquor & Spirits | **Aguardiente, Zhumir**, Pajarete |
| **RON** | `5768` | Rum | Solo Ron (Abuelo, Castillo) |
| **WHISKY** | `5771` | Whiskey | Solo Whisky (JW, Chivas) |
| **VODKA** | `5770` | Vodka | Absolut, Smirnoff |
| **TEQUILA** | `5769` | Tequila | José Cuervo, Don Julio |
| **GIN** | `5766` | Gin | Beefeater, Tanqueray |
| **LICOR HIERBAS** | `5767` | Liqueurs | Jägermeister, Cremas |
| **BEBIDAS NO ALC.** | `436` | Soft Drinks | Gaseosas, Colas |
| **AGUA CON GAS** | `543531` | Sparkling Water | Güitig, San Pellegrino |
| **ENERGIZANTES** | `5723` | Energy & Sports Drinks | V220, Monster |

**⚠️ Nota Importante:** Evita usar el ID `499`. Google lo asocia a Sidra (Hard Cider) en algunas regiones. Ante la duda para un licor fuerte, usa **498**.

---

## 4. 📦 Estrategia de Feed de Datos

### Estructura de URLs
*   Mantén consistencia. Si tu web abre productos en `/productos/slug`, tu feed XML debe enviar `/productos/slug`.
*   Un simple cambio de plural a singular (`/producto/`) puede causar errores 404 masivos.

### Override por Producto (Casos Híbridos)
Implementa un campo en el CMS para **sobrescribir** la categoría por defecto.
*   *Ejemplo:* Un "Pack de Regalo (Ron + Vasos)" está en la categoría "Ron", pero en Google debería ser "Sets de Regalo" (`53`) o "Cestas de Regalo" (`666`).

---

## 5. 📸 Imágenes
*   Fondo blanco o transparente preferido.
*   Sin marcas de agua, logos superpuestos ni texto promocional ("Oferta").
*   Mínimo 800x800 px.

---

*Documento generado para La Huequita Web - Estandarización de Licorerías.*
