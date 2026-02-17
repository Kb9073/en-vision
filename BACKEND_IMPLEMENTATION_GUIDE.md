# Backend Implementation Guide - Enhanced Dashboard

## Quick Start

Your frontend is ready and waiting for three new API endpoints. Here's what you need to implement:

## Endpoint 1: Cost Metrics

**Route:** `GET /dashboard/cost-metrics`

**Query Parameters:**
```python
range: str  # Optional: "7d", "30d", "90d", "1y"
start_date: str  # Optional: YYYY-MM-DD
end_date: str  # Optional: YYYY-MM-DD
```

**Expected Response (JSON):**
```json
{
  "total_cost": 300,
  "electricity_cost": 214,
  "gas_cost": 86,
  "previous_cost": 203,
  "current_cost": 214,
  "previous_month": "May",
  "current_month": "Jun",
  "cost_change_percent": 5.42
}
```

**What it should calculate:**
- `total_cost`: Sum of electricity_cost + gas_cost
- `electricity_cost`: Total cost of electricity for current period
- `gas_cost`: Total cost of gas for current period
- `previous_cost`: Total cost of previous period (for comparison)
- `current_cost`: Total cost of current period
- `previous_month`: Name of previous month
- `current_month`: Name of current month
- `cost_change_percent`: ((current_cost - previous_cost) / previous_cost) * 100

---

## Endpoint 2: Energy Intensity

**Route:** `GET /dashboard/energy-intensity`

**Query Parameters:**
```python
range: str  # Optional: "7d", "30d", "90d", "1y"
start_date: str  # Optional: YYYY-MM-DD
end_date: str  # Optional: YYYY-MM-DD
```

**Expected Response (JSON):**
```json
{
  "intensity": 47,
  "current_usage": 164.1,
  "predicted_usage": 439,
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
```

**What it should calculate:**
- `intensity`: Energy consumption per square foot (kWh/sqft)
- `current_usage`: Current total energy usage (kWh) for the period
- `predicted_usage`: Forecasted total energy usage (kWh) for the rest of the period
- `usage_history`: Array of usage data points with dates and values for charting
  - Should provide 4-5 data points across the time period
  - `date`: String representation of the date
  - `value`: Energy usage value in kWh
- `carbon_till_date`: CO₂ emissions generated till now (Kg)
- `carbon_predicted`: Projected CO₂ emissions for full period (Kg)
- `green_energy_percent`: Percentage of energy from renewable sources (0-100)

---

## Endpoint 3: Active Appliances

**Route:** `GET /dashboard/active-appliances`

**Query Parameters:**
```python
range: str  # Optional: "7d", "30d", "90d", "1y"
start_date: str  # Optional: YYYY-MM-DD
end_date: str  # Optional: YYYY-MM-DD
```

**Expected Response (JSON - Array):**
```json
[
  {
    "name": "Heating & AC",
    "usage": 1.4,
    "maxUsage": 2
  },
  {
    "name": "EV Charge",
    "usage": 0.9,
    "maxUsage": 2
  },
  {
    "name": "Plug Loads",
    "usage": 0.8,
    "maxUsage": 2
  },
  {
    "name": "Refrigeration",
    "usage": 0.7,
    "maxUsage": 2
  }
]
```

**What it should include:**
- Array of appliances currently in use
- `name`: Name of the appliance (string)
- `usage`: Current energy consumption in kWh
- `maxUsage`: Maximum typical usage for this appliance (for scaling progress bars)
- Include 3-5 most relevant appliances for the facility
- Can add more appliances as needed

---

## FastAPI Implementation Example

Here's a template to get you started:

```python
from fastapi import APIRouter, Query
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pydantic import BaseModel

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

class CostMetricsResponse(BaseModel):
    total_cost: float
    electricity_cost: float
    gas_cost: float
    previous_cost: float
    current_cost: float
    previous_month: str
    current_month: str
    cost_change_percent: float

class UsagePoint(BaseModel):
    date: str
    value: float

class EnergyIntensityResponse(BaseModel):
    intensity: float
    current_usage: float
    predicted_usage: float
    usage_history: List[UsagePoint]
    carbon_till_date: float
    carbon_predicted: float
    green_energy_percent: float

class Appliance(BaseModel):
    name: str
    usage: float
    maxUsage: float

@router.get("/cost-metrics", response_model=CostMetricsResponse)
async def get_cost_metrics(
    range: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Get cost metrics for the specified period"""
    # Implement your logic here
    # Query your database for cost data
    # Calculate comparisons with previous period
    
    return CostMetricsResponse(
        total_cost=300,
        electricity_cost=214,
        gas_cost=86,
        previous_cost=203,
        current_cost=214,
        previous_month="May",
        current_month="Jun",
        cost_change_percent=5.42
    )

@router.get("/energy-intensity", response_model=EnergyIntensityResponse)
async def get_energy_intensity(
    range: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Get energy intensity metrics"""
    # Implement your logic here
    # Calculate intensity = total_consumption / facility_area
    # Generate usage history for charting
    # Calculate carbon metrics
    
    return EnergyIntensityResponse(
        intensity=47,
        current_usage=164.1,
        predicted_usage=439,
        usage_history=[
            UsagePoint(date="Jun", value=100),
            UsagePoint(date="Jun 15", value=300),
            UsagePoint(date="Jun 22", value=200),
            UsagePoint(date="Jun 29", value=439)
        ],
        carbon_till_date=36.4,
        carbon_predicted=181.8,
        green_energy_percent=60
    )

@router.get("/active-appliances", response_model=List[Appliance])
async def get_active_appliances(
    range: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Get list of active appliances and their usage"""
    # Implement your logic here
    # Query appliance data from database
    # Calculate current usage for each appliance
    # Return top appliances
    
    return [
        Appliance(name="Heating & AC", usage=1.4, maxUsage=2),
        Appliance(name="EV Charge", usage=0.9, maxUsage=2),
        Appliance(name="Plug Loads", usage=0.8, maxUsage=2),
        Appliance(name="Refrigeration", usage=0.7, maxUsage=2)
    ]
```

---

## Integration Checklist

- [ ] Create `CostMetricsResponse` Pydantic model
- [ ] Create `EnergyIntensityResponse` Pydantic model
- [ ] Create `Appliance` Pydantic model
- [ ] Implement `/dashboard/cost-metrics` endpoint
- [ ] Implement `/dashboard/energy-intensity` endpoint
- [ ] Implement `/dashboard/active-appliances` endpoint
- [ ] Add proper error handling and validation
- [ ] Test endpoints with frontend (all fallback data should be replaced with real data)
- [ ] Verify filtering works (range, start_date, end_date)
- [ ] Check data types match expected format

---

## Testing

Once implemented, test each endpoint:

```bash
# Test Cost Metrics
curl "http://localhost:8000/dashboard/cost-metrics"
curl "http://localhost:8000/dashboard/cost-metrics?range=7d"

# Test Energy Intensity
curl "http://localhost:8000/dashboard/energy-intensity"
curl "http://localhost:8000/dashboard/energy-intensity?range=30d"

# Test Active Appliances
curl "http://localhost:8000/dashboard/active-appliances"
curl "http://localhost:8000/dashboard/active-appliances?range=1y"
```

---

## Frontend Auto-Testing

The frontend has fallback data for all three endpoints. To verify your implementation:

1. Implement the endpoint on your FastAPI server
2. Start your frontend dev server
3. Navigate to the Energy Dashboard tab
4. Open browser DevTools → Console
5. Check for errors or the fallback data being used
6. When real data comes through, the dashboard will automatically update

---

## Notes

- All endpoints should support optional `range`, `start_date`, and `end_date` filters
- Responses should be in JSON format (FastAPI handles this automatically)
- The frontend caches data for 10 seconds and refreshes every 20 seconds
- Error responses should be proper HTTP error codes (400, 404, 500, etc.)
- The frontend will gracefully fall back to sample data if endpoints return errors

---

## Data Sources

These endpoints should query your existing data infrastructure:
- Energy consumption database
- Cost tracking system
- Appliance sensors/IoT devices
- Carbon emissions data
- Weather data (if doing predictions)

Make sure your implementation joins the necessary tables and calculates the required metrics correctly.

Good luck! 🚀
