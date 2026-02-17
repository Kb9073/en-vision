from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def baseline_vs_actual():
    return [
        {"timestamp": "2024-01-01", "actual": 120000, "baseline": 130000},
        {"timestamp": "2024-01-02", "actual": 125000, "baseline": 132000},
    ]
