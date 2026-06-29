from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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