from fastapi import APIRouter

router = APIRouter()


@router.post("/forecast")
def generate_carbon_forecast():
    from services.carbon.forecast import run_carbon_emission_forecast
    run_carbon_emission_forecast()
    return {"status": "carbon emission forecast generated"}
