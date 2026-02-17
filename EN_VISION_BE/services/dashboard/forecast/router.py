from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from db.session import get_db
from services.dashboard.forecast.xgboost import run_xgboost_forecast
from services.dashboard.forecast.lstm import run_lstm_forecast

router = APIRouter()


@router.get("/forecast")
def get_forecast(
    days: int = 7,
    model: str = "xgboost",
    db: Session = Depends(get_db)
):
    """
    Unified forecast endpoint for frontend.
    Default model = xgboost
    """

    if model == "lstm":
        values = run_lstm_forecast(db, days)
    else:
        values = run_xgboost_forecast(db, days)

    return {
        "model": model,
        "horizon_days": days,
        "values": values
    }