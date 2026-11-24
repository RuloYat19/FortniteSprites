from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/materiales-droid-tycoon",
    tag="materiales-droid-tycoon",
    model=models.MaterialDroidTycoon,
    create_schema=schemas.MaterialDroidTycoonCreate,
    update_schema=schemas.MaterialDroidTycoonUpdate,
    response_schema=schemas.MaterialDroidTycoonResponse,
)
