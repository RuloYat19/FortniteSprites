from pydantic import BaseModel
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
# SCHEMAS PARA CANTIDADPOLVOESPIRITU
# ============================================
class CantidadPolvoBase(BaseModel):
    numeroOrden: int
    rareza: str
    nivelEspiritu: int
    cantidad: int

class CantidadPolvoResponse(CantidadPolvoBase):
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
    nombre: str

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombre: Optional[str] = None

class MaterialResponse(MaterialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True