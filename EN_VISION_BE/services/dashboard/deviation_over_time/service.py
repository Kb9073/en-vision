from sqlalchemy import text
from datetime import timedelta

def get_deviation_over_time(db, start_date, end_date):
    query = text("""
        WITH daily_actual AS (
            SELECT
                date,
                SUM(total_kwh) AS actual_kwh
            FROM daily_energy_summary
            WHERE date BETWEEN :start_date AND :end_date
            GROUP BY date
        ),
        baseline_daily AS (
            SELECT
                SUM(baseline_kwh) AS baseline_kwh
            FROM baseline_metrics
        )
        SELECT
            d.date,
            d.actual_kwh - b.baseline_kwh AS deviation
        FROM daily_actual d
        CROSS JOIN baseline_daily b
        ORDER BY d.date
    """)

    result = db.execute(
        query,
        {
            "start_date": start_date,
            "end_date": end_date,
        },
    ).mappings().all()

    return [
        {
            "date": row["date"].isoformat(),
            "deviation": float(row["deviation"]),
        }
        for row in result
    ]
