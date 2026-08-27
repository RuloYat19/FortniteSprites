# app/routes/cantidad_polvo_extraer.py

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/cantidad-polvo-extraer", tags=["cantidad-polvo-extraer"])

# ============================================
# GET - Obtener todas las cantidades
# ============================================
@router.get("/", response_model=List[schemas.CantidadPolvoExtraerResponse])
def get_all_cantidades(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    rareza: Optional[str] = None,
    nivel_espiritu: Optional[int] = None,
    numero_orden: Optional[int] = None,
    temporada: Optional[str] = Query(None, description="Filtrar por temporada (ej: C7T3)")
):
    """
    Obtener todas las cantidades de polvo de espíritu.
    Se pueden aplicar filtros opcionales por rareza, nivel o número de orden.
    """
    query = db.query(models.CantidadPolvoEspirituExtraer)
    
    if rareza:
        query = query.filter(models.CantidadPolvoEspirituExtraer.rareza == rareza)
    if nivel_espiritu:
        query = query.filter(models.CantidadPolvoEspirituExtraer.nivelEspiritu == nivel_espiritu)
    if numero_orden:
        query = query.filter(models.CantidadPolvoEspirituExtraer.numeroOrden == numero_orden)
    if temporada:
        query = query.filter(models.CantidadPolvoEspirituExtraer.temporada == temporada)
    
    query = query.order_by(
        models.CantidadPolvoEspirituExtraer.temporada,
        models.CantidadPolvoEspirituExtraer.numeroOrden,
        models.CantidadPolvoEspirituExtraer.rareza,
        models.CantidadPolvoEspirituExtraer.nivelEspiritu
    )
    
    return query.offset(skip).limit(limit).all()

# ============================================
# GET - Obtener una cantidad por ID
# ============================================
@router.get("/{cantidad_id}", response_model=schemas.CantidadPolvoExtraerResponse)
def get_cantidad_by_id(
    cantidad_id: int,
    db: Session = Depends(get_db)
):
    """Obtener una cantidad de polvo por su ID"""
    cantidad = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.id == cantidad_id
    ).first()
    
    if not cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cantidad de polvo no encontrada"
        )
    
    return cantidad

# ============================================
# GET - Obtener cantidad por combinación
# ============================================
@router.get("/buscar/", response_model=Optional[schemas.CantidadPolvoExtraerResponse])
def get_cantidad_by_combinacion(
    rareza: str = Query(..., description="Rareza del sprit"),
    nivel_espiritu: int = Query(..., description="Nivel del espíritu (1-5)"),
    temporada: Optional[str] = Query(None, description="Temporada (ej: C7T3)")
):
    """
    Obtener la cantidad de polvo para una combinación específica
    de rareza y nivel de espíritu.
    """
    query = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.rareza == rareza,
        models.CantidadPolvoEspirituExtraer.nivelEspiritu == nivel_espiritu
    )
    
    if temporada:
        query = query.filter(models.CantidadPolvoEspirituExtraer.temporada == temporada)
    
    cantidad = query.first()
    
    if not cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró cantidad para {rareza} - Nivel {nivel_espiritu}" + (f" - Temporada {temporada}" if temporada else "")
        )
    
    return cantidad

# ============================================
# GET - Obtener cantidades por número de orden
# ============================================
@router.get("/orden/{numero_orden}", response_model=List[schemas.CantidadPolvoExtraerResponse])
def get_cantidades_by_orden(
    numero_orden: int,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las cantidades de polvo por número de orden.
    """
    cantidades = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.numeroOrden == numero_orden
    ).all()
    
    if not cantidades:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron cantidades para el número de orden {numero_orden}"
        )
    
    return cantidades

# ============================================
# GET - Obtener cantidades por rareza
# ============================================
@router.get("/rareza/{rareza}", response_model=List[schemas.CantidadPolvoExtraerResponse])
def get_cantidades_by_rareza(
    rareza: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las cantidades de polvo por rareza.
    """
    cantidades = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.rareza == rareza
    ).order_by(
        models.CantidadPolvoEspirituExtraer.temporada,
        models.CantidadPolvoEspirituExtraer.numeroOrden,
        models.CantidadPolvoEspirituExtraer.nivelEspiritu
    ).all()
    
    if not cantidades:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron cantidades para la rareza {rareza}"
        )
    
    return cantidades

# ============================================
# GET - Obtener por temporada
# ============================================
@router.get("/temporada/{temporada}", response_model=List[schemas.CantidadPolvoExtraerResponse])
def get_cantidades_by_temporada(
    temporada: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las cantidades de polvo por temporada.
    """
    cantidades = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.temporada == temporada
    ).order_by(
        models.CantidadPolvoEspirituExtraer.numeroOrden,
        models.CantidadPolvoEspirituExtraer.rareza,
        models.CantidadPolvoEspirituExtraer.nivelEspiritu
    ).all()
    
    if not cantidades:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron cantidades para la temporada {temporada}"
        )
    
    return cantidades

# ============================================
# POST - Crear una nueva cantidad
# ============================================
@router.post(
    "/",
    response_model=schemas.CantidadPolvoExtraerResponse,
    status_code=status.HTTP_201_CREATED
)
def create_cantidad(
    cantidad: schemas.CantidadPolvoExtraerBase,
    db: Session = Depends(get_db)
):
    """
    Crear una nueva cantidad de polvo de espíritu.
    Verifica que no exista una combinación duplicada de (rareza, nivelEspiritu, temporada).
    Verifica que no exista la combinación (numeroOrden, temporada) duplicada.
    """
    # Verificar duplicado de combinación (rareza, nivelEspiritu, temporada)
    query = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.rareza == cantidad.rareza,
        models.CantidadPolvoEspirituExtraer.nivelEspiritu == cantidad.nivelEspiritu
    )
    
    if cantidad.temporada:
        query = query.filter(models.CantidadPolvoEspirituExtraer.temporada == cantidad.temporada)
    
    if query.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad para {cantidad.rareza} - Nivel {cantidad.nivelEspiritu}" + (f" - Temporada {cantidad.temporada}" if cantidad.temporada else "")
        )
    
    # 🔵 Verificar combinación (numeroOrden, temporada)
    if cantidad.temporada:
        existing_orden = db.query(models.CantidadPolvoEspirituExtraer).filter(
            models.CantidadPolvoEspirituExtraer.numeroOrden == cantidad.numeroOrden,
            models.CantidadPolvoEspirituExtraer.temporada == cantidad.temporada
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una cantidad con el número de orden {cantidad.numeroOrden} para la temporada {cantidad.temporada}"
            )
    else:
        existing_orden = db.query(models.CantidadPolvoEspirituExtraer).filter(
            models.CantidadPolvoEspirituExtraer.numeroOrden == cantidad.numeroOrden
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una cantidad con el número de orden {cantidad.numeroOrden}"
            )
    
    db_cantidad = models.CantidadPolvoEspirituExtraer(**cantidad.model_dump())
    db.add(db_cantidad)
    db.commit()
    db.refresh(db_cantidad)
    
    return db_cantidad

# ============================================
# PUT - Actualizar una cantidad existente
# ============================================
@router.put("/{cantidad_id}", response_model=schemas.CantidadPolvoExtraerResponse)
def update_cantidad(
    cantidad_id: int,
    cantidad_update: schemas.CantidadPolvoExtraerBase,
    db: Session = Depends(get_db)
):
    """
    Actualizar una cantidad de polvo existente.
    """
    db_cantidad = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.id == cantidad_id
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cantidad de polvo no encontrada"
        )
    
    # Verificar duplicado de combinación (rareza, nivelEspiritu, temporada)
    query = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.rareza == cantidad_update.rareza,
        models.CantidadPolvoEspirituExtraer.nivelEspiritu == cantidad_update.nivelEspiritu,
        models.CantidadPolvoEspirituExtraer.id != cantidad_id
    )
    
    if cantidad_update.temporada:
        query = query.filter(
            models.CantidadPolvoEspirituExtraer.temporada == cantidad_update.temporada
        )
    
    if query.first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad para {cantidad_update.rareza} - Nivel {cantidad_update.nivelEspiritu}" + (f" - Temporada {cantidad_update.temporada}" if cantidad_update.temporada else "")
        )
    
    # 🔵 Verificar duplicado de combinación (numeroOrden, temporada)
    temporada_actual = db_cantidad.temporada
    nueva_temporada = cantidad_update.temporada if cantidad_update.temporada is not None else temporada_actual
    
    if nueva_temporada:
        existing_orden = db.query(models.CantidadPolvoEspirituExtraer).filter(
            models.CantidadPolvoEspirituExtraer.numeroOrden == cantidad_update.numeroOrden,
            models.CantidadPolvoEspirituExtraer.temporada == nueva_temporada,
            models.CantidadPolvoEspirituExtraer.id != cantidad_id
        ).first()
    else:
        existing_orden = db.query(models.CantidadPolvoEspirituExtraer).filter(
            models.CantidadPolvoEspirituExtraer.numeroOrden == cantidad_update.numeroOrden,
            models.CantidadPolvoEspirituExtraer.id != cantidad_id
        ).first()
    
    if existing_orden:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad con el número de orden {cantidad_update.numeroOrden} para la temporada {nueva_temporada or 'sin temporada'}"
        )
    
    # Actualizar campos
    update_data = cantidad_update.model_dump()
    for key, value in update_data.items():
        setattr(db_cantidad, key, value)
    
    db.commit()
    db.refresh(db_cantidad)
    
    return db_cantidad

# ============================================
# PATCH - Actualizar parcialmente una cantidad
# ============================================
@router.patch("/{cantidad_id}", response_model=schemas.CantidadPolvoExtraerResponse)
def patch_cantidad(
    cantidad_id: int,
    cantidad_update: schemas.CantidadPolvoExtraerBase,
    db: Session = Depends(get_db)
):
    """
    Actualizar parcialmente una cantidad de polvo existente.
    Solo actualiza los campos que se envían.
    """
    db_cantidad = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.id == cantidad_id
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cantidad de polvo no encontrada"
        )
    
    update_data = cantidad_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cantidad, key, value)
    
    db.commit()
    db.refresh(db_cantidad)
    
    return db_cantidad

# ============================================
# DELETE - Eliminar una cantidad
# ============================================
@router.delete("/{cantidad_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cantidad(
    cantidad_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar una cantidad de polvo por su ID"""
    db_cantidad = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.id == cantidad_id
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cantidad de polvo no encontrada"
        )
    
    db.delete(db_cantidad)
    db.commit()
    
    return None

# ============================================
# DELETE - Eliminar por combinación
# ============================================
@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_cantidad_by_combinacion(
    rareza: str = Query(..., description="Rareza del sprit"),
    nivel_espiritu: int = Query(..., description="Nivel del espíritu (1-5)"),
    temporada: Optional[str] = Query(None, description="Temporada (ej: C7T3)")
):
    """
    Eliminar una cantidad de polvo por combinación de rareza, nivel y temporada.
    """
    query = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.rareza == rareza,
        models.CantidadPolvoEspirituExtraer.nivelEspiritu == nivel_espiritu
    )
    
    if temporada:
        query = query.filter(
            models.CantidadPolvoEspirituExtraer.temporada == temporada
        )
    
    db_cantidad = query.first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró cantidad para {rareza} - Nivel {nivel_espiritu}" + (f" - Temporada {temporada}" if temporada else "")
        )
    
    db.delete(db_cantidad)
    db.commit()
    
    return None

# ============================================
# DELETE - Eliminar por número de orden
# ============================================
@router.delete("/orden/{numero_orden}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cantidades_by_orden(
    numero_orden: int,
    db: Session = Depends(get_db)
):
    """
    Eliminar todas las cantidades de polvo con un número de orden específico.
    """
    cantidades = db.query(models.CantidadPolvoEspirituExtraer).filter(
        models.CantidadPolvoEspirituExtraer.numeroOrden == numero_orden
    ).all()
    
    if not cantidades:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron cantidades para el número de orden {numero_orden}"
        )
    
    for cantidad in cantidades:
        db.delete(cantidad)
    
    db.commit()
    
    return None