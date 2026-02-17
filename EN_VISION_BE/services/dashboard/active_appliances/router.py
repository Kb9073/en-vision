from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from db.session import get_db
from .service import get_active_appliances

router = APIRouter()

@router.get("/active-appliances")
def active_appliances(
    range: str = Query("30d"),
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: Session = Depends(get_db),
):
    return get_active_appliances(db, range, start_date, end_date)
