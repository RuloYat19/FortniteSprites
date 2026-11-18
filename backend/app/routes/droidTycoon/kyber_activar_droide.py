from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/kyber-activar-droide",
    tag="kyber-activar-droide",
    model=models.KyberActivarDroide,
    create_schema=schemas.KyberActivarDroideCreate,
    update_schema=schemas.KyberActivarDroideUpdate,
    response_schema=schemas.KyberActivarDroideResponse,
)
