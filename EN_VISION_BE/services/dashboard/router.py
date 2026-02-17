from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import text

from db.session import get_db

from services.dashboard.kpis.router import router as kpis_router
from services.dashboard.energy_trend.router import router as energy_trend_router
from services.dashboard.deviations.router import router as deviation_router
from services.dashboard.recommendations.router import router as recommendations_router
from services.dashboard.ai_insights.router import router as ai_insights_router
from services.dashboard.carbon.router import router as carbon_router
from services.dashboard.anomalies.router import router as anomalies_router
from services.dashboard.forecast.router import router as forecast_router
from services.dashboard.deviation_over_time.router import router as deviation_over_time_router

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

router.include_router(kpis_router)
router.include_router(energy_trend_router)
router.include_router(deviation_router)
router.include_router(ai_insights_router)
router.include_router(recommendations_router)
router.include_router(carbon_router)  # already has /carbon-* inside
router.include_router(anomalies_router)
router.include_router(forecast_router)
router.include_router(deviation_over_time_router)
