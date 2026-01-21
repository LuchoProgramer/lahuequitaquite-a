# 🤖 Universal Commerce Protocol (UCP) - La Próxima Revolución

> **Anunciado:** 11-13 Enero 2026 | **Desarrollado por:** Google + 20+ partners  
> **Impacto:** Convierte LedgerXpertz en una plataforma "AI-Ready"

---

## 🎯 ¿Qué es UCP?

### **Definición Simple:**
**UCP es el "HTTP del comercio con IA"** - Un estándar abierto que permite que las IAs (Gemini, ChatGPT) **compren productos** en tu tienda sin que el usuario visite tu sitio web.

### **Antes vs Después:**

| Antes (2025) | Después (2026 con UCP) |
|--------------|------------------------|
| Usuario: "¿Dónde compro aguardiente?" | Usuario: "Cómprame aguardiente amarillo" |
| IA: "Aquí hay 5 tiendas..." | IA: "Listo, comprado en La Huequita. Llega en 30 min" |
| Usuario: Abre web → busca → carrito → checkout | IA: Ejecuta compra completa en el chat |

---

## 🏗️ Arquitectura Técnica

### **Stack de Protocolos:**

```
┌─────────────────────────────────────┐
│  Universal Commerce Protocol (UCP)  │
│  - Discovery (catálogo)             │
│  - Negotiation (ofertas)            │
│  - Execution (compra)               │
└──────────────┬──────────────────────┘
               │
      ┌────────┴────────┐
      ↓                 ↓
┌──────────────┐  ┌──────────────────┐
│ Model        │  │ Agent Payments   │
│ Context      │  │ Protocol (AP2)   │
│ Protocol     │  │ - Pagos seguros  │
│ (MCP)        │  │ - Mandates       │
│ - Contexto   │  │ - Multi-wallet   │
└──────────────┘  └──────────────────┘
```

### **Flujo de Compra con IA:**

```
Usuario en Gemini/ChatGPT
    ↓
"Necesito aguardiente amarillo para esta noche"
    ↓
IA consulta UCP de La Huequita (GET /ucp/catalog)
    ↓
IA muestra: "Aguardiente Amarillo $25 - Stock: 10"
    ↓
Usuario: "Cómpralo"
    ↓
IA negocia descuento (POST /ucp/negotiate)
    ↓
La Huequita responde: "10% off = $22.50"
    ↓
IA ejecuta pago (POST /ucp/execute con AP2)
    ↓
LedgerXpertz descuenta stock automáticamente
    ↓
Usuario recibe confirmación en el chat
```

---

## 💎 Oportunidad para LedgerXpertz

### **Propuesta de Valor:**

**"LedgerXpertz: La primera plataforma multi-tenant en Ecuador con soporte nativo para compras con IA"**

### **Ventaja Competitiva:**

| Competencia | LedgerXpertz con UCP |
|-------------|----------------------|
| Sitio web tradicional | ✅ Venta directa desde Gemini/ChatGPT |
| Requiere visitar la web | ✅ Compra en 1 mensaje de chat |
| Fricción en checkout | ✅ Cero fricción (IA maneja todo) |
| Sin ofertas dinámicas | ✅ Descuentos automáticos en tiempo real |

---

## 🔧 Implementación en Django

### **Paso 1: Crear App UCP**

```python
# LedgerXpertz/ucp/__init__.py
# Nueva app para Universal Commerce Protocol
```

### **Paso 2: Endpoints UCP**

```python
# LedgerXpertz/ucp/views.py

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from core.models import Producto, Categoria
from inventarios.models import Inventario
from django.db.models import Sum

@api_view(['GET'])
@permission_classes([AllowAny])
def ucp_catalog(request):
    """
    UCP Discovery Endpoint
    Retorna catálogo estructurado para que la IA lo "entienda"
    """
    tenant = request.tenant
    
    productos = Producto.objects.filter(
        empresa=tenant,
        mostrar_en_web=True,
        activo=True
    )
    
    catalog = {
        "protocol": "ucp/1.0",
        "merchant": {
            "id": tenant.schema_name,
            "name": tenant.nombre,
            "description": f"Licorería premium en Quito - {tenant.nombre}"
        },
        "categories": []
    }
    
    for categoria in Categoria.objects.filter(empresa=tenant):
        productos_cat = productos.filter(categoria=categoria)
        
        items = []
        for p in productos_cat:
            # Calcular stock
            stock = Inventario.objects.filter(producto=p).aggregate(
                total=Sum('cantidad')
            )['total'] or 0
            
            if stock > 0:
                presentacion = p.presentaciones.first()
                
                items.append({
                    "id": p.codigo_producto,
                    "name": p.nombre,
                    "description": p.descripcion or "",
                    "price": {
                        "amount": float(presentacion.precio),
                        "currency": "USD"
                    },
                    "availability": {
                        "in_stock": True,
                        "quantity": int(stock)
                    },
                    "image_url": f"https://api.ledgerxpertz.com{p.image.url}",
                    "metadata": {
                        "abv": float(p.abv) if hasattr(p, 'abv') and p.abv else None,
                        "category": categoria.nombre
                    }
                })
        
        if items:
            catalog["categories"].append({
                "id": f"cat_{categoria.id}",
                "name": categoria.nombre,
                "items": items
            })
    
    return Response(catalog)


@api_view(['POST'])
@permission_classes([AllowAny])
def ucp_negotiate(request):
    """
    UCP Negotiation Endpoint
    Permite a la IA solicitar descuentos o verificar stock
    """
    tenant = request.tenant
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity', 1)
    
    try:
        producto = Producto.objects.get(
            empresa=tenant,
            codigo_producto=product_id
        )
        
        # Verificar stock
        stock = Inventario.objects.filter(producto=producto).aggregate(
            total=Sum('cantidad')
        )['total'] or 0
        
        if stock < quantity:
            return Response({
                "status": "insufficient_stock",
                "available": int(stock)
            }, status=400)
        
        presentacion = producto.presentaciones.first()
        precio_base = presentacion.precio
        
        # Lógica de descuentos dinámicos
        descuento = 0
        if quantity >= 6:
            descuento = 15  # 15% por compra al por mayor
        elif quantity >= 3:
            descuento = 10  # 10% por 3+ unidades
        
        precio_final = precio_base * (1 - descuento / 100)
        
        return Response({
            "status": "available",
            "product_id": product_id,
            "quantity": quantity,
            "pricing": {
                "base_price": float(precio_base),
                "discount_percentage": descuento,
                "final_price": float(precio_final),
                "total": float(precio_final * quantity)
            },
            "offer_expires_in": 300  # 5 minutos
        })
        
    except Producto.DoesNotExist:
        return Response({"error": "Product not found"}, status=404)


@api_view(['POST'])
@permission_classes([AllowAny])
def ucp_execute(request):
    """
    UCP Execution Endpoint
    Procesa la compra desde la IA
    """
    from ventas.models import Venta, DetalleVenta
    from django.db import transaction
    
    tenant = request.tenant
    items = request.data.get('items', [])
    payment_token = request.data.get('payment_token')  # AP2 token
    customer_info = request.data.get('customer')
    
    try:
        with transaction.atomic():
            # Crear venta
            venta = Venta.objects.create(
                empresa=tenant,
                sucursal=Sucursal.objects.filter(empresa=tenant).first(),
                tipo_venta='delivery',
                estado='pendiente',
                cliente_nombre=customer_info.get('name'),
                cliente_telefono=customer_info.get('phone'),
                cliente_direccion=customer_info.get('address'),
                metodo_pago='ai_agent',  # Nuevo método
                referencia_pago=payment_token
            )
            
            total = 0
            
            for item in items:
                producto = Producto.objects.get(
                    empresa=tenant,
                    codigo_producto=item['product_id']
                )
                
                # Verificar stock
                inventario = Inventario.objects.filter(producto=producto).first()
                if inventario.cantidad < item['quantity']:
                    raise ValueError(f"Insufficient stock for {producto.nombre}")
                
                # Descontar stock
                inventario.cantidad -= item['quantity']
                inventario.save()
                
                # Crear detalle
                presentacion = producto.presentaciones.first()
                subtotal = presentacion.precio * item['quantity']
                
                DetalleVenta.objects.create(
                    venta=venta,
                    producto=producto,
                    presentacion=presentacion,
                    cantidad=item['quantity'],
                    precio_unitario=presentacion.precio,
                    subtotal=subtotal
                )
                
                total += subtotal
            
            venta.total = total
            venta.estado = 'confirmada'
            venta.save()
            
            return Response({
                "status": "success",
                "order_id": venta.id,
                "total": float(total),
                "estimated_delivery": "30-45 minutes",
                "tracking_url": f"https://lahuequita.com.ec/pedido/{venta.id}"
            })
            
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=400)
```

---

## 📋 URLs Configuration

```python
# LedgerXpertz/ucp/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('catalog/', views.ucp_catalog, name='ucp_catalog'),
    path('negotiate/', views.ucp_negotiate, name='ucp_negotiate'),
    path('execute/', views.ucp_execute, name='ucp_execute'),
]
```

```python
# LedgerXpertz/LedgerXpertz/urls.py

urlpatterns = [
    # ... otras rutas
    path('api/ucp/', include('ucp.urls')),
]
```

---

## 🎁 Direct Offers (Ofertas Dinámicas)

### **Caso de Uso:**

```
Usuario en Gemini: "Quiero aguardiente pero está caro"
    ↓
IA detecta "abandono por precio"
    ↓
LedgerXpertz envía oferta dinámica vía UCP
    ↓
IA: "La Huequita te ofrece 10% de descuento si compras ahora"
    ↓
Usuario: "Ok, cómpralo"
    ↓
Venta cerrada
```

### **Implementación:**

```python
# LedgerXpertz/ucp/views.py

@api_view(['POST'])
def ucp_direct_offer(request):
    """
    Genera ofertas dinámicas basadas en el contexto del usuario
    """
    context = request.data.get('context')  # IA envía contexto
    
    # Detectar señales de abandono
    if 'expensive' in context.lower() or 'caro' in context.lower():
        return Response({
            "offer": {
                "type": "price_discount",
                "discount_percentage": 10,
                "message": "Descuento especial del 10% solo por hoy",
                "expires_in": 600  # 10 minutos
            }
        })
    
    # Detectar interés en categoría
    if 'whisky' in context.lower():
        return Response({
            "offer": {
                "type": "bundle",
                "message": "Lleva 2 whiskys y obtén 15% de descuento",
                "min_quantity": 2,
                "discount_percentage": 15
            }
        })
    
    return Response({"offer": None})
```

---

## 🚀 Roadmap de Implementación

### **Fase 1: MVP (2-3 semanas)**
- [ ] Crear app `ucp` en Django
- [ ] Implementar endpoint `/api/ucp/catalog`
- [ ] Implementar endpoint `/api/ucp/negotiate`
- [ ] Implementar endpoint `/api/ucp/execute`
- [ ] Probar con Postman/curl

### **Fase 2: Integración con Google (4-6 semanas)**
- [ ] Registrar LedgerXpertz en Google UCP Registry
- [ ] Obtener credenciales de Google
- [ ] Implementar autenticación OAuth 2.0
- [ ] Probar con Gemini en sandbox

### **Fase 3: Direct Offers (2 semanas)**
- [ ] Implementar lógica de ofertas dinámicas
- [ ] Crear dashboard de métricas UCP
- [ ] A/B testing de ofertas

### **Fase 4: Producción (1 semana)**
- [ ] Deploy a producción
- [ ] Monitoreo y logs
- [ ] Marketing: "Compra con IA en La Huequita"

---

## 💰 Modelo de Negocio

### **Para tus Clientes (La Huequita, etc.):**

**Pitch:**
> "Con LedgerXpertz, tus clientes pueden comprar desde Gemini o ChatGPT sin visitar tu web. Aumenta ventas en 30-50% eliminando la fricción del checkout."

### **Pricing Sugerido:**

| Plan | Precio | Incluye |
|------|--------|---------|
| **Básico** | $50/mes | UCP Catalog + Negotiate |
| **Pro** | $150/mes | + Direct Offers + Analytics |
| **Enterprise** | $300/mes | + Personalización + Soporte prioritario |

---

## 📊 Métricas de Éxito

### **KPIs a Medir:**

1. **Conversión UCP vs Web:**
   - Hipótesis: UCP convierte 2-3x más (sin fricción)

2. **Tiempo de Compra:**
   - Web: 3-5 minutos
   - UCP: <30 segundos

3. **Abandono de Carrito:**
   - Web: 70%
   - UCP: <10% (IA completa la compra)

4. **Ticket Promedio:**
   - Direct Offers pueden aumentar 20-30%

---

## 🎯 Ventaja Competitiva de LedgerXpertz

### **Diferenciadores:**

1. **Multi-Tenant AI-Ready:**
   - Un solo código, múltiples clientes con UCP

2. **Ofertas Dinámicas:**
   - Algoritmos de pricing inteligente

3. **Integración Completa:**
   - UCP + Uber Eats + Google Merchant Center

4. **First Mover en Ecuador:**
   - Ninguna plataforma local tiene esto

---

## 🌟 Caso de Uso: La Huequita

### **Escenario Real:**

```
Usuario en Quito (10pm):
"Gemini, necesito aguardiente para una reunión en 1 hora"

Gemini (con UCP):
"Encontré Aguardiente Amarillo en La Huequita:
- Precio: $25.00
- Stock: 10 unidades
- Delivery: 30 minutos
¿Quieres comprarlo?"

Usuario: "Sí, pero ¿hay descuento?"

Gemini (UCP Negotiate):
"La Huequita te ofrece 10% de descuento si compras 2 unidades.
Total: $45.00 (ahorro $5.00)"

Usuario: "Ok, cómpralos"

Gemini (UCP Execute):
"✅ Compra confirmada
Pedido #1234
Llega en 30 minutos a Av. 6 de Diciembre
Total: $45.00 (pagado con Google Pay)"
```

**Resultado:**
- Venta cerrada en <1 minuto
- Sin visitar la web
- Sin fricción
- Cliente satisfecho

---

## 🚨 Consideraciones de Seguridad

### **Autenticación:**

```python
# LedgerXpertz/ucp/middleware.py

class UCPAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/api/ucp/'):
            # Verificar token de Google/OpenAI
            auth_header = request.META.get('HTTP_AUTHORIZATION')
            
            if not auth_header or not self.verify_ai_agent(auth_header):
                return JsonResponse(
                    {"error": "Unauthorized AI agent"},
                    status=401
                )
        
        return self.get_response(request)
    
    def verify_ai_agent(self, token):
        # Verificar firma JWT de Google/OpenAI
        # Implementar según spec de UCP
        pass
```

---

## 📚 Recursos y Documentación

### **Oficial:**
- [UCP Specification](https://ucp-protocol.org) (hipotético)
- [Google UCP Docs](https://developers.google.com/ucp)
- [AP2 Protocol](https://ap2-protocol.org)

### **Partners:**
- Shopify, Walmart, Etsy, Wayfair
- Visa, Mastercard, Stripe, PayPal

---

## 🎓 Conclusión

**UCP es el "iPhone moment" del e-commerce.**

Así como el iPhone cambió los teléfonos, UCP cambiará cómo compramos online.

**LedgerXpertz tiene la oportunidad de:**
1. Ser pionero en Ecuador
2. Ofrecer tecnología de nivel mundial
3. Multiplicar ventas de tus clientes
4. Posicionarte como líder en "Agentic Commerce"

**Próximo Paso:**
Implementar MVP de UCP en 2-3 semanas y probar con La Huequita como caso piloto.

---

**Última actualización:** Enero 2026  
**Versión:** 1.0  
**Autor:** Equipo LedgerXpertz
