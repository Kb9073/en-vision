from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from db.session import get_db
from datetime import date, timedelta
from typing import Optional
from .service import fetch_kpis
from sqlalchemy import text

router = APIRouter()


@router.get("/kpis")
def get_dashboard_kpis(
    range: Optional[str] = Query(default="7d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """
    Dashboard KPI endpoint
    Supports:
    - range: 24h | 7d | 30d | 90d
    - OR start_date & end_date
    """

    # -----------------------------
    # 1. Resolve end_date
    # -----------------------------
    max_date = db.execute(
        text("SELECT MAX(date) FROM daily_energy_summary")
    ).scalar()

    if not max_date:
        return fetch_kpis(db, None, None)

    end_date = end_date or max_date

    # -----------------------------
    # 2. Resolve start_date
    # -----------------------------
    if start_date:
        pass  # explicit range wins

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
            # fallback safety
            start_date = end_date - timedelta(days=7)

    # -----------------------------
    # 3. Fetch KPIs
    # -----------------------------
    return fetch_kpis(
        db=db,
        start_date=start_date,
        end_date=end_date,
    )
