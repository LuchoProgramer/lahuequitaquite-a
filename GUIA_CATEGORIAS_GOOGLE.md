# Guía de Categorías para Google Merchant Center
**Proyecto:** La Huequita Quiteña (LedgerXpertz)

Esta guía documenta qué categorías internas del sistema se deben usar para que los productos aparezcan correctamente en Google Shopping y no sean bloqueados.

## ⚠️ Reglas de Oro
1.  **NO usar categorías genéricas** como "Bebidas" o "Varios" para licores. Usar la específica (Ron, Vodka, etc.).
2.  **Aguas y Gaseosas:** Deben ir en `BEBIDAS NO ALCOHÓLICAS`. Si las pones en otra categoría, Google podría pedir licencia de alcohol.
3.  **Cigarrillos:** Están prohibidos en Google Shopping. El sistema los filtra automáticamente si la categoría es `CIGARRILLOS` o `TABACO`.

## Mapa de Categorías

| Tu Categoría (Sistema) | Lo que interpreta Google | Nota Importante |
| :--- | :--- | :--- |
| **AGUAS / GASEOSAS / ENERGIZANTES** | **Soft Drinks (436)** | ✅ **USAR ESTA PARA NO-ALCOHOL**. Evita bloqueos. |
| **CERVEZA** | Beer | |
| **VINOS** | Wine | |
| **WHISKY** | Whiskey | |
| **RON** | Rum | |
| **VODKA** | Vodka | |
| **TEQUILA** | Tequila | |
| **GIN** | Gin | |
| **BRANDY / COGNAC** | Brandy | |
| **LICORES / DIGESTIVOS** | Liqueurs | Para Jagermeister, licores de sabor, etc. |
| **AGUARDIENTE / ZHUMIR** | Spirits (General) | |
| **CONFITERÍA / SNACKS** | Snacks | |
| **CIGARRILLOS** | 🚫 **PROHIBIDO** | El sistema NO enviará estos productos a Google. |

## ¿Qué pasa si creo una categoría nueva?
Si creas una categoría nueva (ej: "Sake"), el sistema la enviará por defecto como **"Spirits" (Licores)**.
Si la nueva categoría es NO alcohólica (ej: "Jugos"), debes avisar al desarrollador para agregarla al mapa de excepciones, o usar `BEBIDAS NO ALCOHÓLICAS`.
