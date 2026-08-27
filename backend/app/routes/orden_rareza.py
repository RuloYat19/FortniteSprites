from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/orden-rareza", tags=["orden-rareza"])

# ============================================
# GET - Obtener todos los órdenes por rareza
# ============================================
@router.get("/", response_model=List[schemas.OrdenRarezaResponse])
def get_all_orden_rareza(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    nombre: Optional[str] = None,
    temporada: Optional[str] = Query(None, description="Filtrar por temporada (ej: C7T3)")
):
    """
    Obtener todos los órdenes por rareza con filtros opcionales
    """
    query = db.query(models.OrdenRareza)
    
    if nombre:
        query = query.filter(models.OrdenRareza.nombre.ilike(f"%{nombre}%"))
    if temporada:
        query = query.filter(models.OrdenRareza.temporada == temporada)
    
    query = query.order_by(models.OrdenRareza.temporada, models.OrdenRareza.numeroOrden)
    
    return query.offset(skip).limit(limit).all()

# ============================================
# GET - Obtener un orden por rareza por ID
# ============================================
@router.get("/{orden_id}", response_model=schemas.OrdenRarezaResponse)
def get_orden_rareza_by_id(
    orden_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un orden por rareza por su ID"""
    orden = db.query(models.OrdenRareza).filter(
        models.OrdenRareza.id == orden_id
    ).first()
    
    if not orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden por rareza no encontrado"
        )
    
    return orden

# ============================================
# GET - Obtener orden por rareza por nombre
# ============================================
@router.get("/nombre/{nombre}", response_model=schemas.OrdenRarezaResponse)
def get_orden_rareza_by_nombre(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Obtener un orden por rareza por su nombre exacto"""
    orden = db.query(models.OrdenRareza).filter(
        models.OrdenRareza.nombre == nombre
    ).first()
    
    if not orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Orden por rareza '{nombre}' no encontrado"
        )
    
    return orden

# ============================================
# GET - Verificar si un nombre existe en orden rareza
# ============================================
@router.get("/existe/{nombre}", response_model=bool)
def verificar_nombre_existe_rareza(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Verificar si un nombre ya existe en el orden por rareza"""
    existe = db.query(models.OrdenRareza).filter(
        models.OrdenRareza.nombre == nombre
    ).first() is not None
    
    return existe

# ============================================
# GET - Obtener por temporada
# ============================================
@router.get("/temporada/{temporada}", response_model=List[schemas.OrdenRarezaResponse])
def get_orden_rareza_by_temporada(
    temporada: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todos los órdenes por rareza de una temporada específica.
    """
    ordenes = db.query(models.OrdenRareza).filter(
        models.OrdenRareza.temporada == temporada
    ).order_by(models.OrdenRareza.numeroOrden).all()
    
    if not ordenes:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron órdenes por rareza para la temporada {temporada}"
        )
    
    return ordenes

# ============================================
# POST - Crear un nuevo orden por rareza
# ============================================
@router.post(
    "/",
    response_model=schemas.OrdenRarezaResponse,
    status_code=status.HTTP_201_CREATED
)
def create_orden_rareza(
    orden: schemas.OrdenRarezaCreate,
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo orden por rareza.
    Verifica que no exista un nombre duplicado.
    Verifica que no exista la combinación (numeroOrden, temporada) duplicada.
    """
    # Verificar si ya existe un nombre igual
    existing = db.query(models.OrdenRareza).filter(
        models.OrdenRareza.nombre == orden.nombre
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un orden por rareza con el nombre: '{orden.nombre}'"
        )
    
    # 🔵 Verificar combinación (numeroOrden, temporada)
    if orden.temporada:
        existing_orden = db.query(models.OrdenRareza).filter(
            models.OrdenRareza.numeroOrden == orden.numeroOrden,
            models.OrdenRareza.temporada == orden.temporada
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden por rareza con el número de orden {orden.numeroOrden} para la temporada {orden.temporada}"
            )
    else:
        existing_orden = db.query(models.OrdenRareza).filter(
            models.OrdenRareza.numeroOrden == orden.numeroOrden
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden por rareza con el número de orden {orden.numeroOrden}"
            )
    
    db_orden = models.OrdenRareza(**orden.model_dump())
    db.add(db_orden)
    db.commit()
    db.refresh(db_orden)
    
    return db_orden

# ============================================
# POST - Crear múltiples órdenes por rareza
# ============================================
@router.post(
    "/batch",
    response_model=List[schemas.OrdenRarezaResponse],
    status_code=status.HTTP_201_CREATED
)
def create_ordenes_rareza_batch(
    ordenes: List[schemas.OrdenRarezaCreate],
    db: Session = Depends(get_db)
):
    """
    Crear múltiples órdenes por rareza.
    Omite los que ya existen.
    """
    creados = []
    errores = []
    
    for orden_data in ordenes:
        try:
            # Verificar si ya existe un nombre igual
            existing = db.query(models.OrdenRareza).filter(
                models.OrdenRareza.nombre == orden_data.nombre
            ).first()
            
            if existing:
                errores.append(f"'{orden_data.nombre}' ya existe")
                continue
            
            # 🔵 Verificar combinación (numeroOrden, temporada)
            if orden_data.temporada:
                existing_orden = db.query(models.OrdenRareza).filter(
                    models.OrdenRareza.numeroOrden == orden_data.numeroOrden,
                    models.OrdenRareza.temporada == orden_data.temporada
                ).first()
            else:
                existing_orden = db.query(models.OrdenRareza).filter(
                    models.OrdenRareza.numeroOrden == orden_data.numeroOrden
                ).first()
            
            if existing_orden:
                errores.append(f"Número de orden {orden_data.numeroOrden} ya está en uso para la temporada {orden_data.temporada or 'sin temporada'}")
                continue
            
            db_orden = models.OrdenRareza(**orden_data.model_dump())
            db.add(db_orden)
            creados.append(orden_data.nombre)
            
        except Exception as e:
            errores.append(f"Error al crear '{orden_data.nombre}': {str(e)}")
    
    if creados:
        db.commit()
        ordenes_creados = db.query(models.OrdenRareza).filter(
            models.OrdenRareza.nombre.in_(creados)
        ).all()
        return ordenes_creados
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se pudo crear ningún orden: {', '.join(errores)}"
        )

# ============================================
# PUT - Actualizar un orden por rareza existente
# ============================================
@router.put("/{orden_id}", response_model=schemas.OrdenRarezaResponse)
def update_orden_rareza(
    orden_id: int,
    orden_update: schemas.OrdenRarezaUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar un orden por rareza existente.
    """
    db_orden = db.query(models.OrdenRareza).filter(
        models.OrdenRareza.id == orden_id
    ).first()
    
    if not db_orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden por rareza no encontrado"
        )
    
    # Verificar duplicados de nombre (excluyendo el mismo registro)
    if orden_update.nombre:
        existing = db.query(models.OrdenRareza).filter(
            models.OrdenRareza.nombre == orden_update.nombre,
            models.OrdenRareza.id != orden_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden por rareza con el nombre: '{orden_update.nombre}'"
            )
    
    # 🔵 Verificar duplicado de combinación (numeroOrden, temporada)
    if orden_update.numeroOrden:
        temporada_actual = db_orden.temporada
        nueva_temporada = orden_update.temporada if orden_update.temporada is not None else temporada_actual
        
        if nueva_temporada:
            existing_orden = db.query(models.OrdenRareza).filter(
                models.OrdenRareza.numeroOrden == orden_update.numeroOrden,
                models.OrdenRareza.temporada == nueva_temporada,
                models.OrdenRareza.id != orden_id
            ).first()
        else:
            existing_orden = db.query(models.OrdenRareza).filter(
                models.OrdenRareza.numeroOrden == orden_update.numeroOrden,
                models.OrdenRareza.id != orden_id
            ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un orden por rareza con el número de orden {orden_update.numeroOrden} para la temporada {nueva_temporada or 'sin temporada'}"
            )
    
    # Actualizar campos
    update_data = orden_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_orden, key, value)
    
    db.commit()
    db.refresh(db_orden)
    
    return db_orden

# ============================================
# DELETE - Eliminar un orden por rareza
# ============================================
@router.delete("/{orden_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_orden_rareza(
    orden_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar un orden por rareza por su ID"""
    db_orden = db.query(models.OrdenRareza).filter(
        models.OrdenRareza.id == orden_id
    ).first()
    
    if not db_orden:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Orden por rareza no encontrado"
        )
    
    db.delete(db_orden)
    db.commit()
    
    return None