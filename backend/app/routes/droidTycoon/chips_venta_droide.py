from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/chips-venta-droide",
    tag="chips-venta-droide",
    model=models.ChipsVentaDroide,
    create_schema=schemas.ChipsVentaDroideCreate,
    update_schema=schemas.ChipsVentaDroideUpdate,
    response_schema=schemas.ChipsVentaDroideResponse,
)
