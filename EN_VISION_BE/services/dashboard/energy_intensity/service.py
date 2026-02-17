def get_energy_intensity(db, range, start_date, end_date):

    # TODO: Replace with real DB logic

    return {
        "intensity": 47.0,
        "current_usage": 164.1,
        "predicted_usage": 439.0,
        "usage_history": [
            {"date": "Jun", "value": 100},
            {"date": "Jun 15", "value": 300},
            {"date": "Jun 22", "value": 200},
            {"date": "Jun 29", "value": 439}
        ],
        "carbon_till_date": 36.4,
        "carbon_predicted": 181.8,
        "green_energy_percent": 60
    }
