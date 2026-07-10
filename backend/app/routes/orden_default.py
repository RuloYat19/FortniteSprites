from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/orden-default", tags=["orden-default"])

# ============================================
# GET - Obtener todos los órdenes default
# ============================================
@router.get("/", response_model=List[schemas.OrdenDefaultResponse])
def get_all_orden_default(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    nombre: Optional[str] = None
):
    """
    Obtener todos los órdenes default con filtros opcionales
    """
    query = db.query(models.OrdenDefault)
    
    # Aplicar filtros
    if nombre:
        query = query.filter(models.OrdenDefault.nombre.ilike(f"%{nombre}%"))
    
    # Ordenar por número de orden
    query = query.order_by(models.OrdenDefault.numeroOrden)
    
    return query.offset(skip).limit(limit).all()

# ============================================
# GET - Obtener un orden default por ID
# ============================================
@router.get("/{orden_id}", response_model=schemas.OrdenDefaultResponse)
def get_orden_by_id(
    orden_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un orden default por su ID"""
    orden = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.id == orden_id
    ).first()
    
    if not orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden default no encontrado"
        )
    
    return orden

# ============================================
# GET - Obtener orden por nombre
# ============================================
@router.get("/nombre/{nombre}", response_model=schemas.OrdenDefaultResponse)
def get_orden_by_nombre(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Obtener un orden default por su nombre exacto"""
    orden = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.nombre == nombre
    ).first()
    
    if not orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden default '{nombre}' no encontrado"
        )
    
    return orden

# ============================================
# GET - Verificar si un nombre existe en orden default
# ============================================
@router.get("/existe/{nombre}", response_model=bool)
def verificar_nombre_existe(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Verificar si un nombre ya existe en el orden default"""
    existe = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.nombre == nombre
    ).first() is not None
    
    return existe

# ============================================
# POST - Crear un nuevo orden default
# ============================================
@router.post(
    "/",
    response_model=schemas.OrdenDefaultResponse,
    status_code=status.HTTP_201_CREATED
)
def create_orden(
    orden: schemas.OrdenDefaultCreate,
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo orden default.
    Verifica que no exista un nombre duplicado o número de orden duplicado.
    """
    # Verificar si ya existe un nombre igual
    existing = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.nombre == orden.nombre
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un orden default con el nombre: '{orden.nombre}'"
        )
    
    # Verificar si el número de orden ya está en uso
    existing_orden = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.numeroOrden == orden.numeroOrden
    ).first()
    
    if existing_orden:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un orden default con el número de orden {orden.numeroOrden}"
        )
    
    db_orden = models.OrdenDefault(**orden.model_dump())
    db.add(db_orden)
    db.commit()
    db.refresh(db_orden)
    
    return db_orden

# ============================================
# POST - Crear múltiples órdenes default
# ============================================
@router.post(
    "/batch",
    response_model=List[schemas.OrdenDefaultResponse],
    status_code=status.HTTP_201_CREATED
)
def create_ordenes_batch(
    ordenes: List[schemas.OrdenDefaultCreate],
    db: Session = Depends(get_db)
):
    """
    Crear múltiples órdenes default.
    Omite los que ya existen.
    """
    creados = []
    errores = []
    
    for orden_data in ordenes:
        try:
            # Verificar si ya existe
            existing = db.query(models.OrdenDefault).filter(
                models.OrdenDefault.nombre == orden_data.nombre
            ).first()
            
            if existing:
                errores.append(f"'{orden_data.nombre}' ya existe")
                continue
            
            # Verificar número de orden duplicado
            existing_orden = db.query(models.OrdenDefault).filter(
                models.OrdenDefault.numeroOrden == orden_data.numeroOrden
            ).first()
            
            if existing_orden:
                errores.append(f"Número de orden {orden_data.numeroOrden} ya está en uso")
                continue
            
            db_orden = models.OrdenDefault(**orden_data.model_dump())
            db.add(db_orden)
            creados.append(orden_data.nombre)
            
        except Exception as e:
            errores.append(f"Error al crear '{orden_data.nombre}': {str(e)}")
    
    if creados:
        db.commit()
        # Refrescar los creados
        ordenes_creados = db.query(models.OrdenDefault).filter(
            models.OrdenDefault.nombre.in_(creados)
        ).all()
        return ordenes_creados
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se pudo crear ningún orden: {', '.join(errores)}"
        )

# ============================================
# PUT - Actualizar un orden default existente
# ============================================
@router.put("/{orden_id}", response_model=schemas.OrdenDefaultResponse)
def update_orden(
    orden_id: int,
    orden_update: schemas.OrdenDefaultUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar un orden default existente.
    """
    db_orden = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.id == orden_id
    ).first()
    
    if not db_orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden default no encontrado"
        )
    
    # Verificar duplicados de nombre (excluyendo el mismo registro)
    if orden_update.nombre:
        existing = db.query(models.OrdenDefault).filter(
            models.OrdenDefault.nombre == orden_update.nombre,
            models.OrdenDefault.id != orden_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden default con el nombre: '{orden_update.nombre}'"
            )
    
    # Verificar duplicado de número de orden (excluyendo el mismo registro)
    if orden_update.numeroOrden:
        existing_orden = db.query(models.OrdenDefault).filter(
            models.OrdenDefault.numeroOrden == orden_update.numeroOrden,
            models.OrdenDefault.id != orden_id
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden default con el número de orden {orden_update.numeroOrden}"
            )
    
    # Actualizar campos
    update_data = orden_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_orden, key, value)
    
    db.commit()
    db.refresh(db_orden)
    
    return db_orden

# ============================================
# DELETE - Eliminar un orden default
# ============================================
@router.delete("/{orden_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_orden(
    orden_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar un orden default por su ID"""
    db_orden = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.id == orden_id
    ).first()
    
    if not db_orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden default no encontrado"
        )
    
    # Verificar si hay sprits que usan este nombre en el orden default
    # (Esto es opcional, depende de tu lógica de negocio)
    
    db.delete(db_orden)
    db.commit()
    
    return None