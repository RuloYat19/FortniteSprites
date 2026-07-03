from app.database import SessionLocal, engine, Base
from app.models import Sprit, CantidadPolvoEspiritu

# Datos de Sprits
sprits_data = [
    # Sprits Normales
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/aguaNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/tierraNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/fuegoNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500, # Confirmado
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/patoNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/reyNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550, # Confirmado
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/dormilonNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600, #Confirmado
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/punkNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600, # Confirmado
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 7500
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/pezNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 100
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/goleadorNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/auraNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 3000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/jefeNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 5000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/parcaNormal.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 7500
    },

    # Sprits de Oro
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/aguaOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/tierraOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/fuegoOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/patoOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/reyOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/dormilonOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/punkOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/pezOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/goleadorOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/auraOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/jefeOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Oro",
        "nombreArchivoImagen": "./imagenesSprites/parcaOro.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Sprits de Gomita
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/aguaGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/tierraGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/fuegoGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/patoGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/reyGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/dormilonGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/punkGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/pezGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/goleadorGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/auraGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/jefeGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Gomita",
        "nombreArchivoImagen": "./imagenesSprites/parcaGomita.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Sprits de Galaxia
    {
        "nombre": "Espíritu de Agua",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/aguaGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Tierra",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/tierraGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu de Fuego",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/fuegoGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Pato",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/patoGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Fantasmal",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/fantasmalGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Demoníaco",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/demoniacoGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Rey",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/reyGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Dormilón",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/dormilonGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Punk",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/punkGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu del Punto Cero",
        "rareza": "Mítico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/puntoCeroGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },
    {
        "nombre": "Espíritu de Pez",
        "rareza": "Raro",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/pezGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 500,
        "polvoAlInvocar": 4000
    },
    {
        "nombre": "Espíritu Goleador",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/goleadorGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu de Aura",
        "rareza": "Épico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/auraGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 550,
        "polvoAlInvocar": 6000
    },
    {
        "nombre": "Espíritu Jefe",
        "rareza": "Legendario",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/jefeGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 600,
        "polvoAlInvocar": 10000
    },
    {
        "nombre": "Espíritu Parca",
        "rareza": "Mítico",
        "material": "Galaxia",
        "nombreArchivoImagen": "./imagenesSprites/parcaGalaxia.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 15000
    },

    # Especiales
    {
        "nombre": "Cacahuate Tostado",
        "rareza": "Mítico",
        "material": "Normal",
        "nombreArchivoImagen": "./imagenesSprites/cacahuateTostado.png",
        "yaFueDominado": False,
        "estaDominado": False,
        "estaEnInventario": False,
        "estaDesbloqueado": False,
        "nivelEspiritu": 1,
        "polvoAlExtraer": 650,
        "polvoAlInvocar": 7500
    },
]

# Datos de CantidadPolvoEspiritu
cantidad_polvo_data = [
    # Raro
    {
        "numeroOrden": 1,
        "rareza": "Raro", 
        "nivelEspiritu": 1, 
        "cantidad": 500
    },
    {
        "numeroOrden": 2,
        "rareza": "Raro", 
        "nivelEspiritu": 2, 
        "cantidad": 625
    },
    {
        "numeroOrden": 3,
        "rareza": "Raro", 
        "nivelEspiritu": 3, 
        "cantidad": 750
    },
    {
        "numeroOrden": 4,
        "rareza": "Raro", 
        "nivelEspiritu": 4, 
        "cantidad": 875
    },
    {
        "numeroOrden": 5,
        "rareza": "Raro", 
        "nivelEspiritu": 5, 
        "cantidad": 1000
    },
    # Épico
    {
        "numeroOrden": 6,
        "rareza": "Épico", 
        "nivelEspiritu": 1, 
        "cantidad": 550
    },
    {
        "numeroOrden": 7,
        "rareza": "Épico", 
        "nivelEspiritu": 2, 
        "cantidad": 700
    },
    {
        "numeroOrden": 8,
        "rareza": "Épico", 
        "nivelEspiritu": 3, 
        "cantidad": 825
    },
    {
        "numeroOrden": 9,
        "rareza": "Épico", 
        "nivelEspiritu": 4, 
        "cantidad": 950
    },
    {
        "numeroOrden": 10,
        "rareza": "Épico", 
        "nivelEspiritu": 5, 
        "cantidad": 1100
    },
    # Legendario
    {
        "numeroOrden": 11,
        "rareza": "Legendario", 
        "nivelEspiritu": 1, 
        "cantidad": 600
    },
    {
        "numeroOrden": 12,
        "rareza": "Legendario", 
        "nivelEspiritu": 2, 
        "cantidad": 750
    },
    {
        "numeroOrden": 13,
        "rareza": "Legendario", 
        "nivelEspiritu": 3, 
        "cantidad": 900
    },
    {
        "numeroOrden": 14,
        "rareza": "Legendario", 
        "nivelEspiritu": 4, 
        "cantidad": 1050
    },
    {
        "numeroOrden": 15,
        "rareza": "Legendario", 
        "nivelEspiritu": 5, 
        "cantidad": 1200
    },
    # Mítico
    {
        "numeroOrden": 16,
        "rareza": "Mítico", 
        "nivelEspiritu": 1, 
        "cantidad": 650
    },
    {
        "numeroOrden": 17,
        "rareza": "Mítico", 
        "nivelEspiritu": 2, 
        "cantidad": 800
    },
    {
        "numeroOrden": 18,
        "rareza": "Mítico", 
        "nivelEspiritu": 3, 
        "cantidad": 975
    },
    {
        "numeroOrden": 19,
        "rareza": "Mítico", 
        "nivelEspiritu": 4, 
        "cantidad": 1150
    },
    {
        "numeroOrden": 20,
        "rareza": "Mítico", 
        "nivelEspiritu": 5, 
        "cantidad": 1300
    },
]

def seed_database():
    # Crear las tablas si no existen
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Verificar si ya hay datos de Spites en la Base de Datos
        existenSpritesEnDB = db.query(Sprit).first()
        if existenSpritesEnDB:
            print("La base de datos ya tiene sprits.")
        else: 
            # Insertar Sprits
            for sprit_data in sprits_data:
                sprit = Sprit(**sprit_data)
                db.add(sprit)
            print(f"{len(sprits_data)} sprites insertados con éxito :D")

        # Verificar si ya hay datos de CantidadPolvoEspiritu en la Base de Datos
        existenCantidadPolvoEspirituEnDB = db.query(CantidadPolvoEspiritu).first()
        if existenCantidadPolvoEspirituEnDB:
            print("La base de datos ya tiene Cantidad de Polvo de Espíritu.")
        else: 
            # Insertar Cantidades de Polvo
            for cantidad_data in cantidad_polvo_data:
                cantidad = CantidadPolvoEspiritu(**cantidad_data)
                db.add(cantidad)
            print(f"{len(cantidad_polvo_data)} cantidades de Polvo de Espíritu insertadas con éxito :D")
        
        db.commit()
        print("Seed completado exitosamente")
        
    except Exception as e:
        db.rollback()
        print(f"Hubo problemas al insertar los datos: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()