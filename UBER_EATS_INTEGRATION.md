# 🚗 Guía de Integración: Uber Eats API para La Huequita

> **Documento Técnico:** Cómo integrar tu inventario con Uber Eats para delivery automatizado

---

## 🌎 Disponibilidad en Ecuador

### ✅ Uber Eats está ACTIVO en Ecuador

- **Ciudades disponibles:** Quito, Guayaquil, Cuenca, Conocoto
- **Categoría:** Licorería / Alcohol Delivery
- **Requisitos:** Licencia de venta de alcohol válida
- **Verificación de edad:** Integrada en la plataforma (ID check al delivery)

---

## 🎯 Beneficios de la Integración API

### **Sin API (Manual):**
- ❌ Actualizas el menú manualmente en Uber Eats Manager
- ❌ Recibes pedidos en tablet/email
- ❌ Actualizas stock manualmente
- ❌ Riesgo de vender productos agotados

### **Con API (Automatizado):**
- ✅ Menú sincronizado automáticamente desde tu base de datos
- ✅ Pedidos llegan directo a tu sistema (webhook)
- ✅ Stock actualizado en tiempo real
- ✅ Precios siempre correctos
- ✅ Gestión centralizada desde tu dashboard

---

## 🏗️ Arquitectura de Integración

### **Flujo de Datos:**

```
┌─────────────────────────────────────┐
│  PostgreSQL (la_huequita)           │
│  - Productos                        │
│  - Stock                            │
│  - Precios                          │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Django Backend                     │
│  - Sincroniza menú con Uber Eats    │
│  - Recibe pedidos vía webhook       │
│  - Actualiza stock automáticamente  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Uber Eats API                      │
│  - Menu API (sincronización)        │
│  - Order API (gestión de pedidos)   │
│  - Store API (configuración)        │
└─────────────────────────────────────┘
```

### **Flujo de Pedidos:**

```
Cliente en Uber Eats App
    ↓
Hace pedido de "Aguardiente Amarillo"
    ↓
Uber Eats envía webhook a tu servidor
    ↓
Django recibe notificación (orders.notification)
    ↓
Django consulta detalles del pedido (GET /orders/{id})
    ↓
Django verifica stock en PostgreSQL
    ↓
Django acepta/rechaza pedido (POST /accept_pos_order)
    ↓
Si acepta: Descuenta stock automáticamente
    ↓
Uber asigna repartidor
    ↓
Cliente recibe su pedido
```

---

## 📋 APIs Disponibles de Uber Eats

### **1. Menu API (Sincronización de Productos)**

**Endpoints principales:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/eats/stores/{store_id}/menus` | Obtener menú actual |
| `PUT` | `/eats/stores/{store_id}/menus` | Reemplazar menú completo |
| `POST` | `/eats/stores/{store_id}/menus/items/{item_id}` | Actualizar producto individual |

**Estructura del Menú:**

```json
{
  "menus": [
    {
      "id": "menu_aguardientes",
      "title": {
        "translations": {
          "es-EC": "Aguardientes"
        }
      },
      "categories": [
        {
          "id": "cat_aguardiente",
          "title": {
            "translations": {
              "es-EC": "Aguardiente"
            }
          },
          "items": [
            {
              "id": "AG029",
              "title": {
                "translations": {
                  "es-EC": "Aguardiente Amarillo 750ml"
                }
              },
              "description": {
                "translations": {
                  "es-EC": "Aguardiente tradicional ecuatoriano. 30% ABV."
                }
              },
              "price": {
                "amount": 2500,
                "currency_code": "USD"
              },
              "image_url": "https://api.ledgerxpertz.com/media/productos/AG029.webp",
              "alcohol_content": {
                "percentage": 30.0
              },
              "quantity_info": {
                "quantity": {
                  "max_permitted": 10,
                  "min_permitted": 1
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

---

### **2. Order API (Gestión de Pedidos)**

**Endpoints principales:**

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/eats/v1/orders/{order_id}` | Obtener detalles de un pedido |
| `POST` | `/eats/v1/orders/{order_id}/accept_pos_order` | Aceptar pedido |
| `POST` | `/eats/v1/orders/{order_id}/deny_pos_order` | Rechazar pedido |
| `POST` | `/eats/v1/orders/{order_id}/cancel` | Cancelar pedido |

**Ejemplo de Pedido Recibido:**

```json
{
  "id": "abc123-order-id",
  "display_id": "#1234",
  "type": "DELIVERY_BY_UBER",
  "placed_at": "2026-01-15T10:30:00Z",
  "customer": {
    "first_name": "Juan",
    "phone": "+593987654321"
  },
  "cart": {
    "items": [
      {
        "id": "AG029",
        "title": "Aguardiente Amarillo 750ml",
        "quantity": 2,
        "price": {
          "unit_price": {
            "amount": 2500
          },
          "total_price": {
            "amount": 5000
          }
        }
      }
    ],
    "special_instructions": "Entregar en recepción"
  },
  "payment": {
    "charges": {
      "total": {
        "amount": 5300
      },
      "sub_total": {
        "amount": 5000
      },
      "tax": {
        "amount": 300
      }
    }
  },
  "delivery_address": {
    "street_address": "Av. 6 de Diciembre N34-123",
    "city": "Quito",
    "country": "EC"
  }
}
```

---

### **3. Webhooks (Notificaciones en Tiempo Real)**

**Eventos disponibles:**

| Webhook | Cuándo se dispara | Acción requerida |
|---------|-------------------|------------------|
| `orders.notification` | Nuevo pedido creado | Aceptar/Rechazar en 11.5 min |
| `orders.cancel` | Pedido cancelado | Actualizar stock |
| `store.status.changed` | Tienda online/offline | Actualizar estado |
| `orders.release` | Repartidor cerca (geo-fence) | Preparar pedido |

**Ejemplo de Webhook Payload:**

```json
{
  "event_id": "evt_abc123",
  "event_time": "2026-01-15T10:30:00Z",
  "event_type": "orders.notification",
  "meta": {
    "user_id": "store_la_huequita",
    "resource_id": "abc123-order-id"
  }
}
```

**Seguridad del Webhook:**

Cada webhook incluye header `X-Uber-Signature` para verificar autenticidad:

```python
import hmac
import hashlib

def verify_uber_signature(request_body, signature, client_secret):
    expected_signature = hmac.new(
        client_secret.encode(),
        request_body,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)
```

---

## 🔐 Autenticación

### **OAuth 2.0 Client Credentials Flow:**

```python
import requests

def get_uber_access_token(client_id, client_secret):
    url = "https://login.uber.com/oauth/v2/token"
    
    data = {
        "client_id": client_id,
        "client_secret": client_secret,
        "grant_type": "client_credentials",
        "scope": "eats.store eats.store.orders.read eats.store.orders.write"
    }
    
    response = requests.post(url, data=data)
    return response.json()["access_token"]
```

**Scopes necesarios:**

- `eats.store` - Gestión de tienda y menú
- `eats.store.orders.read` - Leer pedidos
- `eats.store.orders.write` - Aceptar/rechazar pedidos

---

## 💻 Implementación en Django

### **Paso 1: Crear Endpoint de Webhook**

```python
# LedgerXpertz/core/api_ubereats.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
import hmac
import hashlib
import json

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def uber_eats_webhook(request):
    """
    Recibe notificaciones de Uber Eats
    """
    # 1. Verificar firma
    signature = request.META.get('HTTP_X_UBER_SIGNATURE')
    client_secret = settings.UBER_EATS_CLIENT_SECRET
    
    if not verify_signature(request.body, signature, client_secret):
        return Response({'error': 'Invalid signature'}, status=401)
    
    # 2. Parsear evento
    payload = json.loads(request.body)
    event_type = payload.get('event_type')
    
    # 3. Procesar según tipo de evento
    if event_type == 'orders.notification':
        order_id = payload['meta']['resource_id']
        # Procesar nuevo pedido
        process_new_order.delay(order_id)  # Celery task
        
    elif event_type == 'orders.cancel':
        order_id = payload['meta']['resource_id']
        # Restaurar stock
        restore_stock_from_order.delay(order_id)
    
    # 4. Responder inmediatamente (Uber requiere respuesta rápida)
    return Response(status=200)


def verify_signature(body, signature, secret):
    expected = hmac.new(
        secret.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature.lower())
```

---

### **Paso 2: Procesar Pedidos (Celery Task)**

```python
# LedgerXpertz/core/tasks.py

from celery import shared_task
import requests
from core.models import Producto
from inventarios.models import Inventario
from django.db import transaction

@shared_task
def process_new_order(order_id):
    """
    Procesa un nuevo pedido de Uber Eats
    """
    # 1. Obtener detalles del pedido
    order = get_uber_order_details(order_id)
    
    # 2. Verificar stock
    can_fulfill = True
    for item in order['cart']['items']:
        producto = Producto.objects.get(codigo_producto=item['id'])
        stock = Inventario.objects.filter(producto=producto).aggregate(
            total=Sum('cantidad')
        )['total'] or 0
        
        if stock < item['quantity']:
            can_fulfill = False
            break
    
    # 3. Aceptar o rechazar
    if can_fulfill:
        accept_uber_order(order_id)
        # Descontar stock
        with transaction.atomic():
            for item in order['cart']['items']:
                producto = Producto.objects.get(codigo_producto=item['id'])
                inventario = Inventario.objects.filter(producto=producto).first()
                inventario.cantidad -= item['quantity']
                inventario.save()
    else:
        deny_uber_order(order_id, reason="OUT_OF_STOCK")


def get_uber_order_details(order_id):
    token = get_uber_access_token()
    url = f"https://api.uber.com/v1/eats/orders/{order_id}"
    
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    return response.json()


def accept_uber_order(order_id):
    token = get_uber_access_token()
    url = f"https://api.uber.com/v1/eats/orders/{order_id}/accept_pos_order"
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {"reason": ""}
    
    requests.post(url, headers=headers, json=data)


def deny_uber_order(order_id, reason):
    token = get_uber_access_token()
    url = f"https://api.uber.com/v1/eats/orders/{order_id}/deny_pos_order"
    
    headers = {"Authorization": f"Bearer {token}"}
    data = {
        "reason": reason,
        "out_of_stock_items": []  # Lista de IDs de productos agotados
    }
    
    requests.post(url, headers=headers, json=data)
```

---

### **Paso 3: Sincronizar Menú Automáticamente**

```python
# LedgerXpertz/core/tasks.py

@shared_task
def sync_menu_to_uber_eats():
    """
    Sincroniza el menú completo con Uber Eats
    Ejecutar diariamente o cuando haya cambios importantes
    """
    from core.models import Producto, Categoria
    from inventarios.models import Inventario
    from django.db.models import Sum
    
    # 1. Obtener productos activos con stock
    productos = Producto.objects.filter(
        empresa__schema_name='la_huequita',
        mostrar_en_web=True,
        activo=True
    )
    
    # 2. Construir estructura de menú
    menu = {
        "menus": []
    }
    
    categorias = Categoria.objects.filter(empresa__schema_name='la_huequita')
    
    for categoria in categorias:
        productos_cat = productos.filter(categoria=categoria)
        
        items = []
        for p in productos_cat:
            # Verificar stock
            stock = Inventario.objects.filter(producto=p).aggregate(
                total=Sum('cantidad')
            )['total'] or 0
            
            if stock > 0:  # Solo incluir productos con stock
                items.append({
                    "id": p.codigo_producto,
                    "title": {
                        "translations": {
                            "es-EC": p.nombre
                        }
                    },
                    "description": {
                        "translations": {
                            "es-EC": p.descripcion or ""
                        }
                    },
                    "price": {
                        "amount": int(float(p.presentaciones.first().precio) * 100),
                        "currency_code": "USD"
                    },
                    "image_url": f"https://api.ledgerxpertz.com{p.image.url}",
                    "alcohol_content": {
                        "percentage": float(p.abv) if p.abv else 0.0
                    },
                    "quantity_info": {
                        "quantity": {
                            "max_permitted": min(stock, 10),
                            "min_permitted": 1
                        }
                    }
                })
        
        if items:  # Solo agregar categoría si tiene productos
            menu["menus"].append({
                "id": f"menu_{categoria.id}",
                "title": {
                    "translations": {
                        "es-EC": categoria.nombre
                    }
                },
                "categories": [{
                    "id": f"cat_{categoria.id}",
                    "title": {
                        "translations": {
                            "es-EC": categoria.nombre
                        }
                    },
                    "items": items
                }]
            })
    
    # 3. Enviar a Uber Eats
    upload_menu_to_uber(menu)


def upload_menu_to_uber(menu_data):
    token = get_uber_access_token()
    store_id = settings.UBER_EATS_STORE_ID
    url = f"https://api.uber.com/v1/eats/stores/{store_id}/menus"
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    response = requests.put(url, headers=headers, json=menu_data)
    return response.json()
```

---

## 📊 Requisitos Específicos para Alcohol

### **1. Clasificación de Productos:**

Todos los productos de alcohol deben incluir:

```json
{
  "alcohol_content": {
    "percentage": 30.0  // ABV (Alcohol By Volume)
  },
  "alcohol_by_volume": 30.0,  // Alternativa
  "nutritional_info": {
    "alcohol": {
      "unit_type": "PERCENTAGE",
      "value": 30.0
    }
  }
}
```

### **2. Verificación de Edad:**

Uber Eats maneja automáticamente:
- ✅ Verificación de ID al momento de la entrega
- ✅ Restricción de edad en la app (18+)
- ✅ Entrega solo a persona con ID válido

**No necesitas implementar nada adicional** en tu backend para esto.

### **3. Licencia de Alcohol:**

Debes subir tu licencia de venta de alcohol en:
- Uber Eats Manager → Settings → Documents
- Formato: PDF o imagen clara
- Renovar anualmente

---

## 🚀 Proceso de Onboarding

### **Paso 1: Registro en Uber Eats**

1. Ir a [merchants.uber.com](https://merchants.uber.com)
2. Crear cuenta como "Licorería" o "Retail"
3. Completar información del negocio
4. Subir licencia de venta de alcohol
5. Configurar horarios y zona de cobertura

### **Paso 2: Solicitar Acceso a la API**

1. Ir a [developer.uber.com](https://developer.uber.com)
2. Crear una app
3. Solicitar acceso a "Eats Marketplace APIs"
4. **Importante:** Requiere aprobación escrita de Uber (4-8 semanas)
5. Obtener `client_id` y `client_secret`

### **Paso 3: Configurar Webhook**

1. En Developer Dashboard → Setup → Webhooks
2. Agregar URL: `https://api.ledgerxpertz.com/api/ubereats/webhook`
3. Verificar que tu servidor responda con 200 OK

### **Paso 4: Subir Menú Inicial**

1. Ejecutar `sync_menu_to_uber_eats()` manualmente
2. Verificar en Uber Eats Manager que los productos aparezcan
3. Ajustar precios/descripciones si es necesario

### **Paso 5: Probar con Pedido de Prueba**

1. Uber proporciona cuentas de prueba
2. Hacer pedido de prueba
3. Verificar que webhook llegue
4. Verificar que stock se descuente
5. Confirmar aceptación del pedido

---

## 📋 Checklist de Implementación

### Backend (Django):

- [ ] Agregar campo `abv` al modelo `Producto`
- [ ] Crear endpoint `/api/ubereats/webhook`
- [ ] Implementar verificación de firma HMAC
- [ ] Crear Celery task `process_new_order`
- [ ] Crear Celery task `sync_menu_to_uber_eats`
- [ ] Configurar variables de entorno:
  - `UBER_EATS_CLIENT_ID`
  - `UBER_EATS_CLIENT_SECRET`
  - `UBER_EATS_STORE_ID`

### Configuración:

- [ ] Registrar negocio en Uber Eats
- [ ] Subir licencia de alcohol
- [ ] Solicitar acceso a API (esperar aprobación)
- [ ] Configurar webhook URL
- [ ] Probar con cuenta de prueba

### Operación Continua:

- [ ] Sincronizar menú diariamente (cron job)
- [ ] Monitorear webhooks en logs
- [ ] Revisar pedidos rechazados
- [ ] Actualizar stock en tiempo real

---

## 💰 Costos y Comisiones

### **Comisión de Uber Eats:**

- **Delivery:** 25-30% del valor del pedido
- **Pickup:** 15-20% del valor del pedido
- **Marketing:** Opcional (5-10% adicional para promociones)

### **Ejemplo de Cálculo:**

```
Producto: Aguardiente Amarillo
Precio en tu tienda: $25.00
Precio en Uber Eats: $25.00

Pedido de 2 unidades: $50.00
Comisión Uber (30%): -$15.00
Ganancia neta: $35.00

Costo de delivery: Lo paga el cliente (no afecta tu ganancia)
```

**Recomendación:** Ajusta precios en Uber Eats para compensar comisión.

---

## 🎯 Ventajas de la Integración API vs Manual

| Aspecto | Manual | Con API |
|---------|--------|---------|
| **Actualización de menú** | 30-60 min/día | Automático |
| **Gestión de stock** | Manual, propenso a errores | Tiempo real |
| **Pedidos** | Tablet/Email | Directo a tu sistema |
| **Errores de stock** | Frecuentes | Casi nulos |
| **Escalabilidad** | Difícil | Fácil (múltiples tiendas) |
| **Tiempo de respuesta** | 5-15 min | <1 min |

---

## 🚨 Errores Comunes y Soluciones

### Error: "Webhook timeout"
**Causa:** Tu servidor tarda >3 segundos en responder  
**Solución:** Responder 200 OK inmediatamente, procesar en background (Celery)

### Error: "Order auto-canceled"
**Causa:** No aceptaste/rechazaste en 11.5 minutos  
**Solución:** Optimizar `process_new_order` task

### Error: "Invalid signature"
**Causa:** `client_secret` incorrecto o body modificado  
**Solución:** Verificar que uses el body RAW sin modificar

### Error: "Menu sync failed"
**Causa:** Estructura JSON incorrecta  
**Solución:** Validar contra schema de Uber antes de enviar

---

## 📈 Próximos Pasos

1. **Esta semana:**
   - [ ] Registrar negocio en Uber Eats
   - [ ] Solicitar acceso a API

2. **Mientras esperas aprobación (4-8 semanas):**
   - [ ] Agregar campo `abv` a base de datos
   - [ ] Implementar endpoints de webhook
   - [ ] Crear tasks de Celery
   - [ ] Probar localmente con datos mock

3. **Después de aprobación:**
   - [ ] Configurar credenciales
   - [ ] Subir menú inicial
   - [ ] Hacer pedido de prueba
   - [ ] Lanzar en producción

---

**Última actualización:** Enero 2026  
**Versión:** 1.0  
**Responsable:** Equipo La Huequita
