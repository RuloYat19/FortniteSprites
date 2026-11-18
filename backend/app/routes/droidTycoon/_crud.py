from typing import Type

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db


def create_crud_router(
    *,
    prefix: str,
    tag: str,
    model: Type,
    create_schema: Type[BaseModel],
    update_schema: Type[BaseModel],
    response_schema: Type[BaseModel],
) -> APIRouter:
    router = APIRouter(prefix=prefix, tags=[tag])

    @router.get("/", response_model=list[response_schema])
    def get_all(
        db: Session = Depends(get_db),
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=1, le=1000),
    ):
        return db.query(model).order_by(model.id).offset(skip).limit(limit).all()

    @router.get("/{item_id}", response_model=response_schema)
    def get_by_id(item_id: int, db: Session = Depends(get_db)):
        item = db.query(model).filter(model.id == item_id).first()
        if item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{tag} no encontrado",
            )
        return item

    @router.post(
        "/",
        response_model=response_schema,
        status_code=status.HTTP_201_CREATED,
    )
    def create(item: create_schema, db: Session = Depends(get_db)):
        db_item = model(**item.model_dump())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        return db_item

    @router.put("/{item_id}", response_model=response_schema)
    def update(
        item_id: int,
        item_update: update_schema,
        db: Session = Depends(get_db),
    ):
        db_item = db.query(model).filter(model.id == item_id).first()
        if db_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{tag} no encontrado",
            )

        for field, value in item_update.model_dump(exclude_unset=True).items():
            setattr(db_item, field, value)

        db.commit()
        db.refresh(db_item)
        return db_item

    @router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete(item_id: int, db: Session = Depends(get_db)):
        db_item = db.query(model).filter(model.id == item_id).first()
        if db_item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"{tag} no encontrado",
            )
        db.delete(db_item)
        db.commit()

    return router
