from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/nombres-droides",
    tag="nombres-droides",
    model=models.NombreDroide,
    create_schema=schemas.NombreDroideCreate,
    update_schema=schemas.NombreDroideUpdate,
    response_schema=schemas.NombreDroideResponse,
)
