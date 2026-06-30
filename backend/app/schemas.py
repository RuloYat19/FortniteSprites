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
    polvoAlExtraer: Optional[int] = None
    polvoAlInvocar: Optional[int] = None

class SpritResponse(SpritBase):
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
    nombreMaterial: str

class MaterialCreate(MaterialBase):
    pass

class MaterialUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombreMaterial: Optional[str] = None

class MaterialResponse(MaterialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


# ============================================
# SCHEMAS PARA NOMBRES (SPRITS)
# ============================================
class NombreBase(BaseModel):
    numeroOrden: int
    nombreSprite: str

class NombreCreate(NombreBase):
    pass

class NombreUpdate(BaseModel):
    numeroOrden: Optional[int] = None
    nombreSprite: Optional[str] = None

class NombreResponse(NombreBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True