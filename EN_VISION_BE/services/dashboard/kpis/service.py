from sqlalchemy import text
from datetime import datetime


def calculate_kpis(db, start: datetime, end: datetime):

    # ------------------------------
    # 1️⃣ Current Period Aggregation
    # ------------------------------

    query = text("""
        SELECT
            COALESCE(SUM(consumption_kwh), 0) as total_kwh,
            COALESCE(SUM(cost), 0) as total_cost,
            COALESCE(SUM(emissions_kg), 0) as total_emissions,
            COUNT(*) FILTER (WHERE consumption_kwh > baseline_kwh) as over_threshold,
            COUNT(*) as total_rows
        FROM energy_readings
        WHERE timestamp >= :start AND timestamp < :end
    """)

    result = db.execute(query, {"start": start, "end": end}).fetchone()

    total_kwh = float(result.total_kwh or 0)
    total_cost = float(result.total_cost or 0)
    total_emissions = float(result.total_emissions or 0)
    over_threshold = result.over_threshold or 0
    total_rows = result.total_rows or 0

    # Convert kg → tonnes
    emissions_tonnes = total_emissions / 1000

    # ---------------------------------
    # 2️⃣ Previous Period For Delta
    # ---------------------------------

    period_length = end - start
    previous_start = start - period_length
    previous_end = start

    prev_query = text("""
        SELECT
            COALESCE(SUM(consumption_kwh), 0) as total_kwh,
            COALESCE(SUM(cost), 0) as total_cost,
            COALESCE(SUM(emissions_kg), 0) as total_emissions
        FROM energy_readings
        WHERE timestamp >= :start AND timestamp < :end
    """)

    prev_result = db.execute(prev_query, {
        "start": previous_start,
        "end": previous_end
    }).fetchone()

    prev_kwh = float(prev_result.total_kwh or 0)
    prev_cost = float(prev_result.total_cost or 0)
    prev_emissions = float(prev_result.total_emissions or 0)

    # -----------------------------
    # 3️⃣ Delta Calculations
    # -----------------------------

    def percent_delta(current, previous):
        if previous == 0:
            return 0
        return round(((current - previous) / previous) * 100, 2)

    kwh_delta = percent_delta(total_kwh, prev_kwh)
    cost_delta = percent_delta(total_cost, prev_cost)
    emissions_delta = percent_delta(total_emissions, prev_emissions)

    # -----------------------------
    # 4️⃣ Overconsumption %
    # -----------------------------

    if total_rows > 0:
        over_percent = round((over_threshold / total_rows) * 100, 2)
    else:
        over_percent = 0

    # -----------------------------
    # 5️⃣ Final Response
    # -----------------------------

    return {
        "totalEnergyConsumption": {
            "value": round(total_kwh, 2),
            "unit": "kWh",
            "delta": kwh_delta,
            "period": f"{start.date()} to {end.date()}",
        },
        "energyCost": {
            "value": round(total_cost, 2),
            "unit": "USD",
            "delta": cost_delta,
        },
        "overConsumptionPercent": {
            "value": over_percent,
            "unit": "%",
        },
        "co2Emissions": {
            "value": round(emissions_tonnes, 2),
            "unit": "tCO₂e",
            "delta": emissions_delta,
        },
    }
