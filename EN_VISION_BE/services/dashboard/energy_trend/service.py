from sqlalchemy import text
from datetime import timedelta

def fetch_energy_trend(db, start_date, end_date):
    query = text("""
        SELECT
            d.date                                AS date,
            SUM(d.total_kwh)                     AS actual,
            SUM(b.baseline_kwh)                  AS baseline
        FROM daily_energy_summary d
        JOIN baseline_metrics b
          ON d.department_id = b.department_id
         AND d.device_id = b.device_id
        WHERE d.date BETWEEN :start_date AND :end_date
        GROUP BY d.date
        ORDER BY d.date
    """)

    rows = db.execute(
        query,
        {"start_date": start_date, "end_date": end_date}
    ).mappings().all()

    return [
        {
            "date": row["date"].isoformat(),
            "actual": float(row["actual"]),
            "baseline": float(row["baseline"]),
        }
        for row in rows
    ]
