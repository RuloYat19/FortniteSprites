from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/sprits", tags=["sprits"])

@router.get("/", response_model=List[schemas.SpritResponse])
def get_all_sprits(
    db: Session = Depends(get_db),
    solo_coleccionados: Optional[bool] = Query(None, description="Filtrar solo los coleccionados"),
    rareza: Optional[str] = Query(None, description="Filtrar por rareza"),
    material: Optional[str] = Query(None, description="Filtrar por material")
):
    """
    Obtener todos los sprits con filtros opcionales
    """
    query = db.query(models.Sprit)
    
    # Aplicar filtros si se proporcionan
    if solo_coleccionados is not None:
        query = query.filter(models.Sprit.estaColeccionado == solo_coleccionados)
    
    if rareza:
        query = query.filter(models.Sprit.rareza == rareza)
    
    if material:
        query = query.filter(models.Sprit.material == material)
    
    sprits = query.all()
    return sprits

@router.get("/{sprit_id}", response_model=schemas.SpritResponse)
def get_sprit(sprit_id: int, db: Session = Depends(get_db)):
    """Obtener un sprit por ID"""
    sprit = db.query(models.Sprit).filter(models.Sprit.id == sprit_id).first()
    if not sprit:
        raise HTTPException(status_code=404, detail="Sprit no encontrado")
    return sprit

@router.post("/", response_model=schemas.SpritResponse, status_code=status.HTTP_201_CREATED)
def create_sprit(sprit: schemas.SpritCreate, db: Session = Depends(get_db)):
    """Crear un nuevo sprit"""
    db_sprit = models.Sprit(**sprit.model_dump())  # .dict() en Pydantic v1, .model_dump() en v2
    db.add(db_sprit)
    db.commit()
    db.refresh(db_sprit)
    return db_sprit

@router.put("/{sprit_id}", response_model=schemas.SpritResponse)
def update_sprit(sprit_id: int, sprit: schemas.SpritUpdate, db: Session = Depends(get_db)):
    """Actualizar un sprit existente"""
    db_sprit = db.query(models.Sprit).filter(models.Sprit.id == sprit_id).first()
    if not db_sprit:
        raise HTTPException(status_code=404, detail="Sprit no encontrado")
    
    update_data = sprit.model_dump(exclude_unset=True)  # .dict() en v1
    for key, value in update_data.items():
        setattr(db_sprit, key, value)
    
    db.commit()
    db.refresh(db_sprit)
    return db_sprit

@router.patch("/{sprit_id}/coleccionar", response_model=schemas.SpritResponse)
def toggle_coleccionado(sprit_id: int, db: Session = Depends(get_db)):
    """Alternar estado de coleccionado de un sprit"""
    db_sprit = db.query(models.Sprit).filter(models.Sprit.id == sprit_id).first()
    if not db_sprit:
        raise HTTPException(status_code=404, detail="Sprit no encontrado")
    
    db_sprit.estaColeccionado = not db_sprit.estaColeccionado
    db.commit()
    db.refresh(db_sprit)
    return db_sprit

@router.patch("/{sprit_id}/dominar", response_model=schemas.SpritResponse)
def toggle_dominado(sprit_id: int, db: Session = Depends(get_db)):
    """Alternar estado de dominado de un sprit"""
    db_sprit = db.query(models.Sprit).filter(models.Sprit.id == sprit_id).first()
    if not db_sprit:
        raise HTTPException(status_code=404, detail="Sprit no encontrado")
    
    db_sprit.estaDominado = not db_sprit.estaDominado
    db.commit()
    db.refresh(db_sprit)
    return db_sprit

@router.delete("/{sprit_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sprit(sprit_id: int, db: Session = Depends(get_db)):
    """Eliminar un sprit (borrado físico)"""
    db_sprit = db.query(models.Sprit).filter(models.Sprit.id == sprit_id).first()
    if not db_sprit:
        raise HTTPException(status_code=404, detail="Sprit no encontrado")
    
    db.delete(db_sprit)
    db.commit()
    return None