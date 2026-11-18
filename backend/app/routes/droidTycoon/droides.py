from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/droides",
    tag="droides",
    model=models.Droide,
    create_schema=schemas.DroideCreate,
    update_schema=schemas.DroideUpdate,
    response_schema=schemas.DroideResponse,
)