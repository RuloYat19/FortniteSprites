from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/api/nombres", tags=["nombres"])

@router.get("/", response_model=List[schemas.NombreResponse])
def get_all_nombres(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000)
):
    """Obtener todos los nombres de sprits"""
    nombres = db.query(models.Nombre).offset(skip).limit(limit).all()
    return nombres

@router.get("/{nombre_id}", response_model=schemas.NombreResponse)
def get_nombre(nombre_id: int, db: Session = Depends(get_db)):
    """Obtener un nombre por ID"""
    nombre = db.query(models.Nombre).filter(models.Nombre.id == nombre_id).first()
    if not nombre:
        raise HTTPException(status_code=404, detail="Nombre no encontrado")
    return nombre

@router.post("/", response_model=schemas.NombreResponse, status_code=status.HTTP_201_CREATED)
def create_nombre(nombre: schemas.NombreCreate, db: Session = Depends(get_db)):
    """Crear un nuevo nombre de sprit"""
    db_nombre = models.Nombre(**nombre.model_dump())
    db.add(db_nombre)
    db.commit()
    db.refresh(db_nombre)
    return db_nombre

@router.put("/{nombre_id}", response_model=schemas.NombreResponse)
def update_nombre(nombre_id: int, nombre: schemas.NombreUpdate, db: Session = Depends(get_db)):
    """Actualizar un nombre existente"""
    db_nombre = db.query(models.Nombre).filter(models.Nombre.id == nombre_id).first()
    if not db_nombre:
        raise HTTPException(status_code=404, detail="Nombre no encontrado")
    
    update_data = nombre.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_nombre, key, value)
    
    db.commit()
    db.refresh(db_nombre)
    return db_nombre

@router.delete("/{nombre_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_nombre(nombre_id: int, db: Session = Depends(get_db)):
    """Eliminar un nombre de sprit"""
    db_nombre = db.query(models.Nombre).filter(models.Nombre.id == nombre_id).first()
    if not db_nombre:
        raise HTTPException(status_code=404, detail="Nombre no encontrado")
    
    db.delete(db_nombre)
    db.commit()
    return None