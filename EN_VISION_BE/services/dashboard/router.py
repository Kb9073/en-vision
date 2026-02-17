from fastapi import APIRouter
from sqlalchemy.orm import Session
from sqlalchemy import text

from db.session import get_db

from services.dashboard.kpis.router import router as kpis_router
from services.dashboard.energy_trend.router import router as energy_trend_router
from services.dashboard.deviations.router import router as deviation_router
from services.dashboard.recommendations.router import router as recommendations_router
from services.dashboard.ai_insights.router import router as ai_insights_router
from .carbon_metrics.router import router as carbon_metrics_router
from .carbon_breakdown.router import router as carbon_breakdown_router
from services.dashboard.anomalies.router import router as anomalies_router
from services.dashboard.forecast.router import router as forecast_router
from services.dashboard.deviation_over_time.router import router as deviation_over_time_router
from services.dashboard.cost_metrics.router import router as cost_metrics_router
from services.dashboard.energy_intensity.router import router as energy_intensity_router
from services.dashboard.active_appliances.router import router as active_appliances_router

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

router.include_router(kpis_router)
router.include_router(energy_trend_router)
router.include_router(deviation_router)
router.include_router(ai_insights_router)
router.include_router(recommendations_router)
router.include_router(carbon_metrics_router)
router.include_router(carbon_breakdown_router) 
router.include_router(anomalies_router)
router.include_router(forecast_router)
router.include_router(deviation_over_time_router)
router.include_router(cost_metrics_router)
router.include_router(energy_intensity_router)
router.include_router(active_appliances_router)