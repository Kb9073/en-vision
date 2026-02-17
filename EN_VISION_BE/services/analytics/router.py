from fastapi import APIRouter
from services.analytics.deviation import run_deviation_detection

router = APIRouter()

@router.post("/deviations")
def generate_deviations():
    run_deviation_detection()
    return {"status": "deviation detection completed"}
