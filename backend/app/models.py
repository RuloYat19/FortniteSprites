from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.database import Base

class Sprit(Base):
    __tablename__ = "sprits"
    
    id = Column(Integer, primary_key=True, index=True) # Ej: 1, 2, 3
    nombre = Column(String(100), nullable=False, index=True) # Ej: "Espíritu de fuego", "Espíritu de Agua", "Espíritu Soñador"
    rareza = Column(String(50), nullable=False)  # Ej: "Legendario", "Épico", etc.
    material = Column(String(50), nullable=False) # Ej: "Normal", "Oro", "Gomita", etc
    nombreArchivoImagen = Column(String(255), nullable=True) # Ej: "/home/rauly/FortniteSprites/imagenesSprites/aguaNormal" o si es posible mejor "./imagenesSprites/aguaNormal"
    yaFueDominado = Column(Boolean, default=False)
    estaDominado = Column(Boolean, default=False)
    estaEnInventario = Column(Boolean, default=False)
    estaDesbloqueado = Column(Boolean, default=False)
    polvoAlExtraer = Column(Integer, nullable=True) # Ej: 2000, 500, 10000
    polvoAlInvocar = Column(Integer, nullable=True) # Ej: 2000, 500, 10000
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())