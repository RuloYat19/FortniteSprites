# backend/app/routes/cantidad_polvo.py
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/cantidad-polvo", tags=["cantidad-polvo"])

# ============================================
# GET - Obtener todas las cantidades
# ============================================
@router.get("/", response_model=List[schemas.CantidadPolvoResponse])
def get_all_cantidades(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    rareza: Optional[str] = None,
    nivel_espiritu: Optional[int] = None,
    numero_orden: Optional[int] = None
):
    """
    Obtener todas las cantidades de polvo de espíritu.
    Se pueden aplicar filtros opcionales por rareza, nivel o número de orden.
    """
    query = db.query(models.CantidadPolvoEspiritu)
    
    # Aplicar filtros
    if rareza:
        query = query.filter(models.CantidadPolvoEspiritu.rareza == rareza)
    if nivel_espiritu:
        query = query.filter(models.CantidadPolvoEspiritu.nivelEspiritu == nivel_espiritu)
    if numero_orden:
        query = query.filter(models.CantidadPolvoEspiritu.numeroOrden == numero_orden)
    
    # Ordenar por número de orden, rareza y nivel
    query = query.order_by(
        models.CantidadPolvoEspiritu.numeroOrden,
        models.CantidadPolvoEspiritu.rareza,
        models.CantidadPolvoEspiritu.nivelEspiritu
    )
    
    return query.offset(skip).limit(limit).all()


# ============================================
# GET - Obtener una cantidad por ID
# ============================================
@router.get("/{cantidad_id}", response_model=schemas.CantidadPolvoResponse)
def get_cantidad_by_id(
    cantidad_id: int,
    db: Session = Depends(get_db)
):
    """Obtener una cantidad de polvo por su ID"""
    cantidad = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.id == cantidad_id
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
@router.get("/buscar/", response_model=Optional[schemas.CantidadPolvoResponse])
def get_cantidad_by_combinacion(
    rareza: str = Query(..., description="Rareza del sprit"),
    nivel_espiritu: int = Query(..., description="Nivel del espíritu (1-5)"),
    db: Session = Depends(get_db)
):
    """
    Obtener la cantidad de polvo para una combinación específica
    de rareza y nivel de espíritu.
    """
    cantidad = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.rareza == rareza,
        models.CantidadPolvoEspiritu.nivelEspiritu == nivel_espiritu
    ).first()
    
    if not cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró cantidad para {rareza} - Nivel {nivel_espiritu}"
        )
    
    return cantidad


# ============================================
# GET - Obtener cantidades por número de orden
# ============================================
@router.get("/orden/{numero_orden}", response_model=List[schemas.CantidadPolvoResponse])
def get_cantidades_by_orden(
    numero_orden: int,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las cantidades de polvo por número de orden.
    """
    cantidades = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.numeroOrden == numero_orden
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
@router.get("/rareza/{rareza}", response_model=List[schemas.CantidadPolvoResponse])
def get_cantidades_by_rareza(
    rareza: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las cantidades de polvo por rareza.
    """
    cantidades = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.rareza == rareza
    ).order_by(
        models.CantidadPolvoEspiritu.numeroOrden,
        models.CantidadPolvoEspiritu.nivelEspiritu
    ).all()
    
    if not cantidades:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron cantidades para la rareza {rareza}"
        )
    
    return cantidades


# ============================================
# POST - Crear una nueva cantidad
# ============================================
@router.post(
    "/",
    response_model=schemas.CantidadPolvoResponse,
    status_code=status.HTTP_201_CREATED
)
def create_cantidad(
    cantidad: schemas.CantidadPolvoBase,
    db: Session = Depends(get_db)
):
    """
    Crear una nueva cantidad de polvo de espíritu.
    Verifica que no exista una combinación duplicada.
    """
    # Verificar si ya existe una combinación igual
    existing = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.rareza == cantidad.rareza,
        models.CantidadPolvoEspiritu.nivelEspiritu == cantidad.nivelEspiritu
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad para {cantidad.rareza} - Nivel {cantidad.nivelEspiritu}"
        )
    
    # Verificar que el número de orden no esté duplicado (opcional)
    existing_orden = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.numeroOrden == cantidad.numeroOrden
    ).first()
    
    if existing_orden:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad con el número de orden {cantidad.numeroOrden}"
        )
    
    db_cantidad = models.CantidadPolvoEspiritu(**cantidad.model_dump())
    db.add(db_cantidad)
    db.commit()
    db.refresh(db_cantidad)
    
    return db_cantidad


# ============================================
# PUT - Actualizar una cantidad existente
# ============================================
@router.put("/{cantidad_id}", response_model=schemas.CantidadPolvoResponse)
def update_cantidad(
    cantidad_id: int,
    cantidad_update: schemas.CantidadPolvoBase,
    db: Session = Depends(get_db)
):
    """
    Actualizar una cantidad de polvo existente.
    """
    db_cantidad = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.id == cantidad_id
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cantidad de polvo no encontrada"
        )
    
    # Verificar duplicados (excluyendo el mismo registro)
    existing = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.rareza == cantidad_update.rareza,
        models.CantidadPolvoEspiritu.nivelEspiritu == cantidad_update.nivelEspiritu,
        models.CantidadPolvoEspiritu.id != cantidad_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad para {cantidad_update.rareza} - Nivel {cantidad_update.nivelEspiritu}"
        )
    
    # Verificar duplicado de número de orden (excluyendo el mismo registro)
    existing_orden = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.numeroOrden == cantidad_update.numeroOrden,
        models.CantidadPolvoEspiritu.id != cantidad_id
    ).first()
    
    if existing_orden:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad con el número de orden {cantidad_update.numeroOrden}"
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
@router.patch("/{cantidad_id}", response_model=schemas.CantidadPolvoResponse)
def patch_cantidad(
    cantidad_id: int,
    cantidad_update: schemas.CantidadPolvoBase,
    db: Session = Depends(get_db)
):
    """
    Actualizar parcialmente una cantidad de polvo existente.
    Solo actualiza los campos que se envían.
    """
    db_cantidad = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.id == cantidad_id
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cantidad de polvo no encontrada"
        )
    
    # Actualizar solo los campos enviados
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
    db_cantidad = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.id == cantidad_id
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
    db: Session = Depends(get_db)
):
    """
    Eliminar una cantidad de polvo por combinación de rareza y nivel.
    """
    db_cantidad = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.rareza == rareza,
        models.CantidadPolvoEspiritu.nivelEspiritu == nivel_espiritu
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró cantidad para {rareza} - Nivel {nivel_espiritu}"
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
    cantidades = db.query(models.CantidadPolvoEspiritu).filter(
        models.CantidadPolvoEspiritu.numeroOrden == numero_orden
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