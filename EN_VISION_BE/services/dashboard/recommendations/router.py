from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("/recommendations/")
def recommendations(
    limit: int = Query(default=10, ge=1, le=50),
    severity: Optional[str] = Query(default=None),
    db: Session = Depends(get_db)
):
    """Get energy recommendations from database"""
    
    query = text("""
        SELECT 
            id, title, description, severity, estimated_savings, created_at
        FROM recommendations
        WHERE created_at > NOW() - INTERVAL '30 days'
    """)
    
    if severity:
        query = text("""
            SELECT 
                id, title, description, severity, estimated_savings, created_at
            FROM recommendations
            WHERE created_at > NOW() - INTERVAL '30 days'
            AND severity = :severity
        """)
        rows = db.execute(query, {"severity": severity}).fetchall()
    else:
        rows = db.execute(query).fetchall()
    
    if not rows:
        # Return default recommendations
        return [
            {
                "id": "1",
                "title": "Optimize HVAC schedule",
                "description": "Reduce HVAC runtime during low occupancy periods",
                "severity": "high",
                "estimated_savings": 2400,
                "unit": "kWh/week"
            },
            {
                "id": "2",
                "title": "LED lighting upgrade",
                "description": "Replace T12 fluorescent with LED fixtures",
                "severity": "medium",
                "estimated_savings": 1200,
                "unit": "kWh/week"
            }
        ]
    
    return [
        {
            "id": str(row.id),
            "title": row.title,
            "description": row.description,
            "severity": row.severity or "low",
            "estimated_savings": float(row.estimated_savings or 0),
            "unit": "kWh/week"
        }
        for row in rows[:limit]
    ]
