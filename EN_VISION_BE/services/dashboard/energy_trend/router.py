from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import date, datetime, timedelta
from typing import Optional
from db.session import get_db

router = APIRouter(prefix="/energy-trend", tags=["Energy Trend"])


@router.get("")
def get_energy_trend(
    range: str = Query(default="7d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    granularity: str = Query(default="daily"),
    db: Session = Depends(get_db),
):
    """
    Energy trend aligned with:
    energy_agg_daily
    energy_agg_hourly
    baseline_metrics
    """

    # ---------------------------------
    # Resolve Date Range
    # ---------------------------------
    max_date = db.execute(
        text("SELECT MAX(date) FROM energy_agg_daily")
    ).scalar() or datetime.utcnow().date()

    end_date = end_date or max_date

    if not start_date:
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

    # ---------------------------------
    # HOURLY
    # ---------------------------------
    if granularity == "hourly":
        rows = db.execute(
            text("""
            SELECT
                h.hour AS timestamp,
                h.consumption_kwh,
                h.cost,
                h.emissions_kg,
                h.peak_power_kw,
                b.baseline_kwh
            FROM energy_agg_hourly h
            LEFT JOIN baseline_metrics b
                ON h.meter_id = b.meter_id
            WHERE h.hour BETWEEN :start AND :end
            ORDER BY h.hour
            """),
            {"start": start_date, "end": end_date},
        ).fetchall()

        return {
            "success": True,
            "granularity": "hourly",
            "data": [
                {
                    "timestamp": str(row.timestamp),
                    "consumption": float(row.consumption_kwh or 0),
                    "baseline": float(row.baseline_kwh or 0),
                    "cost": float(row.cost or 0),
                    "emissions": float(row.emissions_kg or 0),
                    "peakPower": float(row.peak_power_kw or 0),
                }
                for row in rows
            ],
        }

    # ---------------------------------
    # DAILY
    # ---------------------------------
    rows = db.execute(text("""
    SELECT
        d.date AS timestamp,
        d.total_kwh,
        d.total_cost,
        d.total_emissions,
        d.peak_power,
        d.baseline_kwh
    FROM energy_agg_daily d
    WHERE d.date BETWEEN :start AND :end
    ORDER BY d.date
"""), {"start": start_date, "end": end_date}).fetchall()

    return [
    {
        "date": str(row.timestamp),
        "consumption": float(row.total_kwh or 0),
        "cost": float(row.total_cost or 0),
        "emissions": float(row.total_emissions or 0),
        "peakPower": float(row.peak_power or 0),
        "baseline": float(row.baseline_kwh or 0),
    }
    for row in rows
]
