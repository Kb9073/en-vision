from fastapi import APIRouter

router = APIRouter()

@router.get("/carbon-metrics")
def get_carbon_metrics():
    return {
        "totalEmissions": 1284,
        "delta": -6.2
    }

@router.get("/carbon-breakdown")
def get_carbon_breakdown():
    return [
        {"source": "Electricity", "value": 62},
        {"source": "Fuel", "value": 28},
        {"source": "Other", "value": 10}
    ]
