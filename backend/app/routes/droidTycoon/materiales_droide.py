from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/materiales-droide",
    tag="materiales-droide",
    model=models.MaterialDroide,
    create_schema=schemas.MaterialDroideCreate,
    update_schema=schemas.MaterialDroideUpdate,
    response_schema=schemas.MaterialDroideResponse,
    list_filter=("droide_id", models.MaterialDroide.droide_id),
)
