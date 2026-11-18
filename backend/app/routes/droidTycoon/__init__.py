from . import (
    chips_venta_droide,
    creditos_por_segundo,
    droides,
    fusiones,
    kyber_activar_droide,
    materiales_droide,
    nombres_droide,
    rareza_droide,
    reglas_fusion,
    renacimientos,
    ventajas_droide,
)

routers = [
    droides.router,
    materiales_droide.router,
    nombres_droide.router,
    rareza_droide.router,
    creditos_por_segundo.router,
    chips_venta_droide.router,
    kyber_activar_droide.router,
    ventajas_droide.router,
    renacimientos.router,
    fusiones.router,
    reglas_fusion.router,
]
