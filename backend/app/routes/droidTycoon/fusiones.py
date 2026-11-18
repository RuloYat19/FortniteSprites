from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/fusiones",
    tag="fusiones",
    model=models.Fusion,
    create_schema=schemas.FusionCreate,
    update_schema=schemas.FusionUpdate,
    response_schema=schemas.FusionResponse,
)
