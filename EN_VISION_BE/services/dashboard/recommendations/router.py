from fastapi import APIRouter

router = APIRouter()

@router.get("/recommendations/")
def recommendations():
    return [
        {
            "id": "1",
            "severity": "high",
            "category": "efficiency",
            "title": "Reduce HVAC usage",
            "description": "HVAC running during low occupancy",
            "impact": "Save 2400 kWh/week",
            "why": "Occupancy < 15% after 6 PM",
        }
    ]
