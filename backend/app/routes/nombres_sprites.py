from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/nombres-sprites", tags=["nombres-sprites"])

# ============================================
# GET - Obtener todos los nombres
# ============================================
@router.get("/", response_model=List[schemas.NombreSpritResponse])
def get_all_nombres(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    nombre: Optional[str] = None,
    temporada: Optional[str] = Query(None, description="Filtrar por temporada (ej: C7T3)")
):
    """
    Obtener todos los nombres de sprits con filtros opcionales
    """
    query = db.query(models.NombreSprit)
    
    if nombre:
        query = query.filter(models.NombreSprit.nombre.ilike(f"%{nombre}%"))
    if temporada:
        query = query.filter(models.NombreSprit.temporada == temporada)
    
    query = query.order_by(models.NombreSprit.temporada, models.NombreSprit.numeroOrden)
    
    return query.offset(skip).limit(limit).all()

# ============================================
# GET - Obtener un nombre por ID
# ============================================
@router.get("/{nombre_id}", response_model=schemas.NombreSpritResponse)
def get_nombre_by_id(
    nombre_id: int,
    db: Session = Depends(get_db)
):
    """Obtener un nombre de sprit por su ID"""
    nombre = db.query(models.NombreSprit).filter(
        models.NombreSprit.id == nombre_id
    ).first()
    
    if not nombre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nombre de sprit no encontrado"
        )
    
    return nombre

# ============================================
# GET - Verificar si un nombre existe
# ============================================
@router.get("/existe/{nombre}", response_model=bool)
def verificar_nombre_existe(
    nombre: str,
    db: Session = Depends(get_db)
):
    """Verificar si un nombre de sprit ya existe"""
    existe = db.query(models.NombreSprit).filter(
        models.NombreSprit.nombre == nombre
    ).first() is not None
    
    return existe

# ============================================
# GET - Obtener nombres que contienen texto
# ============================================
@router.get("/buscar/{texto}", response_model=List[schemas.NombreSpritResponse])
def buscar_nombres(
    texto: str,
    db: Session = Depends(get_db),
    limit: int = Query(50, ge=1, le=100)
):
    """Buscar nombres que contengan el texto especificado"""
    nombres = db.query(models.NombreSprit).filter(
        models.NombreSprit.nombre.ilike(f"%{texto}%")
    ).order_by(models.NombreSprit.nombre).limit(limit).all()
    
    return nombres

# ============================================
# GET - Obtener por temporada
# ============================================
@router.get("/temporada/{temporada}", response_model=List[schemas.NombreSpritResponse])
def get_nombres_by_temporada(
    temporada: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todos los nombres de sprits de una temporada específica.
    """
    nombres = db.query(models.NombreSprit).filter(
        models.NombreSprit.temporada == temporada
    ).order_by(models.NombreSprit.numeroOrden).all()
    
    if not nombres:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron nombres para la temporada {temporada}"
        )
    
    return nombres

# ============================================
# POST - Crear un nuevo nombre
# ============================================
@router.post(
    "/",
    response_model=schemas.NombreSpritResponse,
    status_code=status.HTTP_201_CREATED
)
def create_nombre(
    nombre: schemas.NombreSpritCreate,
    db: Session = Depends(get_db)
):
    """
    Crear un nuevo nombre de sprit.
    Verifica que no exista un nombre duplicado.
    Verifica que no exista la combinación (numeroOrden, temporada) duplicada.
    """
    # Verificar si ya existe un nombre igual
    existing = db.query(models.NombreSprit).filter(
        models.NombreSprit.nombre == nombre.nombre
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ya existe un nombre de sprit: '{nombre.nombre}'"
        )
    
    # 🔵 Verificar combinación (numeroOrden, temporada)
    if nombre.temporada:
        existing_orden = db.query(models.NombreSprit).filter(
            models.NombreSprit.numeroOrden == nombre.numeroOrden,
            models.NombreSprit.temporada == nombre.temporada
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un nombre con el número de orden {nombre.numeroOrden} para la temporada {nombre.temporada}"
            )
    else:
        existing_orden = db.query(models.NombreSprit).filter(
            models.NombreSprit.numeroOrden == nombre.numeroOrden
        ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un nombre con el número de orden {nombre.numeroOrden}"
            )
    
    db_nombre = models.NombreSprit(**nombre.model_dump())
    db.add(db_nombre)
    db.commit()
    db.refresh(db_nombre)

    return db_nombre

# ============================================
# POST - Crear múltiples nombres
# ============================================
@router.post(
    "/batch",
    response_model=List[schemas.NombreSpritResponse],
    status_code=status.HTTP_201_CREATED
)
def create_nombres_batch(
    nombres: List[schemas.NombreSpritCreate],
    db: Session = Depends(get_db)
):
    """
    Crear múltiples nombres de sprits.
    Omite los que ya existen.
    """
    creados = []
    errores = []
    
    for nombre_data in nombres:
        try:
            # Verificar si ya existe un nombre igual
            existing = db.query(models.NombreSprit).filter(
                models.NombreSprit.nombre == nombre_data.nombre
            ).first()
            
            if existing:
                errores.append(f"'{nombre_data.nombre}' ya existe")
                continue
            
            # 🔵 Verificar combinación (numeroOrden, temporada)
            if nombre_data.temporada:
                existing_orden = db.query(models.NombreSprit).filter(
                    models.NombreSprit.numeroOrden == nombre_data.numeroOrden,
                    models.NombreSprit.temporada == nombre_data.temporada
                ).first()
            else:
                existing_orden = db.query(models.NombreSprit).filter(
                    models.NombreSprit.numeroOrden == nombre_data.numeroOrden
                ).first()
            
            if existing_orden:
                errores.append(f"Número de orden {nombre_data.numeroOrden} ya está en uso para la temporada {nombre_data.temporada or 'sin temporada'}")
                continue
            
            db_nombre = models.NombreSprit(**nombre_data.model_dump())
            db.add(db_nombre)
            creados.append(nombre_data.nombre)
            
        except Exception as e:
            errores.append(f"Error al crear '{nombre_data.nombre}': {str(e)}")
    
    if creados:
        db.commit()
        nombres_creados = db.query(models.NombreSprit).filter(
            models.NombreSprit.nombre.in_(creados)
        ).all()
        return nombres_creados
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se pudo crear ningún nombre: {', '.join(errores)}"
        )

# ============================================
# PUT - Actualizar un nombre existente
# ============================================
@router.put("/{nombre_id}", response_model=schemas.NombreSpritResponse)
def update_nombre(
    nombre_id: int,
    nombre_update: schemas.NombreSpritUpdate,
    db: Session = Depends(get_db)
):
    """
    Actualizar un nombre de sprit existente.
    """
    db_nombre = db.query(models.NombreSprit).filter(
        models.NombreSprit.id == nombre_id
    ).first()
    
    if not db_nombre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nombre de sprit no encontrado"
        )
    
    # Verificar duplicados de nombre (excluyendo el mismo registro)
    if nombre_update.nombre:
        existing = db.query(models.NombreSprit).filter(
            models.NombreSprit.nombre == nombre_update.nombre,
            models.NombreSprit.id != nombre_id
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un nombre de sprit: '{nombre_update.nombre}'"
            )
    
    # 🔵 Verificar duplicado de combinación (numeroOrden, temporada)
    if nombre_update.numeroOrden:
        temporada_actual = db_nombre.temporada
        nueva_temporada = nombre_update.temporada if nombre_update.temporada is not None else temporada_actual
        
        if nueva_temporada:
            existing_orden = db.query(models.NombreSprit).filter(
                models.NombreSprit.numeroOrden == nombre_update.numeroOrden,
                models.NombreSprit.temporada == nueva_temporada,
                models.NombreSprit.id != nombre_id
            ).first()
        else:
            existing_orden = db.query(models.NombreSprit).filter(
                models.NombreSprit.numeroOrden == nombre_update.numeroOrden,
                models.NombreSprit.id != nombre_id
            ).first()
        
        if existing_orden:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ya existe un nombre con el número de orden {nombre_update.numeroOrden} para la temporada {nueva_temporada or 'sin temporada'}"
            )
    
    # Actualizar campos
    update_data = nombre_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_nombre, key, value)
    
    db.commit()
    db.refresh(db_nombre)
    
    return db_nombre

# ============================================
# DELETE - Eliminar un nombre
# ============================================
@router.delete("/{nombre_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nombre(
    nombre_id: int,
    db: Session = Depends(get_db)
):
    """Eliminar un nombre de sprit por su ID"""
    db_nombre = db.query(models.NombreSprit).filter(
        models.NombreSprit.id == nombre_id
    ).first()
    
    if not db_nombre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Nombre de sprit no encontrado"
        )
    
    # Verificar si hay sprits que usan este nombre
    sprits_usando = db.query(models.Sprit).filter(
        models.Sprit.nombre == db_nombre.nombre
    ).first()
    
    if sprits_usando:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"No se puede eliminar el nombre '{db_nombre.nombre}' porque hay sprits que lo usan"
        )
    
    db.delete(db_nombre)
    db.commit()
    
    return None