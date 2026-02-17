from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import date, timedelta, datetime
from typing import Optional

router = APIRouter()


@router.get("/kpis")
def get_dashboard_kpis(
    range: Optional[str] = Query(default="7d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    """
    Production KPI endpoint aligned with:
    energy_agg_daily
    carbon_emissions_daily
    """

    # ----------------------------
    # Resolve Date Range
    # ----------------------------
    max_date = db.execute(
        text("SELECT MAX(date) FROM energy_agg_daily")
    ).scalar()

    if not max_date:
        max_date = datetime.utcnow().date()

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

    # ----------------------------
    # Current Period
    # ----------------------------
    current = db.execute(
        text("""
        SELECT
            SUM(total_kwh) AS total_energy,
            SUM(total_cost) AS total_cost,
            SUM(total_emissions) AS total_emissions,
            AVG(avg_power) AS avg_load,
            MAX(peak_power) AS peak_load
        FROM energy_agg_daily
        WHERE date BETWEEN :start_date AND :end_date
        """),
        {"start_date": start_date, "end_date": end_date},
    ).fetchone()

    # ----------------------------
    # Previous Period (for delta)
    # ----------------------------
    period_days = (end_date - start_date).days
    prev_start = start_date - timedelta(days=period_days)
    prev_end = start_date - timedelta(days=1)

    previous = db.execute(
        text("""
        SELECT
            SUM(total_kwh) AS total_energy,
            SUM(total_emissions) AS total_emissions
        FROM energy_agg_daily
        WHERE date BETWEEN :start_date AND :end_date
        """),
        {"start_date": prev_start, "end_date": prev_end},
    ).fetchone()

    current_energy = float(current.total_energy or 0)
    prev_energy = float(previous.total_energy or 0) if previous else 0

    current_emissions = float(current.total_emissions or 0)
    prev_emissions = float(previous.total_emissions or 0) if previous else 0

    energy_delta = (
        ((current_energy - prev_energy) / prev_energy) * 100
        if prev_energy > 0
        else 0
    )

    emissions_delta = (
        ((current_emissions - prev_emissions) / prev_emissions) * 100
        if prev_emissions > 0
        else 0
    )

    # ----------------------------
    # Overconsumption %
    # ----------------------------
    over_consumption_pct = db.execute(
        text("""
        SELECT
            COALESCE(
                COUNT(*) FILTER (
                    WHERE total_kwh > baseline_kwh
                ) * 100.0 / NULLIF(COUNT(*), 0),
                0
            ) AS pct
        FROM energy_agg_daily
        WHERE date BETWEEN :start AND :end
        """),
        {"start": start_date, "end": end_date},
    ).scalar() or 0

    # ----------------------------
    # Carbon Total (separate table)
    # ----------------------------
    carbon_total = db.execute(
        text("""
        SELECT COALESCE(SUM(emission_value), 0) / 1000
        FROM carbon_emissions_daily
        WHERE date BETWEEN :start AND :end
        """),
        {"start": start_date, "end": end_date},
    ).scalar() or 0


    # ----------------------------
    # Response
    # ----------------------------
    return {
        "success": True,
        "data": {
            "totalEnergyConsumption": {
                "value": round(current_energy, 2),
                "unit": "kWh",
                "delta": round(energy_delta, 2),
                "period": f"{start_date} to {end_date}",
            },
            "energySaved": {
                "value": round(max(0, prev_energy - current_energy), 2),
                "unit": "kWh",
                "delta": round(energy_delta, 2),
            },
            "overConsumptionPercent": {
                "value": round(over_consumption_pct, 2),
                "unit": "%",
                "delta": 0,
            },
            "co2Emissions": {
                "value": round(float(carbon_total or 0), 2),
                "unit": "tCO₂e",
                "delta": round(emissions_delta, 2),
            },
            "avgConsumption": round(float(current.avg_load or 0), 2),
            "peakConsumption": round(float(current.peak_load or 0), 2),
            "totalCost": round(float(current.total_cost or 0), 2),
            "systemStatus": "stable" if energy_delta < 10 else "at-risk",
            "sustainabilityStatus": "on-track"
            if over_consumption_pct < 10
            else "deviating",
        },
        "timestamp": datetime.utcnow().isoformat(),
    }
