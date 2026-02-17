from fastapi import APIRouter

router = APIRouter()

@router.get("/anomalies/")
def get_anomalies():
    return [
        {
            "timestamp": "2024-01-04T14:32:00Z",
            "value": 185000,
            "severity": "high",
            "description": "HVAC spike in Building A",
            "impact": "high",
            "affectedSystem": "HVAC",
            "timeWindow": "2:00 PM – 2:30 PM",
            "energyImpact": 2400,
            "explanation": "Deviation from baseline detected",
            "model": "Isolation Forest",
        }
    ]
