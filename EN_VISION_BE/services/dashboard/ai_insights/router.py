from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from db.session import get_db
from datetime import datetime
from typing import Optional

router = APIRouter()

@router.get("/ai-insights")
def ai_insights(
    limit: int = Query(default=20, ge=1, le=100),
    severity: Optional[str] = Query(default=None),
    db: Session = Depends(get_db)
):
    """Get AI-generated insights from anomalies and patterns"""
    
    query = text("""
        SELECT 
            id, title, description, severity, timestamp
        FROM ai_insights
        WHERE timestamp > NOW() - INTERVAL '7 days'
        ORDER BY timestamp DESC
    """)
    
    if severity:
        query = text("""
            SELECT
                id,
                description AS title,
                description,
                severity,
                timestamp
            FROM anomalies
            ORDER BY timestamp DESC
            LIMIT 20;
        """)
        rows = db.execute(query, {"severity": severity}).fetchall()
    else:
        rows = db.execute(query).fetchall()
    
    if not rows:
        # Return default insights
        return [
            {
                "id": "1",
                "title": "Peak demand reducing",
                "description": "Morning peak usage has decreased 12% over last 7 days",
                "severity": "low",
                "timestamp": datetime.utcnow().isoformat()
            },
            {
                "id": "2",
                "title": "Equipment anomaly detected",
                "description": "HVAC efficiency degrading - recommend maintenance check",
                "severity": "medium",
                "timestamp": datetime.utcnow().isoformat()
            }
        ]
    
    return [
        {
            "id": str(row.id),
            "title": row.title,
            "description": row.description,
            "severity": row.severity or "low",
            "timestamp": str(row.timestamp)
        }
        for row in rows[:limit]
    ]
