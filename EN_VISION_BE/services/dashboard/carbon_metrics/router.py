from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date, timedelta, datetime
from typing import Optional
from db.session import get_db

router = APIRouter(prefix="/dashboard", tags=["Carbon"])


@router.get("/carbon-metrics")
def get_carbon_metrics(
    range: Optional[str] = Query(default="30d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """
    Total carbon emissions + delta
    Uses carbon_emissions_daily
    """

    max_date = db.execute(
        text("SELECT MAX(date) FROM carbon_emissions_daily")
    ).scalar()

    if not max_date:
        return {"totalEmissions": 0, "delta": 0, "unit": "tCO₂e"}

    end_date = end_date or max_date

    if not start_date:
        if range == "24h":
            start_date = end_date - timedelta(days=1)
        elif range == "7d":
            start_date = end_date - timedelta(days=7)
        else:
            start_date = end_date - timedelta(days=30)

    # ---- Current Period ----
    current = db.execute(text("""
        SELECT SUM(emissions_kg) 
        FROM carbon_emissions_daily
        WHERE date BETWEEN :start AND :end
    """), {"start": start_date, "end": end_date}).scalar() or 0

    # ---- Previous Period ----
    prev_start = start_date - (end_date - start_date)
    prev_end = start_date - timedelta(days=1)

    previous = db.execute(text("""
        SELECT SUM(emissions_kg)
        FROM carbon_emissions_daily
        WHERE date BETWEEN :start AND :end
    """), {"start": prev_start, "end": prev_end}).scalar() or 0

    current_tonnes = float(current) / 1000
    previous_tonnes = float(previous) / 1000

    delta = (
        ((current_tonnes - previous_tonnes) / previous_tonnes) * 100
        if previous_tonnes > 0 else 0
    )

    return {
        "totalEmissions": round(current_tonnes, 2),
        "delta": round(delta, 2),
        "unit": "tCO₂e",
        "period": f"{start_date} to {end_date}"
    }
