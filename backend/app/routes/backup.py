from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse
from datetime import datetime
import os
import tempfile
from app.database import get_db
from app import models

router = APIRouter(prefix="/api/backup", tags=["backup"])

# ============================================
# FUNCIÓN AUXILIAR - Convertir valor a SQL
# ============================================
def valor_a_sql(valor):
    """Convierte un valor de Python a su representación SQL para INSERT"""
    if valor is None:
        return "NULL"
    elif isinstance(valor, bool):
        return "1" if valor else "0"
    elif isinstance(valor, str):
        # Escapar comillas simples y caracteres especiales
        valor_escapado = valor.replace("'", "''")
        return f"'{valor_escapado}'"
    elif isinstance(valor, datetime):
        return f"'{valor.strftime('%Y-%m-%d %H:%M:%S')}'"
    else:
        return str(valor)


# ============================================
# FUNCIÓN AUXILIAR - Generar INSERT para una tabla
# ============================================
def generar_inserts(model, db: Session, tabla_nombre: str):
    """Genera sentencias INSERT para todos los registros de una tabla"""
    registros = db.query(model).all()
    
    if not registros:
        return f"-- No hay datos en la tabla {tabla_nombre}\n"
    
    # Obtener nombres de columnas (excluyendo 'id' si queremos que sea autoincrement)
    columnas = [c.name for c in model.__table__.columns if c.name != 'id']
    columnas_str = ", ".join(columnas)
    
    inserts = []
    inserts.append(f"-- ============================================")
    inserts.append(f"-- TABLA: {tabla_nombre}")
    inserts.append(f"-- ============================================")
    
    for registro in registros:
        valores = []
        for col in columnas:
            valor = getattr(registro, col)
            valores.append(valor_a_sql(valor))
        
        valores_str = ", ".join(valores)
        inserts.append(f"INSERT INTO {tabla_nombre} ({columnas_str}) VALUES ({valores_str});")
    
    inserts.append("")  # Línea en blanco al final
    return "\n".join(inserts)


# ============================================
# GET - Generar backup completo
# ============================================
@router.get("/generar")
def generar_backup(
    db: Session = Depends(get_db),
    incluir_id: bool = Query(False, description="Incluir la columna ID en los INSERTs")
):
    """
    Genera un archivo SQL con INSERTs de todas las tablas de la base de datos.
    """
    try:
        # Definir las tablas a respaldar en el orden correcto (respetando dependencias)
        tablas = [
            {"modelo": models.Material, "nombre": "material"},
            {"modelo": models.NombreSprit, "nombre": "nombresSprites"},
            {"modelo": models.OrdenDefault, "nombre": "ordenDefault"},
            {"modelo": models.OrdenRareza, "nombre": "ordenRareza"},
            {"modelo": models.CantidadPolvoEspirituExtraer, "nombre": "CantidadPolvoEspirituExtraer"},
            {"modelo": models.Sprit, "nombre": "sprits"},
        ]
        
        # Generar el contenido del backup
        lineas = []
        lineas.append("-- ============================================")
        lineas.append("-- BACKUP DE BASE DE DATOS")
        lineas.append(f"-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        lineas.append("-- ============================================")
        lineas.append("")
        lineas.append("USE FORTNITEDB;")
        lineas.append("GO")
        lineas.append("")
        
        # Generar INSERTs para cada tabla
        for tabla in tablas:
            try:
                # Si se solicita incluir ID, modificar la función de inserción
                if incluir_id:
                    # Si incluye ID, necesitamos una versión diferente
                    registros = db.query(tabla["modelo"]).all()
                    if registros:
                        columnas = [c.name for c in tabla["modelo"].__table__.columns]
                        columnas_str = ", ".join(columnas)
                        
                        lineas.append(f"-- ============================================")
                        lineas.append(f"-- TABLA: {tabla['nombre']}")
                        lineas.append(f"-- ============================================")
                        
                        for registro in registros:
                            valores = []
                            for col in columnas:
                                valor = getattr(registro, col)
                                valores.append(valor_a_sql(valor))
                            
                            valores_str = ", ".join(valores)
                            lineas.append(f"INSERT INTO {tabla['nombre']} ({columnas_str}) VALUES ({valores_str});")
                        
                        lineas.append("")
                    else:
                        lineas.append(f"-- No hay datos en la tabla {tabla['nombre']}\n")
                else:
                    # Usar la función auxiliar para excluir ID
                    inserts = generar_inserts(tabla["modelo"], db, tabla["nombre"])
                    lineas.append(inserts)
                    
            except Exception as e:
                lineas.append(f"-- ❌ Error al generar backup de {tabla['nombre']}: {str(e)}\n")
        
        # Crear archivo temporal
        fecha = datetime.now().strftime("%Y%m%d_%H%M%S")
        nombre_archivo = f"002_backup_{fecha}.sql"
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, encoding='utf-8') as tmp:
            tmp.write("\n".join(lineas))
            tmp_path = tmp.name
        
        return FileResponse(
            path=tmp_path,
            media_type='application/sql',
            filename=nombre_archivo,
            background=None
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al generar backup: {str(e)}"
        )


# ============================================
# GET - Backup solo de una tabla específica
# ============================================
@router.get("/tabla/{tabla_nombre}")
def generar_backup_tabla(
    tabla_nombre: str,
    db: Session = Depends(get_db),
    incluir_id: bool = Query(False, description="Incluir la columna ID en los INSERTs")
):
    """
    Genera un archivo SQL con INSERTs de una tabla específica.
    Tablas disponibles: sprits, CantidadPolvoEspirituExtraer, material, nombresSprites, ordenDefault, ordenRareza
    """
    # Mapeo de nombres de tabla a modelos
    tabla_map = {
        "sprits": models.Sprit,
        "CantidadPolvoEspirituExtraer": models.CantidadPolvoEspirituExtraer,
        "material": models.Material,
        "nombresSprites": models.NombreSprit,
        "ordenDefault": models.OrdenDefault,
        "ordenRareza": models.OrdenRareza
    }
    
    if tabla_nombre not in tabla_map:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tabla '{tabla_nombre}' no válida. Opciones: {', '.join(tabla_map.keys())}"
        )
    
    try:
        modelo = tabla_map[tabla_nombre]
        
        # Generar el contenido del backup
        lineas = []
        lineas.append("-- ============================================")
        lineas.append(f"-- BACKUP DE TABLA: {tabla_nombre}")
        lineas.append(f"-- Fecha: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        lineas.append("-- ============================================")
        lineas.append("")
        lineas.append("USE FORTNITEDB;")
        lineas.append("GO")
        lineas.append("")
        
        if incluir_id:
            registros = db.query(modelo).all()
            if registros:
                columnas = [c.name for c in modelo.__table__.columns]
                columnas_str = ", ".join(columnas)
                
                lineas.append(f"-- ============================================")
                lineas.append(f"-- TABLA: {tabla_nombre}")
                lineas.append(f"-- ============================================")
                
                for registro in registros:
                    valores = []
                    for col in columnas:
                        valor = getattr(registro, col)
                        valores.append(valor_a_sql(valor))
                    
                    valores_str = ", ".join(valores)
                    lineas.append(f"INSERT INTO {tabla_nombre} ({columnas_str}) VALUES ({valores_str});")
                
                lineas.append("")
            else:
                lineas.append(f"-- No hay datos en la tabla {tabla_nombre}\n")
        else:
            inserts = generar_inserts(modelo, db, tabla_nombre)
            lineas.append(inserts)
        
        # Crear archivo temporal
        fecha = datetime.now().strftime("%Y%m%d_%H%M%S")
        nombre_archivo = f"002_backup_{tabla_nombre}_{fecha}.sql"
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.sql', delete=False, encoding='utf-8') as tmp:
            tmp.write("\n".join(lineas))
            tmp_path = tmp.name
        
        return FileResponse(
            path=tmp_path,
            media_type='application/sql',
            filename=nombre_archivo,
            background=None
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al generar backup de {tabla_nombre}: {str(e)}"
        )


# ============================================
# GET - Obtener información de las tablas
# ============================================
@router.get("/info")
def get_backup_info(db: Session = Depends(get_db)):
    """
    Obtiene información sobre las tablas disponibles para backup.
    """
    tablas = [
        {"nombre": "sprits", "descripcion": "Sprits de Fortnite", "registros": db.query(models.Sprit).count()},
        {"nombre": "CantidadPolvoEspirituExtraer", "descripcion": "Cantidades de Polvo de Espíritu", "registros": db.query(models.CantidadPolvoEspirituExtraer).count()},
        {"nombre": "material", "descripcion": "Materiales", "registros": db.query(models.Material).count()},
        {"nombre": "nombresSprites", "descripcion": "Nombres de Sprites", "registros": db.query(models.NombreSprit).count()},
        {"nombre": "ordenDefault", "descripcion": "Orden Default", "registros": db.query(models.OrdenDefault).count()},
        {"nombre": "ordenRareza", "descripcion": "Orden por Rareza", "registros": db.query(models.OrdenRareza).count()},
    ]
    
    return {
        "total_tablas": len(tablas),
        "tablas": tablas,
        "fecha": datetime.now().isoformat()
    }