from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import date, timedelta, datetime
from typing import Optional

router = APIRouter()

@router.get("/anomalies")
def get_anomalies(
    range: Optional[str] = Query(default="30d"),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    severity: Optional[str] = Query(default="all"),
    limit: int = Query(default=200),
    db: Session = Depends(get_db),
):
    """
    Fully aligned anomaly endpoint
    Uses anomalies table
    """

    max_date = db.execute(
        text("SELECT MAX(timestamp)::date FROM anomalies")
    ).scalar()

    if not max_date:
        return {"data": [], "summary": {}}

    end_date = end_date or max_date

    if not start_date:
        if range == "7d":
            start_date = end_date - timedelta(days=7)
        else:
            start_date = end_date - timedelta(days=30)

    query = """
        SELECT
            id,
            meter_id,
            timestamp,
            reading_value,
            baseline_value,
            severity,
            confidence,
            description,
            explanation
        FROM anomalies
        WHERE timestamp::date BETWEEN :start AND :end
    """

    params = {"start": start_date, "end": end_date}

    if severity != "all":
        query += " AND severity = :severity"
        params["severity"] = severity

    query += " ORDER BY timestamp DESC LIMIT :limit"
    params["limit"] = limit

    rows = db.execute(text(query), params).fetchall()

    summary = db.execute(text("""
        SELECT
            severity,
            COUNT(*) as count
        FROM anomalies
        WHERE timestamp::date BETWEEN :start AND :end
        GROUP BY severity
    """), {"start": start_date, "end": end_date}).fetchall()

    return {
        "data": [
            {
                "id": str(r.id),
                "timestamp": str(r.timestamp),
                "meterId": str(r.meter_id),
                "value": float(r.reading_value or 0),
                "baseline": float(r.baseline_value or 0),
                "severity": r.severity,
                "confidence": float(r.confidence or 0),
                "description": r.description,
                "explanation": r.explanation
            }
            for r in rows
        ],
        "summary": {
            "total": sum(s.count for s in summary),
            "bySeverity": {
                s.severity: s.count for s in summary
            }
        }
    }
