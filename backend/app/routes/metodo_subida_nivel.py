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
    nombre: Optional[str] = None,
    temporada: Optional[str] = Query(None, description="Filtrar por temporada (ej: C7T3)")
):
    """
    Obtener todos los métodos de subida de nivel con filtros opcionales
    """
    query = db.query(models.MetodoSubidaNivel)
    
    if nombre:
        query = query.filter(models.MetodoSubidaNivel.nombre.ilike(f"%{nombre}%"))
    if temporada:
        query = query.filter(models.MetodoSubidaNivel.temporada == temporada)
    
    query = query.order_by(models.MetodoSubidaNivel.temporada, models.MetodoSubidaNivel.numeroOrden)
    
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
# GET - Obtener por temporada
# ============================================
@router.get("/temporada/{temporada}", response_model=List[schemas.MetodoSubidaNivelResponse])
def get_metodos_by_temporada(
    temporada: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todos los métodos de subida de nivel de una temporada específica.
    """
    metodos = db.query(models.MetodoSubidaNivel).filter(
        models.MetodoSubidaNivel.temporada == temporada
    ).order_by(models.MetodoSubidaNivel.numeroOrden).all()
    
    if not metodos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron métodos para la temporada {temporada}"
        )
    
    return metodos

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
    Verifica que no exista la combinación (numeroOrden, temporada) duplicada.
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
    
    # 🔵 Verificar combinación (numeroOrden, temporada)
    if metodo.temporada:
        existing_orden = db.query(models.MetodoSubidaNivel).filter(
            models.MetodoSubidaNivel.numeroOrden == metodo.numeroOrden,
            models.MetodoSubidaNivel.temporada == metodo.temporada
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un método con el número de orden {metodo.numeroOrden} para la temporada {metodo.temporada}"
            )
    else:
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
            
            # 🔵 Verificar combinación (numeroOrden, temporada)
            if metodo_data.temporada:
                existing_orden = db.query(models.MetodoSubidaNivel).filter(
                    models.MetodoSubidaNivel.numeroOrden == metodo_data.numeroOrden,
                    models.MetodoSubidaNivel.temporada == metodo_data.temporada
                ).first()
            else:
                existing_orden = db.query(models.MetodoSubidaNivel).filter(
                    models.MetodoSubidaNivel.numeroOrden == metodo_data.numeroOrden
                ).first()
            
            if existing_orden:
                errores.append(f"Número de orden {metodo_data.numeroOrden} ya está en uso para la temporada {metodo_data.temporada or 'sin temporada'}")
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
    
    # 🔵 Verificar duplicado de combinación (numeroOrden, temporada)
    if metodo_update.numeroOrden:
        temporada_actual = db_metodo.temporada
        nueva_temporada = metodo_update.temporada if metodo_update.temporada is not None else temporada_actual
        
        if nueva_temporada:
            existing_orden = db.query(models.MetodoSubidaNivel).filter(
                models.MetodoSubidaNivel.numeroOrden == metodo_update.numeroOrden,
                models.MetodoSubidaNivel.temporada == nueva_temporada,
                models.MetodoSubidaNivel.id != metodo_id
            ).first()
        else:
            existing_orden = db.query(models.MetodoSubidaNivel).filter(
                models.MetodoSubidaNivel.numeroOrden == metodo_update.numeroOrden,
                models.MetodoSubidaNivel.id != metodo_id
            ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un método con el número de orden {metodo_update.numeroOrden} para la temporada {nueva_temporada or 'sin temporada'}"
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