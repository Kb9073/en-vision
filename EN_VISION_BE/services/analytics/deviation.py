from sqlalchemy import text
from db.session import engine


def run_deviation_detection():
    """
    Rule-based deviation detection using baseline metrics.
    """

    delete_query = text("DELETE FROM energy_deviations;")

    insert_query = text("""
        INSERT INTO energy_deviations (
            date,
            department_id,
            device_id,
            baseline_kwh,
            actual_kwh,
            deviation_percent,
            severity
        )
        SELECT
            d.date,
            d.department_id,
            d.device_id,
            b.baseline_kwh,
            d.total_kwh AS actual_kwh,
            ROUND(
                (
                    ((d.total_kwh - b.baseline_kwh) / b.baseline_kwh) * 100
                )::numeric,
                2
            ) AS deviation_percent,
            CASE
                WHEN ABS((d.total_kwh - b.baseline_kwh) / b.baseline_kwh) * 100 > 30
                    THEN 'CRITICAL'
                WHEN ABS((d.total_kwh - b.baseline_kwh) / b.baseline_kwh) * 100 > 20
                    THEN 'HIGH'
                WHEN ABS((d.total_kwh - b.baseline_kwh) / b.baseline_kwh) * 100 > 10
                    THEN 'MEDIUM'
                ELSE 'NORMAL'
            END AS severity
        FROM daily_energy_summary d
        JOIN baseline_metrics b
        ON d.device_id = b.device_id
        AND d.department_id = b.department_id;
                        """)

    with engine.begin() as conn:
        conn.execute(delete_query)
        conn.execute(insert_query)
