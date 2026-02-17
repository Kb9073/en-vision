from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date, datetime, timedelta
from typing import Optional

from db.session import get_db

router = APIRouter()

@router.get("/deviation-over-time")
def deviation_over_time(
    range: str = Query("7d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """Get deviation from baseline over time with real data"""
    
    max_date = db.execute(text("SELECT MAX(date) FROM energy_readings_daily")).scalar() or datetime.now().date()
    end_date = end_date or max_date
    
    if start_date:
        pass
    else:
        if range == "24h":
            start_date = end_date - timedelta(days=1)
        elif range == "7d":
            start_date = end_date - timedelta(days=7)
        elif range == "30d":
            start_date = end_date - timedelta(days=30)
        elif range == "90d":
            start_date = end_date - timedelta(days=90)
        else:
            start_date = end_date - timedelta(days=7)
    
    rows = db.execute(text("""
        SELECT 
            date,
            consumption_kwh - baseline AS deviation
        FROM energy_readings_daily
        WHERE date BETWEEN :start AND :end
        ORDER BY date
    """), {"start": start_date, "end": end_date}).fetchall()
    
    return [
        {
            "date": str(row.date),
            "deviation": float(row.deviation or 0)
        }
        for row in rows
    ] or []
