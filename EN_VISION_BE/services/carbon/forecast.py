from sqlalchemy import text
from db.session import engine

EMISSION_FACTOR = 0.82  # kg CO2 per kWh (India grid average)


def run_carbon_emission_forecast():
    """
    Convert energy forecasts into carbon emission forecasts
    """

    query = """
        SELECT
            forecast_date,
            department_id,
            device_id,
            model_type,
            predicted_kwh
        FROM energy_forecasts
    """

    with engine.begin() as conn:
        # Clear previous carbon forecasts
        conn.execute(text("DELETE FROM carbon_emission_forecasts;"))

        results = conn.execute(text(query)).fetchall()

        for row in results:
            predicted_co2 = float(row.predicted_kwh) * EMISSION_FACTOR

            conn.execute(
                text("""
                    INSERT INTO carbon_emission_forecasts (
                        forecast_date,
                        department_id,
                        device_id,
                        model_type,
                        predicted_kwh,
                        predicted_co2_kg
                    )
                    VALUES (
                        :forecast_date,
                        :department_id,
                        :device_id,
                        :model_type,
                        :predicted_kwh,
                        :predicted_co2_kg
                    )
                """),
                {
                    "forecast_date": row.forecast_date,
                    "department_id": row.department_id,
                    "device_id": row.device_id,
                    "model_type": row.model_type,
                    "predicted_kwh": row.predicted_kwh,
                    "predicted_co2_kg": round(predicted_co2, 2)
                }
            )
