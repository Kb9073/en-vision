from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from db.session import get_db

router = APIRouter()


@router.get("/anomalies")
def get_anomalies(db: Session = Depends(get_db)):
    """
    Returns recent energy anomalies detected by Isolation Forest
    """

    query = text("""
        SELECT
            timestamp,
            device_id,
            department_id,
            kwh,
            anomaly_score
        FROM energy_anomalies
        ORDER BY timestamp DESC
        LIMIT 20
    """)

    rows = db.execute(query).fetchall()

    if not rows:
        return []

    return [
        {
            "timestamp": r.timestamp.isoformat(),
            "device_id": r.device_id,
            "department_id": r.department_id,
            "kwh": float(r.kwh),
            "severity": (
                "high" if r.anomaly_score < -0.3 else
                "medium" if r.anomaly_score < -0.15 else
                "low"
            )
        }
        for r in rows
    ]
