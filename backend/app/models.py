from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Text
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
    material = Column(String(50), nullable=False)
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
    nombre = Column(String(50), nullable=False)
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

class MetodoSubidaNivel(Base):
    __tablename__ = "metodoSubidaNivel"
    
    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    nombre = Column(String(100), nullable=False, unique=True)  # Ej: "Abriendo contenedores"
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class Droide(Base):
    __tablename__ = "droide"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False, index=True)
    clase = Column(String(50), nullable=False, index=True)
    rareza = Column(String(50), nullable=False, index=True)
    estaImpecable = Column(Boolean, default=False)
    estaEnScourgedex = Column(Boolean, default=False)
    nombreArchivoImagen = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class MaterialDroide(Base):
    __tablename__ = "materialDroide"

    id = Column(Integer, primary_key=True, index=True)
    droide_id = Column(Integer, ForeignKey("droide.id", ondelete="CASCADE"), nullable=False)
    numeroOrden = Column(Integer, nullable=False)
    material = Column(String(50), nullable=False, index=True)
    multiplicador = Column(Integer, nullable=False)
    estaEnInventario = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class NombreDroide(Base):
    __tablename__ = "nombreDroide"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    nombre = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class RarezaDroide(Base):
    __tablename__ = "rarezaDroide"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    nombre = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class CreditosPorSegundo(Base):
    __tablename__ = "creditosPorSegundo"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    nombreDroide = Column(String(50), nullable=False, index=True)
    cantidadPredeterminada = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class ChipsVentaDroide(Base):
    __tablename__ = "chipsVentaDroide"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    rareza = Column(String(50), nullable=False, index=True)
    material = Column(String(50), nullable=False, index=True)
    cantidad = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class KyberActivarDroide(Base):
    __tablename__ = "kyberActivarDroide"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    rareza = Column(String(50), nullable=False, index=True)
    cantidad = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class VentajaDroide(Base):
    __tablename__ = "ventajaDroide"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    nombreVentaja = Column(String(50), nullable=False, index=True)
    nombreDroide = Column(String(50), nullable=False, index=True)
    rareza = Column(String(50), nullable=False, index=True)
    descripción = Column("descripción", String(275), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class Renacimiento(Base):
    __tablename__ = "renacimiento"

    id = Column(Integer, primary_key=True, index=True)
    ciclo = Column(Integer, nullable=False)
    numeroOrden = Column(Integer, nullable=False)
    cantidadCreditos = Column(Integer, nullable=False)
    droide1 = Column(String(50), nullable=False, index=True)
    material1 = Column(String(50), nullable=False, index=True)
    sePuedeVenderDroide1 = Column(Boolean, default=False)
    droide2 = Column(String(50), nullable=False, index=True)
    material2 = Column(String(50), nullable=False, index=True)
    sePuedeVenderDroide2 = Column(Boolean, default=False)
    droide3 = Column(String(50), nullable=False, index=True)
    material3 = Column(String(50), nullable=False, index=True)
    sePuedeVenderDroide3 = Column(Boolean, default=False)
    cantidadCristalesNovaRenacimiento = Column(Integer, nullable=False)
    cantidadCristalesNovaSuperRenacimiento = Column(Integer, nullable=False)
    cantidadAumentadaCreditos = Column(Integer, nullable=False)
    cantidadAumentadaXP = Column(Integer, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class Fusion(Base):
    __tablename__ = "fusion"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    droide1 = Column(String(50), nullable=False, index=True)
    droide2 = Column(String(50), nullable=False, index=True)
    droide3 = Column(String(50), nullable=False, index=True)
    droideResultante = Column(String(50), nullable=False, index=True)
    rarezaResultante = Column(String(50), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class ReglaFusion(Base):
    __tablename__ = "reglaFusion"

    id = Column(Integer, primary_key=True, index=True)
    numeroOrden = Column(Integer, nullable=False)
    descripcion = Column(String(350), nullable=False, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

# -------------------------------------------------------------------------

