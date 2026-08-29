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
    material: Optional[str] = Query(None, description="Filtrar por material"),
    # 🔵 NUEVOS FILTROS
    temporada: Optional[str] = Query(None, description="Filtrar por temporada (ej: C7T3)"),
    esta_en_el_juego: Optional[bool] = Query(None, description="Filtrar por disponibilidad en el juego"),
    metodo_subida_nivel: Optional[str] = Query(None, description="Filtrar por método de subida de nivel")
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
    
    # 🔵 NUEVOS FILTROS
    if temporada:
        query = query.filter(models.Sprit.temporada == temporada)
    
    if esta_en_el_juego is not None:
        query = query.filter(models.Sprit.estaEnElJuego == esta_en_el_juego)
    
    if metodo_subida_nivel:
        query = query.filter(models.Sprit.metodoSubidaNivel.ilike(f"%{metodo_subida_nivel}%"))
    
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
    db_sprit = models.Sprit(**sprit.model_dump())
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
    
    update_data = sprit.model_dump(exclude_unset=True)
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

@router.patch("/{sprit_id}/inventario", response_model=schemas.SpritResponse)
def toggle_inventario(sprit_id: int, db: Session = Depends(get_db)):
    """Alternar estado de inventario de un sprit"""
    db_sprit = db.query(models.Sprit).filter(models.Sprit.id == sprit_id).first()
    if not db_sprit:
        raise HTTPException(status_code=404, detail="Sprit no encontrado")
    
    db_sprit.estaEnInventario = not db_sprit.estaEnInventario
    db.commit()
    db.refresh(db_sprit)
    return db_sprit

@router.post("/actualizar-polvos", response_model=dict)
def actualizar_polvos_sprits(
    db: Session = Depends(get_db)
):
    try:
        # Obtener todas las configuraciones de polvo al extraer
        configs_extraer = db.query(models.CantidadPolvoEspirituExtraer).all()
        mapa_extraer = {}
        for config in configs_extraer:
            # 🔵 INCLUIR TEMPORADA en la clave
            clave = f"{config.temporada}-{config.rareza}-{config.nivelEspiritu}"
            mapa_extraer[clave] = config.cantidad
        
        # Obtener todas las configuraciones de polvo al invocar
        configs_invocar = db.query(models.CantidadPolvoEspirituInvocar).all()
        mapa_invocar = {}
        for config in configs_invocar:
            # 🔵 INCLUIR TEMPORADA en la clave
            clave = f"{config.temporada}-{config.material}-{config.rareza}"
            mapa_invocar[clave] = config.cantidad
        
        # Obtener todos los sprits
        sprits = db.query(models.Sprit).all()
        
        sprits_actualizados = 0
        sprits_con_error = 0
        errores = []
        
        for sprit in sprits:
            try:
                actualizado = False
                
                # Calcular polvo al extraer (incluyendo temporada)
                if sprit.rareza and sprit.nivelEspiritu and sprit.temporada:
                    # 🔵 CLAVE CON TEMPORADA
                    clave_extraer = f"{sprit.temporada}-{sprit.rareza}-{sprit.nivelEspiritu}"
                    if clave_extraer in mapa_extraer:
                        nuevo_polvo = mapa_extraer[clave_extraer]
                        if sprit.polvoAlExtraer != nuevo_polvo:
                            sprit.polvoAlExtraer = nuevo_polvo
                            actualizado = True
                
                # Calcular polvo al invocar (incluyendo temporada)
                if sprit.material and sprit.rareza and sprit.temporada:
                    # 🔵 CLAVE CON TEMPORADA
                    clave_invocar = f"{sprit.temporada}-{sprit.material}-{sprit.rareza}"
                    if clave_invocar in mapa_invocar:
                        nuevo_polvo = mapa_invocar[clave_invocar]
                        if sprit.polvoAlInvocar != nuevo_polvo:
                            sprit.polvoAlInvocar = nuevo_polvo
                            actualizado = True
                
                if actualizado:
                    sprits_actualizados += 1
                    
            except Exception as e:
                sprits_con_error += 1
                errores.append(f"Sprit ID {sprit.id} ({sprit.nombre}): {str(e)}")
        
        db.commit()
        
        return {
            "success": True,
            "mensaje": f"Actualización completada",
            "sprits_actualizados": sprits_actualizados,
            "total_sprits": len(sprits),
            "sprits_con_error": sprits_con_error,
            "errores": errores if errores else None
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar polvos: {str(e)}"
        )

# 🔵 NUEVO ENDPOINT - Obtener sprits por temporada
@router.get("/temporada/{temporada}", response_model=List[schemas.SpritResponse])
def get_sprits_by_temporada(
    temporada: str,
    db: Session = Depends(get_db)
):
    """
    Obtener todos los sprits de una temporada específica.
    """
    sprits = db.query(models.Sprit).filter(
        models.Sprit.temporada == temporada
    ).all()
    
    if not sprits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontraron sprits para la temporada {temporada}"
        )
    
    return sprits

# 🔵 NUEVO ENDPOINT - Obtener sprits disponibles en el juego
@router.get("/disponibles", response_model=List[schemas.SpritResponse])
def get_sprits_disponibles(
    db: Session = Depends(get_db)
):
    """
    Obtener todos los sprits que están disponibles en el juego.
    """
    sprits = db.query(models.Sprit).filter(
        models.Sprit.estaEnElJuego == True
    ).all()
    
    return sprits