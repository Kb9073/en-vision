from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()

@router.get("/forecast")
def get_forecast(
    days_ahead: int = 7,
    db: Session = Depends(get_db)
):

    rows = db.execute(text("""
        SELECT
            forecast_date,
            hour,
            predicted_kwh,
            confidence_interval_lower,
            confidence_interval_upper
        FROM energy_forecasts
        WHERE forecast_date >= CURRENT_DATE
        ORDER BY forecast_date, hour
        LIMIT :limit
    """), {"limit": days_ahead * 24}).fetchall()

    return [
        {
            "forecastDate": str(r.forecast_date),
            "hour": r.hour,
            "predicted": float(r.predicted_kwh or 0),
            "lower": float(r.confidence_interval_lower or 0),
            "upper": float(r.confidence_interval_upper or 0)
        }
        for r in rows
    ]
