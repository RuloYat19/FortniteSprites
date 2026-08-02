from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/cantidad-polvo-invocar", tags=["cantidad-polvo-invocar"])

# ============================================
# GET - Obtener todas las cantidades
# ============================================
@router.get("/", response_model=List[schemas.CantidadPolvoInvocarResponse])
def get_all_cantidades(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    material: Optional[str] = None,
    rareza: Optional[str] = None,
    numero_orden: Optional[int] = None
):
    """
    Obtener todas las cantidades de polvo de espíritu al invocar.
    Se pueden aplicar filtros opcionales por material, rareza o número de orden.
    """
    query = db.query(models.CantidadPolvoEspirituInvocar)
    
    # Aplicar filtros
    if material:
        query = query.filter(models.CantidadPolvoEspirituInvocar.material == material)
    if rareza:
        query = query.filter(models.CantidadPolvoEspirituInvocar.rareza == rareza)
    if numero_orden:
        query = query.filter(models.CantidadPolvoEspirituInvocar.numeroOrden == numero_orden)
    
    # Ordenar por número de orden, material y rareza
    query = query.order_by(
        models.CantidadPolvoEspirituInvocar.numeroOrden,
        models.CantidadPolvoEspirituInvocar.material,
        models.CantidadPolvoEspirituInvocar.rareza
    )
    
    return query.offset(skip).limit(limit).all()

# ============================================
# GET - Obtener una cantidad por ID
# ============================================
@router.get("/{cantidad_id}", response_model=schemas.CantidadPolvoInvocarResponse)
def get_cantidad_by_id(
    cantidad_id: int,
    db: Session = Depends(get_db)
):
    """Obtener una cantidad de polvo por su ID"""
    cantidad = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.id == cantidad_id
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
@router.get("/buscar/", response_model=Optional[schemas.CantidadPolvoInvocarResponse])
def get_cantidad_by_combinacion(
    material: str = Query(..., description="Material del sprit"),
    rareza: str = Query(..., description="Rareza del sprit"),
    db: Session = Depends(get_db)
):
    """
    Obtener la cantidad de polvo para una combinación específica
    de material y rareza.
    """
    cantidad = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.material == material,
        models.CantidadPolvoEspirituInvocar.rareza == rareza
    ).first()
    
    if not cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró cantidad para {material} - {rareza}"
        )
    
    return cantidad

# ============================================
# GET - Obtener cantidades por material
# ============================================
@router.get("/material/{material}", response_model=List[schemas.CantidadPolvoInvocarResponse])
def get_cantidades_by_material(
    material: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las cantidades de polvo por material.
    """
    cantidades = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.material == material
    ).order_by(
        models.CantidadPolvoEspirituInvocar.numeroOrden,
        models.CantidadPolvoEspirituInvocar.rareza
    ).all()
    
    if not cantidades:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron cantidades para el material {material}"
        )
    
    return cantidades

# ============================================
# GET - Obtener cantidades por rareza
# ============================================
@router.get("/rareza/{rareza}", response_model=List[schemas.CantidadPolvoInvocarResponse])
def get_cantidades_by_rareza(
    rareza: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todas las cantidades de polvo por rareza.
    """
    cantidades = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.rareza == rareza
    ).order_by(
        models.CantidadPolvoEspirituInvocar.numeroOrden,
        models.CantidadPolvoEspirituInvocar.material
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
    response_model=schemas.CantidadPolvoInvocarResponse,
    status_code=status.HTTP_201_CREATED
)
def create_cantidad(
    cantidad: schemas.CantidadPolvoInvocarCreate,
    db: Session = Depends(get_db)
):
    """
    Crear una nueva cantidad de polvo de espíritu al invocar.
    Verifica que no exista una combinación duplicada.
    """
    # Verificar si ya existe una combinación igual
    existing = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.material == cantidad.material,
        models.CantidadPolvoEspirituInvocar.rareza == cantidad.rareza
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad para {cantidad.material} - {cantidad.rareza}"
        )
    
    # Verificar que el número de orden no esté duplicado
    existing_orden = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.numeroOrden == cantidad.numeroOrden
    ).first()
    
    if existing_orden:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe una cantidad con el número de orden {cantidad.numeroOrden}"
        )
    
    db_cantidad = models.CantidadPolvoEspirituInvocar(**cantidad.model_dump())
    db.add(db_cantidad)
    db.commit()
    db.refresh(db_cantidad)
    
    return db_cantidad

# ============================================
# PUT - Actualizar una cantidad existente
# ============================================
@router.put("/{cantidad_id}", response_model=schemas.CantidadPolvoInvocarResponse)
def update_cantidad(
    cantidad_id: int,
    cantidad_update: schemas.CantidadPolvoInvocarUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar una cantidad de polvo existente.
    """
    db_cantidad = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.id == cantidad_id
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cantidad de polvo no encontrada"
        )
    
    # Verificar duplicados (excluyendo el mismo registro)
    if cantidad_update.material and cantidad_update.rareza:
        existing = db.query(models.CantidadPolvoEspirituInvocar).filter(
            models.CantidadPolvoEspirituInvocar.material == cantidad_update.material,
            models.CantidadPolvoEspirituInvocar.rareza == cantidad_update.rareza,
            models.CantidadPolvoEspirituInvocar.id != cantidad_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una cantidad para {cantidad_update.material} - {cantidad_update.rareza}"
            )
    
    # Verificar duplicado de número de orden (excluyendo el mismo registro)
    if cantidad_update.numeroOrden:
        existing_orden = db.query(models.CantidadPolvoEspirituInvocar).filter(
            models.CantidadPolvoEspirituInvocar.numeroOrden == cantidad_update.numeroOrden,
            models.CantidadPolvoEspirituInvocar.id != cantidad_id
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe una cantidad con el número de orden {cantidad_update.numeroOrden}"
            )
    
    # Actualizar campos
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
    db_cantidad = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.id == cantidad_id
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
    material: str = Query(..., description="Material del sprit"),
    rareza: str = Query(..., description="Rareza del sprit"),
    db: Session = Depends(get_db)
):
    """
    Eliminar una cantidad de polvo por combinación de material y rareza.
    """
    db_cantidad = db.query(models.CantidadPolvoEspirituInvocar).filter(
        models.CantidadPolvoEspirituInvocar.material == material,
        models.CantidadPolvoEspirituInvocar.rareza == rareza
    ).first()
    
    if not db_cantidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró cantidad para {material} - {rareza}"
        )
    
    db.delete(db_cantidad)
    db.commit()
    
    return None