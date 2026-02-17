from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import date, datetime, timedelta
from typing import Optional

router = APIRouter()

@router.get("/deviations")
def get_deviations(
    range: str = Query(default="7d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    """Get zone deviations from baseline with real data"""
    
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
        else:
            start_date = end_date - timedelta(days=7)
    
    query = text("""
        SELECT
            zone,
            SUM(consumption_kwh) AS actual,
            SUM(baseline) AS baseline
        FROM energy_readings_daily
        WHERE date BETWEEN :start AND :end AND zone IS NOT NULL
        GROUP BY zone
        ORDER BY actual DESC
    """)

    rows = db.execute(query, {"start": start_date, "end": end_date}).fetchall()

    if not rows:
        return []

    return [
        {
            "zone": row.zone or "Unknown",
            "actual": float(row.actual or 0),
            "baseline": float(row.baseline or 0),
            "deviation": float((row.actual or 0) - (row.baseline or 0)),
            "deviationPercent": round(((float(row.actual or 0) - float(row.baseline or 0)) / float(row.baseline or 1) * 100), 1) if row.baseline else 0
        }
        for row in rows
    ]
