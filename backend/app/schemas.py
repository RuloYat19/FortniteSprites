from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SpritBase(BaseModel):
    nombre: str
    rareza: str
    material: str
    nombreArchivoImagen: Optional[str] = None
    estaColeccionado: bool = True
    estaDominado: bool = True
    estaEnInventario: bool = False
    polvoAlExtraer: Optional[int] = None
    polvoAlInvocar: Optional[int] = None

class SpritCreate(SpritBase):
    pass

class SpritUpdate(BaseModel):
    nombre: Optional[str] = None
    rareza: Optional[str] = None
    material: Optional[str] = None
    nombreArchivoImagen: Optional[str] = None
    estaColeccionado: Optional[bool] = None
    estaDominado: Optional[bool] = None
    estaEnInventario: Optional[bool] = None
    polvoAlExtraer: Optional[int] = None
    polvoAlInvocar: Optional[int] = None

class SpritResponse(SpritBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True