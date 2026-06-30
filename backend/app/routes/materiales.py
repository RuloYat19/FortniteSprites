from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/materiales", tags=["materiales"])

@router.get("/", response_model=List[schemas.MaterialResponse])
def get_all_materiales(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    """Obtener todos los materiales"""
    materiales = db.query(models.Material).offset(skip).limit(limit).all()
    return materiales

@router.get("/{material_id}", response_model=schemas.MaterialResponse)
def get_material(material_id: int, db: Session = Depends(get_db)):
    """Obtener un material por ID"""
    material = db.query(models.Material).filter(models.Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    return material

@router.post("/", response_model=schemas.MaterialResponse, status_code=status.HTTP_201_CREATED)
def create_material(material: schemas.MaterialCreate, db: Session = Depends(get_db)):
    """Crear un nuevo material"""
    db_material = models.Material(**material.model_dump())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@router.put("/{material_id}", response_model=schemas.MaterialResponse)
def update_material(material_id: int, material: schemas.MaterialUpdate, db: Session = Depends(get_db)):
    """Actualizar un material existente"""
    db_material = db.query(models.Material).filter(models.Material.id == material_id).first()
    if not db_material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    
    update_data = material.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_material, key, value)
    
    db.commit()
    db.refresh(db_material)
    return db_material

@router.delete("/{material_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_material(material_id: int, db: Session = Depends(get_db)):
    """Eliminar un material"""
    db_material = db.query(models.Material).filter(models.Material.id == material_id).first()
    if not db_material:
        raise HTTPException(status_code=404, detail="Material no encontrado")
    
    db.delete(db_material)
    db.commit()
    return None