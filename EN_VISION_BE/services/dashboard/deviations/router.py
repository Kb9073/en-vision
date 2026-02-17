from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from db.session import get_db

router = APIRouter()

@router.get("/deviations")
def get_deviations(db: Session = Depends(get_db)):
    query = text("""
        SELECT
            department_id,
            SUM(total_kwh) AS total_kwh
        FROM daily_energy_summary
        GROUP BY department_id
        ORDER BY total_kwh DESC
    """)

    rows = db.execute(query).fetchall()

    # 🔒 Prevent frontend crash
    if not rows:
        return []

    return [
        {
            "zone": r.department_id,
            "deviation": float(r.total_kwh)
        }
        for r in rows
    ]
