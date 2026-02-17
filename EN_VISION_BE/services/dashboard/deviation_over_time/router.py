from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import date, timedelta

from db.session import get_db
from services.dashboard.deviation_over_time.service import get_deviation_over_time
from ..utils.date_range import resolve_date_range

router = APIRouter()

@router.get("/deviation-over-time")
def deviation_over_time(
    range: str = Query("7d"),
    db: Session = Depends(get_db),
):
    start_date, end_date = resolve_date_range(db, range)

    return get_deviation_over_time(
        db=db,
        start_date=start_date,
        end_date=end_date,
    )
