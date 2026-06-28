from app.database import SessionLocal, engine
from app.models import Sprit
from app.database import Base

# Datos de ejemplo
sprits_data = [
    # Sprits Normales
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/aguaNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/tierraNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/fuegoNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/patoNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/reyNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/dormilonNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/punkNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroNormal.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 7500
    },

    # Sprits de Oro
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/aguaOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/tierraOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/fuegoOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/patoOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/reyOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/dormilonOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/punkOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroOro.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Sprits de Gomita
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/aguaGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/tierraGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/fuegoGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/patoGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/reyGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/dormilonGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/punkGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroGomita.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Sprits de Galaxia
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/aguaGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/tierraGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/fuegoGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/patoGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/reyGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/dormilonGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/punkGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroGalaxia.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Especiales
    {
        "nombre": "Cacahuate Tostado",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/cacahuateTostado.jpg",
        "estaColeccionado": False,
        "estaDominado": False,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 7500
    },
]

def seed_database():
    # Crear las tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Verificar si ya hay datos
        existing = db.query(Sprit).first()
        if existing:
            print("La base de datos ya tiene sprits.")
            
        # Insertar los datos
        for sprit_data in sprits_data:
            sprit = Sprit(**sprit_data)
            db.add(sprit)
        
        db.commit()
        print(f"{len(sprits_data)} sprits insertados con éxito :D")
        
    except Exception as e:
        db.rollback()
        print(f"Hubo problemas al insertar los sprits: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()