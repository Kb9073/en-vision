from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from db.session import get_db
from .service import get_cost_metrics

router = APIRouter()

@router.get("/cost-metrics")
def cost_metrics(
    range: str = Query("30d"),
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: Session = Depends(get_db),
):
    return get_cost_metrics(db, range, start_date, end_date)
