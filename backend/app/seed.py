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
        "nombreArchivoImagen": "./imagenesSprites/aguaNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/tierraNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/fuegoNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/patoNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/reyNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/dormilonNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/punkNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 7500
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/pezNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/goleadorNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/auraNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/jefeNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/parcaNormal.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 7500
    },

    # Sprits de Oro
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/aguaOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/tierraOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/fuegoOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/patoOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/reyOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/dormilonOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/punkOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/pezOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/goleadorOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/auraOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/jefeOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/parcaOro.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Sprits de Gomita
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/aguaGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/tierraGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/fuegoGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/patoGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/reyGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/dormilonGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/punkGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/pezGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/goleadorGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/auraGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/jefeGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/parcaGomita.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Sprits de Galaxia
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/aguaGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/tierraGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/fuegoGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/patoGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/reyGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/dormilonGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/punkGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/pezGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/goleadorGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/auraGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/jefeGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/parcaGalaxia.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Especiales
    {
        "nombre": "Cacahuate Tostado",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/cacahuateTostado.png",
        "yaFueDominado": False
        "estaDominado": False
        "estaEnInventario": False
        "estaDesbloqueado": False
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