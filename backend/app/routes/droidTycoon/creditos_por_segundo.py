from app import models, schemas
from app.routes.droidTycoon._crud import create_crud_router

router = create_crud_router(
    prefix="/api/creditos-por-segundo",
    tag="creditos-por-segundo",
    model=models.CreditosPorSegundo,
    create_schema=schemas.CreditosPorSegundoCreate,
    update_schema=schemas.CreditosPorSegundoUpdate,
    response_schema=schemas.CreditosPorSegundoResponse,
)
