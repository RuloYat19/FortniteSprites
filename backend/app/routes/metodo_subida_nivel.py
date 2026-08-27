from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/metodo-subida-nivel", tags=["metodo-subida-nivel"])

# ============================================
# GET - Obtener todos los métodos
# ============================================
@router.get("/", response_model=List[schemas.MetodoSubidaNivelResponse])
def get_all_metodos(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    nombre: Optional[str] = None
):
    """
    Obtener todos los métodos de subida de nivel con filtros opcionales
    """
    query = db.query(models.MetodoSubidaNivel)
    
    if nombre:
        query = query.filter(models.MetodoSubidaNivel.nombre.ilike(f"%{nombre}%"))
    
    query = query.order_by(models.MetodoSubidaNivel.numeroOrden)
    
    return query.offset(skip).limit(limit).all()

# ============================================
# GET - Obtener un método por ID
# ============================================
@router.get("/{metodo_id}", response_model=schemas.MetodoSubidaNivelResponse)
def get_metodo_by_id(
    metodo_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un método de subida de nivel por su ID"""
    metodo = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.id == metodo_id
    ).first()
    
    if not metodo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Método de subida de nivel no encontrado"
        )
    
    return metodo

# ============================================
# GET - Obtener método por nombre
# ============================================
@router.get("/nombre/{nombre}", response_model=schemas.MetodoSubidaNivelResponse)
def get_metodo_by_nombre(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Obtener un método de subida de nivel por su nombre exacto"""
    metodo = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.nombre == nombre
    ).first()
    
    if not metodo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Método '{nombre}' no encontrado"
        )
    
    return metodo

# ============================================
# GET - Verificar si un nombre existe
# ============================================
@router.get("/existe/{nombre}", response_model=bool)
def verificar_nombre_existe(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Verificar si un método de subida de nivel ya existe"""
    existe = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.nombre == nombre
    ).first() is not None
    
    return existe

# ============================================
# POST - Crear un nuevo método
# ============================================
@router.post(
    "/",
    response_model=schemas.MetodoSubidaNivelResponse,
    status_code=status.HTTP_201_CREATED
)
def create_metodo(
    metodo: schemas.MetodoSubidaNivelCreate,
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo método de subida de nivel.
    Verifica que no exista un nombre duplicado.
    """
    # Verificar si ya existe un nombre igual
    existing = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.nombre == metodo.nombre
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un método de subida de nivel con el nombre: '{metodo.nombre}'"
        )
    
    # Verificar que el número de orden no esté duplicado
    existing_orden = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.numeroOrden == metodo.numeroOrden
    ).first()
    
    if existing_orden:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un método con el número de orden {metodo.numeroOrden}"
        )
    
    db_metodo = models.MetodoSubidaNivel(**metodo.model_dump())
    db.add(db_metodo)
    db.commit()
    db.refresh(db_metodo)
    
    return db_metodo

# ============================================
# POST - Crear múltiples métodos
# ============================================
@router.post(
    "/batch",
    response_model=List[schemas.MetodoSubidaNivelResponse],
    status_code=status.HTTP_201_CREATED
)
def create_metodos_batch(
    metodos: List[schemas.MetodoSubidaNivelCreate],
    db: Session = Depends(get_db)
):
    """
    Crear múltiples métodos de subida de nivel.
    Omite los que ya existen.
    """
    creados = []
    errores = []
    
    for metodo_data in metodos:
        try:
            # Verificar si ya existe un nombre igual
            existing = db.query(models.MetodoSubidaNivel).filter(
                models.MetodoSubidaNivel.nombre == metodo_data.nombre
            ).first()
            
            if existing:
                errores.append(f"'{metodo_data.nombre}' ya existe")
                continue
            
            # Verificar número de orden duplicado
            existing_orden = db.query(models.MetodoSubidaNivel).filter(
                models.MetodoSubidaNivel.numeroOrden == metodo_data.numeroOrden
            ).first()
            
            if existing_orden:
                errores.append(f"Número de orden {metodo_data.numeroOrden} ya está en uso")
                continue
            
            db_metodo = models.MetodoSubidaNivel(**metodo_data.model_dump())
            db.add(db_metodo)
            creados.append(metodo_data.nombre)
            
        except Exception as e:
            errores.append(f"Error al crear '{metodo_data.nombre}': {str(e)}")
    
    if creados:
        db.commit()
        metodos_creados = db.query(models.MetodoSubidaNivel).filter(
            models.MetodoSubidaNivel.nombre.in_(creados)
        ).all()
        return metodos_creados
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se pudo crear ningún método: {', '.join(errores)}"
        )

# ============================================
# PUT - Actualizar un método existente
# ============================================
@router.put("/{metodo_id}", response_model=schemas.MetodoSubidaNivelResponse)
def update_metodo(
    metodo_id: int,
    metodo_update: schemas.MetodoSubidaNivelUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar un método de subida de nivel existente.
    """
    db_metodo = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.id == metodo_id
    ).first()
    
    if not db_metodo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Método de subida de nivel no encontrado"
        )
    
    # Verificar duplicados de nombre (excluyendo el mismo registro)
    if metodo_update.nombre:
        existing = db.query(models.MetodoSubidaNivel).filter(
            models.MetodoSubidaNivel.nombre == metodo_update.nombre,
            models.MetodoSubidaNivel.id != metodo_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un método de subida de nivel con el nombre: '{metodo_update.nombre}'"
            )
    
    # Verificar duplicado de número de orden (excluyendo el mismo registro)
    if metodo_update.numeroOrden:
        existing_orden = db.query(models.MetodoSubidaNivel).filter(
            models.MetodoSubidaNivel.numeroOrden == metodo_update.numeroOrden,
            models.MetodoSubidaNivel.id != metodo_id
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un método con el número de orden {metodo_update.numeroOrden}"
            )
    
    # Actualizar campos
    update_data = metodo_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_metodo, key, value)
    
    db.commit()
    db.refresh(db_metodo)
    
    return db_metodo

# ============================================
# DELETE - Eliminar un método
# ============================================
@router.delete("/{metodo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_metodo(
    metodo_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar un método de subida de nivel por su ID"""
    db_metodo = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.id == metodo_id
    ).first()
    
    if not db_metodo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Método de subida de nivel no encontrado"
        )
    
    # Verificar si hay sprits que usan este método
    sprits_usando = db.query(models.Sprit).filter(
        models.Sprit.metodoSubidaNivel == db_metodo.nombre
    ).first()
    
    if sprits_usando:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el método '{db_metodo.nombre}' porque hay sprits que lo usan"
        )
    
    db.delete(db_metodo)
    db.commit()
    
    return None