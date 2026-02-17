from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import timedelta

def run_xgboost_forecast(db: Session, days: int = 7):
    """
    Mock XGBoost-style forecast based on historical averages.
    Replace later with real model inference.
    """

    query = text("""
        SELECT
            date,
            SUM(total_kwh) AS total_kwh
        FROM daily_energy_summary
        GROUP BY date
        ORDER BY date DESC
        LIMIT 30
    """)

    rows = db.execute(query).fetchall()

    if not rows:
        return []

    avg_kwh = sum(float(r.total_kwh) for r in rows) / len(rows)
    last_date = rows[0].date

    forecast = []
    for i in range(1, days + 1):
        forecast.append({
            "date": (last_date + timedelta(days=i)).isoformat(),
            "predicted_kwh": round(avg_kwh * 1.02, 2)
        })

    return forecast
