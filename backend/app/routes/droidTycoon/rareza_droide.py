from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/rareza-droides",
    tag="rareza-droides",
    model=models.RarezaDroide,
    create_schema=schemas.RarezaDroideCreate,
    update_schema=schemas.RarezaDroideUpdate,
    response_schema=schemas.RarezaDroideResponse,
)
