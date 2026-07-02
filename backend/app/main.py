from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routes import sprits, cantidad_polvo

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="API para gestionar los sprits de Fortnite Capítulo 7 - Temporada 3",
    version="1.0.0"
)

# Configurar CORS para permitir peticiones desde React
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(sprits.router)
app.include_router(cantidad_polvo.router)

@app.get("/")
def root():
    return {
        "message": f"Bienvenido a {settings.APP_NAME}",
        "environment": settings.APP_ENV,
        "status": "running",
        "endpoints": {
            "sprits": "/api/sprits",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    """Endpoint para verificar que el servidor está funcionando"""
    return {"status": "healthy"}