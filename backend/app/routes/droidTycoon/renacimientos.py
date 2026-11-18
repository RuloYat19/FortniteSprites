from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/renacimientos",
    tag="renacimientos",
    model=models.Renacimiento,
    create_schema=schemas.RenacimientoCreate,
    update_schema=schemas.RenacimientoUpdate,
    response_schema=schemas.RenacimientoResponse,
)
