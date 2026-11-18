from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/reglas-fusion",
    tag="reglas-fusion",
    model=models.ReglaFusion,
    create_schema=schemas.ReglaFusionCreate,
    update_schema=schemas.ReglaFusionUpdate,
    response_schema=schemas.ReglaFusionResponse,
)
