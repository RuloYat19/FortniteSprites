from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# ============================================
# SCHEMAS PARA SPRITS
# ============================================
class SpritBase(BaseModel):
    nombre: str
    rareza: str
    material: str
    nombreArchivoImagen: Optional[str] = None
    yaFueDominado: bool = False
    estaDominado: bool = False
    estaEnInventario: bool = False
    estaDesbloqueado: bool = False
    estaEnElJuego: bool = True
    temporada: Optional[str] = None
    metodoSubidaNivel: Optional[str] = None
    nivelEspiritu: Optional[int] = None
    polvoAlExtraer: Optional[int] = None
    polvoAlInvocar: Optional[int] = None

class SpritCreate(SpritBase):
    pass

class SpritUpdate(BaseModel):
    nombre: Optional[str] = None
    rareza: Optional[str] = None
    material: Optional[str] = None
    nombreArchivoImagen: Optional[str] = None
    yaFueDominado: Optional[bool] = None
    estaDominado: Optional[bool] = None
    estaEnInventario: Optional[bool] = None
    estaDesbloqueado: Optional[bool] = None
    estaEnElJuego: Optional[bool] = None
    temporada: Optional[str] = None
    metodoSubidaNivel: Optional[str] = None
    nivelEspiritu: Optional[int] = None
    polvoAlExtraer: Optional[int] = None
    polvoAlInvocar: Optional[int] = None

class SpritResponse(SpritBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA CANTIDADPOLVOESPIRITUEXTRAER
# ============================================
class CantidadPolvoExtraerBase(BaseModel):
    numeroOrden: int
    temporada: Optional[str] = None
    material: str
    rareza: str
    nivelEspiritu: int
    cantidad: int

class CantidadPolvoExtraerResponse(CantidadPolvoExtraerBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA CANTIDADPOLVOESPIRITUINVOCAR
# ============================================
class CantidadPolvoInvocarBase(BaseModel):
    numeroOrden: int
    temporada: Optional[str] = None
    material: str
    rareza: str
    cantidad: int

class CantidadPolvoInvocarCreate(CantidadPolvoInvocarBase):
    pass

class CantidadPolvoInvocarUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    temporada: Optional[str] = None
    material: Optional[str] = None
    rareza: Optional[str] = None
    cantidad: Optional[int] = None

class CantidadPolvoInvocarResponse(CantidadPolvoInvocarBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA MATERIALES
# ============================================
class MaterialBase(BaseModel):
    numeroOrden: int
    temporada: Optional[str] = None
    nombre: str

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    temporada: Optional[str] = None
    nombre: Optional[str] = None

class MaterialResponse(MaterialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA NOMBRES DE SPRITES
# ============================================
class NombreSpritBase(BaseModel):
    numeroOrden: int
    temporada: Optional[str] = None
    nombre: str

class NombreSpritCreate(NombreSpritBase):
    pass

class NombreSpritUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    temporada: Optional[str] = None
    nombre: Optional[str] = None

class NombreSpritResponse(NombreSpritBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA ORDEN DEFAULT
# ============================================
class OrdenDefaultBase(BaseModel):
    numeroOrden: int
    temporada: Optional[str] = None
    nombre: str

class OrdenDefaultCreate(OrdenDefaultBase):
    pass

class OrdenDefaultUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    temporada: Optional[str] = None
    nombre: Optional[str] = None

class OrdenDefaultResponse(OrdenDefaultBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA ORDEN RAREZA
# ============================================
class OrdenRarezaBase(BaseModel):
    numeroOrden: int
    temporada: Optional[str] = None
    nombre: str

class OrdenRarezaCreate(OrdenRarezaBase):
    pass

class OrdenRarezaUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    temporada: Optional[str] = None
    nombre: Optional[str] = None

class OrdenRarezaResponse(OrdenRarezaBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA METODO SUBIDA NIVEL
# ============================================
class MetodoSubidaNivelBase(BaseModel):
    numeroOrden: int
    nombre: str

class MetodoSubidaNivelCreate(MetodoSubidaNivelBase):
    pass

class MetodoSubidaNivelUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombre: Optional[str] = None

class MetodoSubidaNivelResponse(MetodoSubidaNivelBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# ============================================
# SCHEMAS PARA DROID TYCOON
# ============================================
class DroidTycoonResponse(BaseModel):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class DroideBase(BaseModel):
    nombre: str
    clase: str
    rareza: str
    estaImpecable: bool = False
    estaEnScourgedex: bool = False
    nombreArchivoImagen: Optional[str] = None

class DroideCreate(DroideBase):
    pass

class DroideUpdate(BaseModel):
    nombre: Optional[str] = None
    clase: Optional[str] = None
    rareza: Optional[str] = None
    estaImpecable: Optional[bool] = None
    estaEnScourgedex: Optional[bool] = None
    nombreArchivoImagen: Optional[str] = None

class DroideResponse(DroideBase, DroidTycoonResponse):
    pass

class MaterialDroideBase(BaseModel):
    droide_id: int
    numeroOrden: int
    material: str
    multiplicador: int
    estaEnInventario: bool = False

class MaterialDroideCreate(MaterialDroideBase):
    pass

class MaterialDroideUpdate(BaseModel):
    droide_id: Optional[int] = None
    numeroOrden: Optional[int] = None
    material: Optional[str] = None
    multiplicador: Optional[int] = None
    estaEnInventario: Optional[bool] = None

class MaterialDroideResponse(MaterialDroideBase, DroidTycoonResponse):
    pass

class NombreDroideBase(BaseModel):
    numeroOrden: int
    nombre: str

class NombreDroideCreate(NombreDroideBase):
    pass

class NombreDroideUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombre: Optional[str] = None

class NombreDroideResponse(NombreDroideBase, DroidTycoonResponse):
    pass

class RarezaDroideBase(BaseModel):
    numeroOrden: int
    nombre: str

class RarezaDroideCreate(RarezaDroideBase):
    pass

class RarezaDroideUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombre: Optional[str] = None

class RarezaDroideResponse(RarezaDroideBase, DroidTycoonResponse):
    pass

class CreditosPorSegundoBase(BaseModel):
    numeroOrden: int
    nombreDroide: str
    cantidadPredeterminada: int

class CreditosPorSegundoCreate(CreditosPorSegundoBase):
    pass

class CreditosPorSegundoUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombreDroide: Optional[str] = None
    cantidadPredeterminada: Optional[int] = None

class CreditosPorSegundoResponse(CreditosPorSegundoBase, DroidTycoonResponse):
    pass

class ChipsVentaDroideBase(BaseModel):
    numeroOrden: int
    rareza: str
    material: str
    cantidad: int

class ChipsVentaDroideCreate(ChipsVentaDroideBase):
    pass

class ChipsVentaDroideUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    rareza: Optional[str] = None
    material: Optional[str] = None
    cantidad: Optional[int] = None

class ChipsVentaDroideResponse(ChipsVentaDroideBase, DroidTycoonResponse):
    pass

class KyberActivarDroideBase(BaseModel):
    numeroOrden: int
    rareza: str
    cantidad: int

class KyberActivarDroideCreate(KyberActivarDroideBase):
    pass

class KyberActivarDroideUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    rareza: Optional[str] = None
    cantidad: Optional[int] = None

class KyberActivarDroideResponse(KyberActivarDroideBase, DroidTycoonResponse):
    pass

class VentajaDroideBase(BaseModel):
    numeroOrden: int
    nombreVentaja: str
    nombreDroide: str
    rareza: str
    descripción: str

class VentajaDroideCreate(VentajaDroideBase):
    pass

class VentajaDroideUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombreVentaja: Optional[str] = None
    nombreDroide: Optional[str] = None
    rareza: Optional[str] = None
    descripción: Optional[str] = None

class VentajaDroideResponse(VentajaDroideBase, DroidTycoonResponse):
    pass

class RenacimientoBase(BaseModel):
    ciclo: int
    numeroOrden: int
    cantidadCreditos: int
    droide1: str
    material1: str
    sePuedeVenderDroide1: bool = False
    droide2: str
    material2: str
    sePuedeVenderDroide2: bool = False
    droide3: str
    material3: str
    sePuedeVenderDroide3: bool = False
    cantidadCristalesNovaRenacimiento: int
    cantidadCristalesNovaSuperRenacimiento: int
    cantidadAumentadaCreditos: int
    cantidadAumentadaXP: int

class RenacimientoCreate(RenacimientoBase):
    pass

class RenacimientoUpdate(BaseModel):
    ciclo: Optional[int] = None
    numeroOrden: Optional[int] = None
    cantidadCreditos: Optional[int] = None
    droide1: Optional[str] = None
    material1: Optional[str] = None
    sePuedeVenderDroide1: Optional[bool] = None
    droide2: Optional[str] = None
    material2: Optional[str] = None
    sePuedeVenderDroide2: Optional[bool] = None
    droide3: Optional[str] = None
    material3: Optional[str] = None
    sePuedeVenderDroide3: Optional[bool] = None
    cantidadCristalesNovaRenacimiento: Optional[int] = None
    cantidadCristalesNovaSuperRenacimiento: Optional[int] = None
    cantidadAumentadaCreditos: Optional[int] = None
    cantidadAumentadaXP: Optional[int] = None

class RenacimientoResponse(RenacimientoBase, DroidTycoonResponse):
    pass

class FusionBase(BaseModel):
    numeroOrden: int
    droide1: str
    droide2: str
    droide3: str
    droideResultante: str
    rarezaResultante: str

class FusionCreate(FusionBase):
    pass

class FusionUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    droide1: Optional[str] = None
    droide2: Optional[str] = None
    droide3: Optional[str] = None
    droideResultante: Optional[str] = None
    rarezaResultante: Optional[str] = None

class FusionResponse(FusionBase, DroidTycoonResponse):
    pass

class ReglaFusionBase(BaseModel):
    numeroOrden: int
    descripcion: str

class ReglaFusionCreate(ReglaFusionBase):
    pass

class ReglaFusionUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    descripcion: Optional[str] = None

class ReglaFusionResponse(ReglaFusionBase, DroidTycoonResponse):
    pass