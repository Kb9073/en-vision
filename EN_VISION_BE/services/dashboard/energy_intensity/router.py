from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from db.session import get_db
from .service import get_energy_intensity

router = APIRouter()

@router.get("/energy-intensity")
def energy_intensity(
    range: str = Query("30d"),
    start_date: str = Query(None),
    end_date: str = Query(None),
    db: Session = Depends(get_db),
):
    return get_energy_intensity(db, range, start_date, end_date)
