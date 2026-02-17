from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import date, timedelta, datetime
from typing import Optional

router = APIRouter()

@router.get("/carbon-breakdown")
def get_carbon_breakdown(
    range: Optional[str] = Query(default="30d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """
    Carbon breakdown by source + scope
    Uses carbon_emissions_daily + carbon_sources
    """

    max_date = db.execute(
        text("SELECT MAX(date) FROM carbon_emissions_daily")
    ).scalar()

    if not max_date:
        return []

    end_date = end_date or max_date

    if not start_date:
        if range == "24h":
            start_date = end_date - timedelta(days=1)
        elif range == "7d":
            start_date = end_date - timedelta(days=7)
        else:
            start_date = end_date - timedelta(days=30)

    rows = db.execute(text("""
        SELECT
            s.source,
            s.scope,
            SUM(c.emissions_kg) AS total_emissions
        FROM carbon_emissions_daily c
        JOIN carbon_sources s ON c.source_id = s.id
        WHERE c.date BETWEEN :start AND :end
        GROUP BY s.source, s.scope
        ORDER BY total_emissions DESC
    """), {"start": start_date, "end": end_date}).fetchall()

    total_sum = sum(float(r.total_emissions or 0) for r in rows)

    return [
        {
            "source": r.source,
            "value": round(float(r.total_emissions or 0) / 1000, 2),
            "scope": r.scope,
            "percentage": round(
                (float(r.total_emissions or 0) / total_sum) * 100, 2
            ) if total_sum > 0 else 0
        }
        for r in rows
    ]
