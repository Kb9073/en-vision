from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date
from db.session import get_db
from services.dashboard.utils.date_range import resolve_date_range

router = APIRouter(prefix="/energy-trend", tags=["Energy Trend"])

@router.get("")
def get_energy_trend(
    range: str = "7d",
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
):
    start, end = resolve_date_range(
        db,
        range=range,
        start_date=start_date,
        end_date=end_date,
    )

    if not start or not end:
        return []

    rows = db.execute(
        text("""
            SELECT
                d.date,
                SUM(d.total_kwh) AS actual,
                SUM(b.baseline_kwh) AS baseline
            FROM daily_energy_summary d
            JOIN baseline_metrics b
              ON d.device_id = b.device_id
            WHERE d.date BETWEEN :start AND :end
            GROUP BY d.date
            ORDER BY d.date
        """),
        {"start": start, "end": end}
    ).mappings().all()

    return [
        {
            "date": r["date"].isoformat(),
            "actual": float(r["actual"]),
            "baseline": float(r["baseline"]),
        }
        for r in rows
    ]
