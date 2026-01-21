# 💰 Estrategia de Precios Multi-Plataforma para La Huequita

## Problema

Uber Eats cobra comisión del 25-30%, por lo que necesitas precios diferentes:
- **Sitio web propio:** $25.00 (precio base)
- **Uber Eats:** $32.50 (compensar comisión del 30%)

---

## Solución Recomendada: Campo `precio_delivery`

### **Modificación del Modelo `Presentacion`:**

```python
# LedgerXpertz/core/models.py

class Presentacion(models.Model):
    producto = models.ForeignKey('Producto', on_delete=models.CASCADE, related_name='presentaciones')
    nombre_presentacion = models.CharField(max_length=50)
    cantidad = models.PositiveIntegerField()
    
    # Precio base (tu tienda web)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    
    # NUEVO: Precio para plataformas de delivery
    precio_delivery = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Precio para Uber Eats, Rappi, etc. Si es null, usa precio base + porcentaje_adicional"
    )
    
    porcentaje_adicional = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Porcentaje adicional a aplicar al precio (0-100)."
    )
    
    sucursal = models.ForeignKey('Sucursal', on_delete=models.CASCADE, related_name='presentaciones')

    # NUEVO: Método para obtener precio según plataforma
    def get_precio_para_plataforma(self, plataforma='web'):
        """
        Retorna el precio según la plataforma
        
        Args:
            plataforma: 'web', 'uber_eats', 'rappi', 'pedidosya'
        
        Returns:
            Decimal: Precio calculado
        """
        if plataforma in ['uber_eats', 'rappi', 'pedidosya']:
            # Si hay precio_delivery específico, usarlo
            if self.precio_delivery:
                return self.precio_delivery
            # Si no, calcular con porcentaje_adicional
            elif self.porcentaje_adicional > 0:
                return self.calcular_precio_con_porcentaje()
            # Fallback: precio base + 30% por defecto
            else:
                return (self.precio * Decimal('1.30')).quantize(Decimal('0.01'))
        
        # Para web, siempre precio base
        return self.precio

    def calcular_precio_con_porcentaje(self):
        precio_final = self.precio * (1 + (self.porcentaje_adicional / 100))
        return precio_final.quantize(Decimal('0.01'))
```

---

## Migración de Base de Datos

```bash
# Crear migración
python manage.py makemigrations core

# Aplicar migración
python manage.py migrate core
```

**Archivo de migración generado:**

```python
# core/migrations/0XXX_add_precio_delivery.py

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0XXX_previous_migration'),  # Ajustar número
    ]

    operations = [
        migrations.AddField(
            model_name='presentacion',
            name='precio_delivery',
            field=models.DecimalField(
                blank=True,
                decimal_places=2,
                help_text='Precio para Uber Eats, Rappi, etc. Si es null, usa precio base + porcentaje_adicional',
                max_digits=10,
                null=True
            ),
        ),
    ]
```

---

## Uso en Sincronización con Uber Eats

```python
# LedgerXpertz/core/tasks.py

@shared_task
def sync_menu_to_uber_eats():
    """
    Sincroniza el menú con Uber Eats usando precios de delivery
    """
    productos = Producto.objects.filter(
        empresa__schema_name='la_huequita',
        mostrar_en_web=True,
        activo=True
    )
    
    menu = {"menus": []}
    
    for categoria in Categoria.objects.filter(empresa__schema_name='la_huequita'):
        items = []
        
        for producto in productos.filter(categoria=categoria):
            # Obtener presentación base (Unidad)
            presentacion = producto.presentaciones.filter(
                nombre_presentacion='Unidad'
            ).first()
            
            if presentacion:
                # USAR PRECIO PARA DELIVERY
                precio_uber = presentacion.get_precio_para_plataforma('uber_eats')
                
                items.append({
                    "id": producto.codigo_producto,
                    "title": {
                        "translations": {"es-EC": producto.nombre}
                    },
                    "price": {
                        "amount": int(precio_uber * 100),  # Convertir a centavos
                        "currency_code": "USD"
                    },
                    "image_url": f"https://api.ledgerxpertz.com{producto.image.url}",
                })
        
        if items:
            menu["menus"].append({
                "id": f"menu_{categoria.id}",
                "title": {"translations": {"es-EC": categoria.nombre}},
                "categories": [{
                    "id": f"cat_{categoria.id}",
                    "title": {"translations": {"es-EC": categoria.nombre}},
                    "items": items
                }]
            })
    
    upload_menu_to_uber(menu)
```

---

## Actualización Masiva de Precios (Script Opcional)

Si quieres calcular automáticamente `precio_delivery` para todos los productos existentes:

```python
# LedgerXpertz/core/management/commands/calcular_precios_delivery.py

from django.core.management.base import BaseCommand
from core.models import Presentacion
from decimal import Decimal

class Command(BaseCommand):
    help = 'Calcula precio_delivery para todas las presentaciones (precio base + 30%)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--porcentaje',
            type=float,
            default=30.0,
            help='Porcentaje a agregar al precio base (default: 30%)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Simular sin guardar cambios'
        )

    def handle(self, *args, **options):
        porcentaje = Decimal(str(options['porcentaje']))
        dry_run = options['dry_run']
        
        presentaciones = Presentacion.objects.filter(precio_delivery__isnull=True)
        total = presentaciones.count()
        
        self.stdout.write(f"Procesando {total} presentaciones...")
        
        for pres in presentaciones:
            precio_nuevo = (pres.precio * (1 + porcentaje / 100)).quantize(Decimal('0.01'))
            
            self.stdout.write(
                f"{pres.producto.nombre} ({pres.nombre_presentacion}): "
                f"${pres.precio} → ${precio_nuevo}"
            )
            
            if not dry_run:
                pres.precio_delivery = precio_nuevo
                pres.save()
        
        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN - No se guardaron cambios"))
        else:
            self.stdout.write(self.style.SUCCESS(f"✅ {total} precios actualizados"))
```

**Uso:**

```bash
# Simular (ver cambios sin aplicar)
python manage.py calcular_precios_delivery --dry-run

# Aplicar con 30% (default)
python manage.py calcular_precios_delivery

# Aplicar con 35%
python manage.py calcular_precios_delivery --porcentaje=35
```

---

## Actualización del Admin de Django

```python
# LedgerXpertz/core/admin.py

from django.contrib import admin
from .models import Presentacion

@admin.register(Presentacion)
class PresentacionAdmin(admin.ModelAdmin):
    list_display = [
        'producto', 
        'nombre_presentacion', 
        'sucursal', 
        'precio', 
        'precio_delivery',  # NUEVO
        'diferencia_porcentual'  # NUEVO
    ]
    list_filter = ['sucursal', 'nombre_presentacion']
    search_fields = ['producto__nombre']
    
    # NUEVO: Mostrar diferencia porcentual
    def diferencia_porcentual(self, obj):
        if obj.precio_delivery:
            diff = ((obj.precio_delivery - obj.precio) / obj.precio) * 100
            return f"+{diff:.1f}%"
        return "-"
    diferencia_porcentual.short_description = "Diferencia %"
```

---

## Ejemplo de Uso en la Práctica

### **Escenario 1: Producto con precio_delivery específico**

```python
# Crear presentación con precio delivery
presentacion = Presentacion.objects.create(
    producto=aguardiente,
    nombre_presentacion="Unidad",
    cantidad=1,
    precio=Decimal('25.00'),        # Precio web
    precio_delivery=Decimal('32.50'), # Precio Uber Eats (30% más)
    sucursal=sucursal_matriz
)

# Obtener precio según plataforma
presentacion.get_precio_para_plataforma('web')        # → 25.00
presentacion.get_precio_para_plataforma('uber_eats')  # → 32.50
```

### **Escenario 2: Producto sin precio_delivery (usa porcentaje_adicional)**

```python
presentacion = Presentacion.objects.create(
    producto=whisky,
    nombre_presentacion="Unidad",
    cantidad=1,
    precio=Decimal('45.00'),
    precio_delivery=None,  # No especificado
    porcentaje_adicional=Decimal('30.00'),  # 30%
    sucursal=sucursal_matriz
)

# Obtener precio según plataforma
presentacion.get_precio_para_plataforma('web')        # → 45.00
presentacion.get_precio_para_plataforma('uber_eats')  # → 58.50 (45 + 30%)
```

### **Escenario 3: Producto sin nada (usa fallback 30%)**

```python
presentacion = Presentacion.objects.create(
    producto=ron,
    nombre_presentacion="Unidad",
    cantidad=1,
    precio=Decimal('30.00'),
    precio_delivery=None,
    porcentaje_adicional=Decimal('0.00'),
    sucursal=sucursal_matriz
)

# Obtener precio según plataforma
presentacion.get_precio_para_plataforma('web')        # → 30.00
presentacion.get_precio_para_plataforma('uber_eats')  # → 39.00 (30 + 30% default)
```

---

## Ventajas de esta Solución

1. **Flexibilidad:** Puedes tener precios diferentes para cada plataforma
2. **Claridad:** Es obvio qué precio se usa en cada caso
3. **Escalabilidad:** Fácil agregar más plataformas (Rappi, PedidosYa)
4. **Auditoría:** Puedes ver en el admin la diferencia de precios
5. **Retrocompatibilidad:** Si `precio_delivery` es null, usa el sistema actual

---

## Alternativa: Usar solo `porcentaje_adicional`

Si prefieres NO agregar un campo nuevo, puedes usar el campo existente:

```python
# Configurar porcentaje_adicional = 30% para delivery
presentacion.porcentaje_adicional = Decimal('30.00')
presentacion.save()

# En el sync de Uber Eats
precio_uber = presentacion.calcular_precio_con_porcentaje()
```

**Desventaja:** Menos flexible si quieres diferentes porcentajes por plataforma.

---

## Recomendación Final

**Usa `precio_delivery`** porque:
- Es más explícito y fácil de entender
- Puedes tener control fino por producto
- No interfiere con `porcentaje_adicional` (que quizás uses para ofertas)
- Escalable para múltiples plataformas de delivery

---

**Última actualización:** Enero 2026  
**Versión:** 1.0
