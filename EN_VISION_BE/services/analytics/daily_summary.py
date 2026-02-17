from sqlalchemy import text
from db.session import engine


def run_daily_energy_summary():
    """
    Rebuild daily_energy_summary table from energy_events
    """

    truncate_query = text("TRUNCATE TABLE daily_energy_summary RESTART IDENTITY;")

    insert_query = text("""
        INSERT INTO daily_energy_summary (
            date,
            department_id,
            device_id,
            total_kwh,
            avg_kwh,
            peak_kwh
        )
        SELECT
            DATE("timestamp") AS date,
            department_id,
            device_id,
            SUM(kwh)        AS total_kwh,
            AVG(kwh)        AS avg_kwh,
            MAX(kwh)        AS peak_kwh
        FROM energy_events
        GROUP BY
            DATE("timestamp"),
            department_id,
            device_id
        ORDER BY
            date;
    """)

    with engine.begin() as conn:
        conn.execute(truncate_query)
        result = conn.execute(insert_query)

    return {
        "status": "success",
        "message": "daily_energy_summary refreshed successfully"
    }
