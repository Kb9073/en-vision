from sqlalchemy import text
from db.session import engine

def run_baseline_metrics():
    """
    Generate baseline energy usage per device & department.
    Baseline is defined as average daily kWh.
    """

    delete_query = text("DELETE FROM baseline_metrics;")

    insert_query = text("""
        INSERT INTO baseline_metrics (
            department_id,
            device_id,
            baseline_kwh,
            last_updated
        )
        SELECT
            department_id,
            device_id,
            AVG(total_kwh) AS baseline_kwh,
            CURRENT_TIMESTAMP AS last_updated
        FROM daily_energy_summary
        GROUP BY
            department_id,
            device_id;
    """)

    with engine.begin() as conn:
        conn.execute(delete_query)
        conn.execute(insert_query)
