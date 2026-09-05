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
    nombre: Optional[str] = None,
    temporada: Optional[str] = Query(None, description="Filtrar por temporada (ej: C7T3)")
):
    """
    Obtener todos los órdenes default con filtros opcionales
    """
    query = db.query(models.OrdenDefault)
    
    if nombre:
        query = query.filter(models.OrdenDefault.nombre.ilike(f"%{nombre}%"))
    if temporada:
        query = query.filter(models.OrdenDefault.temporada == temporada)
    
    query = query.order_by(models.OrdenDefault.temporada, models.OrdenDefault.numeroOrden)
    
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
# GET - Obtener por temporada
# ============================================
@router.get("/temporada/{temporada}", response_model=List[schemas.OrdenDefaultResponse])
def get_orden_default_by_temporada(
    temporada: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todos los órdenes default de una temporada específica.
    """
    ordenes = db.query(models.OrdenDefault).filter(
        models.OrdenDefault.temporada == temporada
    ).order_by(models.OrdenDefault.numeroOrden).all()
    
    if not ordenes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron órdenes default para la temporada {temporada}"
        )
    
    return ordenes

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
    Verifica que no exista un nombre duplicado.
    Verifica que no exista la combinación (numeroOrden, temporada) duplicada.
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
    
    # 🔵 Verificar que no exista la combinación (numeroOrden, temporada)
    # Solo si se proporciona temporada
    if orden.temporada:
        existing_orden = db.query(models.OrdenDefault).filter(
            models.OrdenDefault.numeroOrden == orden.numeroOrden,
            models.OrdenDefault.temporada == orden.temporada
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden default con el número de orden {orden.numeroOrden} para la temporada {orden.temporada}"
            )
    else:
        # Si no se proporciona temporada, verificar solo por numeroOrden (compatibilidad con datos antiguos)
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
            # Verificar si ya existe un nombre igual
            existing = db.query(models.OrdenDefault).filter(
                models.OrdenDefault.nombre == orden_data.nombre
            ).first()
            
            if existing:
                errores.append(f"'{orden_data.nombre}' ya existe")
                continue
            
            # 🔵 Verificar combinación (numeroOrden, temporada)
            if orden_data.temporada:
                existing_orden = db.query(models.OrdenDefault).filter(
                    models.OrdenDefault.numeroOrden == orden_data.numeroOrden,
                    models.OrdenDefault.temporada == orden_data.temporada
                ).first()
            else:
                existing_orden = db.query(models.OrdenDefault).filter(
                    models.OrdenDefault.numeroOrden == orden_data.numeroOrden
                ).first()
            
            if existing_orden:
                errores.append(f"Número de orden {orden_data.numeroOrden} ya está en uso para la temporada {orden_data.temporada or 'sin temporada'}")
                continue
            
            db_orden = models.OrdenDefault(**orden_data.model_dump())
            db.add(db_orden)
            creados.append(orden_data.nombre)
            
        except Exception as e:
            errores.append(f"Error al crear '{orden_data.nombre}': {str(e)}")
    
    if creados:
        db.commit()
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
    
    # 🔵 Verificar duplicado de combinación (numeroOrden, temporada)
    if orden_update.numeroOrden:
        # Obtener la temporada actual del registro
        temporada_actual = db_orden.temporada
        nueva_temporada = orden_update.temporada if orden_update.temporada is not None else temporada_actual
        
        if nueva_temporada:
            existing_orden = db.query(models.OrdenDefault).filter(
                models.OrdenDefault.numeroOrden == orden_update.numeroOrden,
                models.OrdenDefault.temporada == nueva_temporada,
                models.OrdenDefault.id != orden_id
            ).first()
        else:
            existing_orden = db.query(models.OrdenDefault).filter(
                models.OrdenDefault.numeroOrden == orden_update.numeroOrden,
                models.OrdenDefault.id != orden_id
            ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden default con el número de orden {orden_update.numeroOrden} para la temporada {nueva_temporada or 'sin temporada'}"
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
    
    db.delete(db_orden)
    db.commit()
    
    return None