from sqlalchemy import text
from datetime import datetime, date, timedelta
from typing import Optional

# =========================
# CONSTANTS
# =========================

EMISSION_FACTOR = 0.82 / 1000  # kg CO₂ / kWh → tonnes


# =========================
# MAIN KPI SERVICE
# =========================

def fetch_kpis(
    db,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
):
    """
    Fetch dashboard KPIs for a given date range.

    - end_date defaults to MAX(date) in daily_energy_summary
    - start_date defaults to end_date - 7 days
    """

    # --------------------------------------------------
    # 1. Resolve date range (data-driven)
    # --------------------------------------------------

    max_date = db.execute(
        text("SELECT MAX(date) FROM daily_energy_summary")
    ).scalar()

    if not max_date:
        return _empty_kpi_response()

    end_date = end_date or max_date
    start_date = start_date or (end_date - timedelta(days=7))

    # --------------------------------------------------
    # 2. ACTUAL CONSUMPTION
    # --------------------------------------------------

    actual = db.execute(
        text("""
            SELECT
                COALESCE(SUM(total_kwh), 0) AS total_energy,
                COALESCE(AVG(total_kwh), 0) AS avg_daily,
                COALESCE(MAX(peak_kwh), 0)  AS peak_kwh
            FROM daily_energy_summary
            WHERE date BETWEEN :start AND :end
        """),
        {"start": start_date, "end": end_date}
    ).mappings().one()

    total_energy = float(actual["total_energy"])
    avg_daily = float(actual["avg_daily"])
    peak_kwh = float(actual["peak_kwh"])

    # --------------------------------------------------
    # 3. BASELINE (DEVICE → DAILY → PERIOD)
    # --------------------------------------------------

    baseline_total = db.execute(
        text("""
            SELECT
                COALESCE(SUM(b.baseline_kwh), 0)
            FROM baseline_metrics b
            JOIN (
                SELECT DISTINCT device_id, date
                FROM daily_energy_summary
                WHERE date BETWEEN :start AND :end
            ) d ON d.device_id = b.device_id
        """),
        {"start": start_date, "end": end_date}
    ).scalar() or 0.0

    # --------------------------------------------------
    # 4. ENERGY SAVED
    # --------------------------------------------------

    energy_saved = max(baseline_total - total_energy, 0)

    # --------------------------------------------------
    # 5. OVER-CONSUMPTION %
    # --------------------------------------------------

    over_consumption_pct = (
        ((total_energy - baseline_total) / baseline_total) * 100
        if baseline_total > 0 else 0
    )

    # --------------------------------------------------
    # 6. CO₂ EMISSIONS
    # --------------------------------------------------

    co2_emissions = total_energy * EMISSION_FACTOR

    # --------------------------------------------------
    # 7. FINAL RESPONSE
    # --------------------------------------------------

    return {
        "total_energy": round(total_energy, 2),
        "avg_daily": round(avg_daily, 2),
        "peak_kwh": round(peak_kwh, 2),

        "energy_saved": round(energy_saved, 2),
        "energy_saved_delta": 0.0,

        "over_consumption_percent": round(over_consumption_pct, 2),
        "over_consumption_delta": 0.0,

        "co2_emissions": round(co2_emissions, 2),
        "co2_emissions_delta": 0.0,

        "system_status": _derive_system_status(over_consumption_pct),
        "sustainability_status": _derive_sustainability_status(over_consumption_pct),

        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "last_updated": datetime.utcnow().isoformat(),
    }


# =========================
# HELPERS
# =========================

def _derive_system_status(over_pct: float) -> str:
    if over_pct > 15:
        return "critical"
    if over_pct > 5:
        return "at-risk"
    return "stable"


def _derive_sustainability_status(over_pct: float) -> str:
    if over_pct > 10:
        return "deviating"
    if over_pct < -5:
        return "exceeding"
    return "on-track"


def _empty_kpi_response():
    return {
        "total_energy": 0,
        "avg_daily": 0,
        "peak_kwh": 0,
        "energy_saved": 0,
        "energy_saved_delta": 0,
        "over_consumption_percent": 0,
        "over_consumption_delta": 0,
        "co2_emissions": 0,
        "co2_emissions_delta": 0,
        "system_status": "stable",
        "sustainability_status": "on-track",
        "start_date": None,
        "end_date": None,
        "last_updated": datetime.utcnow().isoformat(),
    }
