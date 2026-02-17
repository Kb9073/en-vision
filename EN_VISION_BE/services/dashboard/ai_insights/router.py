from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/ai-insights/")
def ai_insights():
    return [
        {
            "id": "1",
            "type": "alert",
            "message": "Unusual spike detected in HVAC",
            "timestamp": datetime.utcnow().isoformat(),
            "severity": "high",
        }
    ]
