from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/materiales", tags=["materiales"])

# ============================================
# GET - Obtener todos los materiales
# ============================================
@router.get("/", response_model=List[schemas.MaterialResponse])
def get_all_materiales(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    nombre: Optional[str] = None
):
    """
    Obtener todos los materiales con filtros opcionales
    """
    query = db.query(models.Material)
    
    # Aplicar filtros
    if nombre:
        query = query.filter(models.Material.nombre.ilike(f"%{nombre}%"))
    
    # Ordenar por número de orden
    query = query.order_by(models.Material.numeroOrden)
    
    return query.offset(skip).limit(limit).all()

# ============================================
# GET - Obtener un material por ID
# ============================================
@router.get("/{material_id}", response_model=schemas.MaterialResponse)
def get_material_by_id(
    material_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un material por su ID"""
    material = db.query(models.Material).filter(
        models.Material.id == material_id
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material no encontrado"
        )
    
    return material

# ============================================
# GET - Obtener material por nombre
# ============================================
@router.get("/nombre/{nombre}", response_model=schemas.MaterialResponse)
def get_material_by_nombre(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Obtener un material por su nombre exacto"""
    material = db.query(models.Material).filter(
        models.Material.nombre == nombre
    ).first()
    
    if not material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Material '{nombre}' no encontrado"
        )
    
    return material

# ============================================
# POST - Crear un nuevo material
# ============================================
@router.post(
    "/",
    response_model=schemas.MaterialResponse,
    status_code=status.HTTP_201_CREATED
)
def create_material(
    material: schemas.MaterialCreate,
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo material.
    Verifica que no exista un material con el mismo nombre.
    """
    # Verificar si ya existe un material con el mismo nombre
    existing = db.query(models.Material).filter(
        models.Material.nombre == material.nombre
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un material con el nombre '{material.nombre}'"
        )
    
    # Verificar si el número de orden ya está en uso
    existing_orden = db.query(models.Material).filter(
        models.Material.numeroOrden == material.numeroOrden
    ).first()
    
    if existing_orden:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un material con el número de orden {material.numeroOrden}"
        )
    
    db_material = models.Material(**material.model_dump())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    
    return db_material

# ============================================
# PUT - Actualizar un material existente
# ============================================
@router.put("/{material_id}", response_model=schemas.MaterialResponse)
def update_material(
    material_id: int,
    material_update: schemas.MaterialUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar un material existente.
    """
    db_material = db.query(models.Material).filter(
        models.Material.id == material_id
    ).first()
    
    if not db_material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material no encontrado"
        )
    
    # Verificar duplicados de nombre (excluyendo el mismo registro)
    if material_update.nombre:
        existing = db.query(models.Material).filter(
            models.Material.nombre == material_update.nombre,
            models.Material.id != material_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un material con el nombre '{material_update.nombre}'"
            )
    
    # Verificar duplicado de número de orden (excluyendo el mismo registro)
    if material_update.numeroOrden:
        existing_orden = db.query(models.Material).filter(
            models.Material.numeroOrden == material_update.numeroOrden,
            models.Material.id != material_id
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un material con el número de orden {material_update.numeroOrden}"
            )
    
    # Actualizar campos
    update_data = material_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_material, key, value)
    
    db.commit()
    db.refresh(db_material)
    
    return db_material

# ============================================
# DELETE - Eliminar un material
# ============================================
@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(
    material_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar un material por su ID"""
    db_material = db.query(models.Material).filter(
        models.Material.id == material_id
    ).first()
    
    if not db_material:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Material no encontrado"
        )
    
    # Verificar si hay sprits que usan este material
    sprits_usando = db.query(models.Sprit).filter(
        models.Sprit.material == db_material.nombre
    ).first()
    
    if sprits_usando:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el material '{db_material.nombre}' porque hay sprits que lo usan"
        )
    
    db.delete(db_material)
    db.commit()
    
    return None