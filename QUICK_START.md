# Quick Start Guide - Dashboard Enhancement

## 30-Second Overview

✅ **Frontend is DONE** - Dashboard tab completely redesigned with 7 new visualizations
⏳ **Backend is TODO** - Need to add 3 API endpoints to provide real data
📊 **Result** - Professional analytics dashboard with cost, usage, and appliance tracking

---

## What You Need to Do

Add these 3 endpoints to your FastAPI backend:

### 1️⃣ `GET /dashboard/cost-metrics`
```python
# Returns current and previous month cost breakdown
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

### 2️⃣ `GET /dashboard/energy-intensity`
```python
# Returns intensity, usage forecasts, and carbon metrics
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

### 3️⃣ `GET /dashboard/active-appliances`
```python
# Returns list of active appliances and their usage
[
  {"name": "Heating & AC", "usage": 1.4, "maxUsage": 2},
  {"name": "EV Charge", "usage": 0.9, "maxUsage": 2},
  {"name": "Plug Loads", "usage": 0.8, "maxUsage": 2},
  {"name": "Refrigeration", "usage": 0.7, "maxUsage": 2}
]
```

---

## Implementation (Copy-Paste Ready)

```python
from fastapi import APIRouter, Query
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# ==================== MODELS ====================

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

# ==================== ENDPOINTS ====================

@router.get("/cost-metrics", response_model=CostMetricsResponse)
async def get_cost_metrics(
    range: Optional[str] = Query(None),
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None)
):
    """Get cost metrics and comparison"""
    # TODO: Query your database
    # Calculate electricity and gas costs
    # Compare with previous period
    
    # For now, return sample data:
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
    """Get energy intensity and usage forecasts"""
    # TODO: Query your database
    # Calculate intensity = total_consumption / building_area
    # Generate usage history points
    # Calculate carbon metrics
    
    # For now, return sample data:
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
    """Get list of active appliances"""
    # TODO: Query your database
    # Get appliance usage data
    # Return top 4-5 appliances
    
    # For now, return sample data:
    return [
        Appliance(name="Heating & AC", usage=1.4, maxUsage=2),
        Appliance(name="EV Charge", usage=0.9, maxUsage=2),
        Appliance(name="Plug Loads", usage=0.8, maxUsage=2),
        Appliance(name="Refrigeration", usage=0.7, maxUsage=2)
    ]
```

---

## Testing

### Quick Test with curl
```bash
curl http://localhost:8000/dashboard/cost-metrics
curl http://localhost:8000/dashboard/energy-intensity
curl http://localhost:8000/dashboard/active-appliances
```

### Full Integration Test
1. Start backend: `python -m uvicorn main:app --reload`
2. Start frontend: `npm run dev` (in EN_VISION_FE/)
3. Go to Energy Dashboard tab
4. Should see real data instead of sample data
5. Open DevTools console - should have no errors

---

## Documentation Files

Read these in order:

1. **📖 README_DASHBOARD_UPDATE.md** - What changed
2. **📋 DASHBOARD_API_SPECS.md** - Detailed specs
3. **📘 BACKEND_IMPLEMENTATION_GUIDE.md** - Code examples
4. **📊 DATA_STRUCTURES.md** - Exact data format
5. **✅ IMPLEMENTATION_CHECKLIST.md** - Step-by-step

---

## Expected Results

### Before
- 2 charts
- 3 KPI cards
- Basic layout

### After
- 7 visualizations
- 4 KPI cards + 3 metric sections
- Professional dashboard
- Cost tracking
- Usage forecasting
- Appliance monitoring
- Carbon tracking
- Dark theme with animations

---

## Next Steps

1. ✅ Copy the code above
2. ✅ Add to your FastAPI app
3. ✅ Query your database instead of hardcoded data
4. ✅ Test with curl
5. ✅ Verify frontend shows real data
6. ✅ Deploy

---

## Parameters Explanation

All endpoints accept optional filtering:

- **`range`**: "7d" | "30d" | "90d" | "1y"
  - Returns data for that time period
  
- **`start_date`**: "YYYY-MM-DD"
  - Custom start date
  
- **`end_date`**: "YYYY-MM-DD"
  - Custom end date

Example:
```bash
# Last 7 days
curl "http://localhost:8000/dashboard/cost-metrics?range=7d"

# Custom date range
curl "http://localhost:8000/dashboard/cost-metrics?start_date=2024-05-01&end_date=2024-06-01"
```

---

## Calculation Tips

### Cost Metrics
```python
cost_change_percent = ((current_cost - previous_cost) / previous_cost) * 100
total_cost = electricity_cost + gas_cost
```

### Energy Intensity
```python
intensity = total_consumption_kwh / building_area_sqft  # e.g., 47 kWh/sqft
carbon = usage_kwh * 0.385  # conversion factor (varies by region)
```

### Active Appliances
```python
# Bar width calculation (frontend does this)
bar_width_percent = (usage / maxUsage) * 100
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| 404 errors in console | Endpoint not registered in router |
| Type errors | Check response matches Pydantic model |
| Empty arrays | Return at least 4 data points |
| String numbers | Use `float` not `"float"` in JSON |
| No data displayed | Check API response in Network tab |

---

## Files Changed

✅ **Frontend (DONE)**
- `EN_VISION_FE/components/tabs/energy-tab.tsx`
- `EN_VISION_FE/hooks/use-dashboard-data.ts`
- `EN_VISION_FE/lib/api/dashboard.ts`

⏳ **Backend (YOUR JOB)**
- Add 3 endpoints to your FastAPI app

---

## Support

- **What to implement?** → See `DASHBOARD_API_SPECS.md`
- **How to code it?** → See `BACKEND_IMPLEMENTATION_GUIDE.md`
- **What format?** → See `DATA_STRUCTURES.md`
- **Step by step?** → See `IMPLEMENTATION_CHECKLIST.md`

---

## Timeline

- **Read & Plan:** 10 min
- **Implement:** 45 min  
- **Test:** 15 min
- **Deploy:** 10 min

**Total: ~1.5 hours**

---

That's it! You have everything you need. The frontend is ready, the code templates are provided, and the documentation is comprehensive.

**Start with the code above and query your database instead of returning hardcoded values.**

Good luck! 🚀
