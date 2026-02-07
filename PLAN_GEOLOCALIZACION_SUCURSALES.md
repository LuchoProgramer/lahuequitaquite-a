# 🗺️ Plan de Implementación: Geolocalización de Sucursales

Este documento describe la estrategia técnica para implementar la selección automática de la sucursal más cercana al usuario en `la-huequita-web`.

## 1. Estado Actual

### ✅ Backend (LedgerXpertz)
*   La tabla `Sucursal` ya tiene los campos `latitud` y `longitud`.
*   El endpoint `/api/tienda/sucursales/` ya devuelve estas coordenadas públicamente.
*   **Faltante:** No existe lógica de cálculo de distancia en el backend (y no es necesaria, ver abajo).

### ❌ Frontend (La Huequita Web)
*   No tiene implementación de mapas ni solicitud de ubicación al usuario.
*   La selección de sucursal es 100% manual mediante el Dropdown del Navbar.

---

## 2. Estrategia Recomendada: "Cálculo en el Cliente"

Para evitar sobrecargar el servidor y reducir latencia, el navegador del usuario debe ser quien calcule qué sucursal está más cerca.

### Flujo Propuesto:
1.  **Frontend:** Al cargar la app, solicita permiso de ubicación (`navigator.geolocation`).
2.  **Frontend:** Obtiene la latitud/longitud del usuario.
3.  **Frontend:** Descarga la lista de todas las sucursales (ya lo hace actualmente).
4.  **Frontend:** Usa la fórmula "Haversine" (matemática simple) para medir la distancia entre el usuario y cada sucursal.
5.  **Acción:** Selecciona automáticamente la más cercana en el `BranchContext`.

---

## 3. Guía de Implementación Técnica

### Paso 1: Crear utilidad de distancia
Crear `lib/geolocation.ts` con la fórmula de Haversine para no depender de la API de Google (ahorro de costos).

```typescript
// lib/geolocation.ts

interface Coords {
    lat: number;
    lng: number;
}

export function calculateDistance(user: Coords, branch: Coords): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (branch.lat - user.lat) * (Math.PI / 180);
    const dLon = (branch.lng - user.lng) * (Math.PI / 180);
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(user.lat * (Math.PI / 180)) * Math.cos(branch.lat * (Math.PI / 180)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distancia en Kilómetros
}
```

### Paso 2: Actualizar `BranchContext.tsx`
Modificar el contexto para que ejecute la lógica al iniciar.

```typescript
// contexts/BranchContext.tsx (Pseudo-código)

useEffect(() => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const userCoords = { 
                lat: position.coords.latitude, 
                lng: position.coords.longitude 
            };
            
            // Buscar la sucursal con menor distancia
            let closestBranch = null;
            let minDistance = Infinity;
            
            availableBranches.forEach(branch => {
                if (branch.lat && branch.lng) {
                    const dist = calculateDistance(userCoords, { lat: branch.lat, lng: branch.lng });
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestBranch = branch;
                    }
                }
            });
            
            // Si hay una muy cerca (ej. < 10km), seleccionarla automáticamente
            if (closestBranch && minDistance < 10) {
                changeBranch(closestBranch);
                // Opcional: Mostrar Toast "Te asignamos a la sucursal X por cercanía"
            }
        });
    }
}, [availableBranches]);
```

### Paso 3: (Opcional) Visualización en Mapa
Solo si se desea mostrar visualmente, se integraría `@react-google-maps/api` en una página `/sucursales`.

*   **Costo:** La API de Javascript de Google Maps tiene un costo si superas las 28,000 cargas mensuales (aprox).
*   **Alternativa Gratis:** Usar solo el cálculo matemático (Paso 1) es **gratis e ilimitado**.

---

## 4. Conclusión
No necesitas tocar el Backend ni pagar API de Google Maps para lograr la funcionalidad de "Sucursal más cercana". Todo se puede resolver con matemáticas simples en el Frontend.
