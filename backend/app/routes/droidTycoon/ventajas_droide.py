from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/ventajas-droide",
    tag="ventajas-droide",
    model=models.VentajaDroide,
    create_schema=schemas.VentajaDroideCreate,
    update_schema=schemas.VentajaDroideUpdate,
    response_schema=schemas.VentajaDroideResponse,
)
