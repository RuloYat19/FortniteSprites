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
    estaEnElJuego = Column(Boolean, default=True)  # Si está disponible en el juego
    temporada = Column(String(20), nullable=True)  # Ej: "C7T3"
    metodoSubidaNivel = Column(String(100), nullable=True)  # Ej: "Abriendo contenedores"
    nivelEspiritu = Column(Integer, nullable=True) # Ej: 2000, 500, 10000
    polvoAlExtraer = Column(Integer, nullable=True) # Ej: 2000, 500, 10000
    polvoAlInvocar = Column(Integer, nullable=True) # Ej: 2000, 500, 10000
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class CantidadPolvoEspirituExtraer(Base):
    __tablename__ = "cantidadPolvoEspirituExtraer"
    
    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    temporada = Column(String(20), nullable=True)
    rareza = Column(String(50), nullable=False)
    nivelEspiritu = Column(Integer, nullable=False)
    cantidad = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class CantidadPolvoEspirituInvocar(Base):
    __tablename__ = "cantidadPolvoEspirituInvocar"
    
    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    temporada = Column(String(20), nullable=True)
    material = Column(String(50), nullable=False)
    rareza = Column(String(50), nullable=False)
    cantidad = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class Material(Base):
    __tablename__ = "material"
    
    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    temporada = Column(String(20), nullable=True)
    nombre = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class NombreSprit(Base):
    __tablename__ = "nombresSprites"
    
    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    temporada = Column(String(20), nullable=True)
    nombre = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class OrdenDefault(Base):
    __tablename__ = "ordenDefault"
    
    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    temporada = Column(String(20), nullable=True)
    nombre = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class OrdenRareza(Base):
    __tablename__ = "ordenRareza"
    
    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    temporada = Column(String(20), nullable=True)
    nombre = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())