# Complete Dashboard Changes: Frontend & Backend

## FRONTEND CHANGES (COMPLETE ✅)

### Files Modified: 3

#### 1. `/EN_VISION_FE/components/tabs/energy-tab.tsx`
**Status:** COMPLETE - Fully redesigned

**What Changed:**
- Expanded from 3 KPI cards to 4 KPI cards
- Added 6 new metric cards in a 3-column grid layout
- New visualizations:
  - **Cost Predicted** - Donut chart (Electricity vs Gas breakdown)
  - **Change in Cost** - Bar chart (month-over-month comparison)
  - **Usage Estimate** - Line chart (current vs predicted usage)
  - **Active Appliances** - Progress bars for appliances
  - **Energy Intensity** - Gauge chart (kWh/Sqft)
  - **Carbon Footprint** - Progress bar (green energy generated)
- Kept existing charts:
  - Daily Deviation from Baseline (line chart)
  - Energy Consumption by Zone (horizontal bar chart)

**New Imports:**
```typescript
import { Leaf, Plug, Wind } from "lucide-react"
import { DistributionChart } from "@/components/dashboard/distribution-chart"
import { useCostMetrics, useEnergyIntensity, useActiveAppliances } from "@/hooks/use-dashboard-data"
```

**New Hooks Being Called:**
- `useCostMetrics(filters)` - Cost & billing data
- `useEnergyIntensity(filters)` - Usage intensity data
- `useActiveAppliances(filters)` - Active appliance list

---

#### 2. `/EN_VISION_FE/hooks/use-dashboard-data.ts`
**Status:** COMPLETE - 3 new hooks added

**Added Imports:**
```typescript
import { getCostMetrics, getEnergyIntensity, getActiveAppliances } from "@/lib/api/dashboard"
```

**New Hooks:**

```typescript
// Hook 1: Cost Metrics
export const useCostMetrics = (filters: DashboardFilters) =>
  useQuery({
    queryKey: ["cost-metrics", filters],
    queryFn: () => getCostMetrics(filters),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!filters,
  })

// Hook 2: Energy Intensity
export const useEnergyIntensity = (filters: DashboardFilters) =>
  useQuery({
    queryKey: ["energy-intensity", filters],
    queryFn: () => getEnergyIntensity(filters),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!filters,
  })

// Hook 3: Active Appliances
export const useActiveAppliances = (filters: DashboardFilters) =>
  useQuery({
    queryKey: ["active-appliances", filters],
    queryFn: () => getActiveAppliances(filters),
    staleTime: STALE_TIME,
    refetchInterval: REFRESH_INTERVAL,
    enabled: !!filters,
  })
```

**Features:**
- All hooks have fallback/default data (will not crash if endpoints fail)
- Support time range filters: `{ range: "7d" | "30d" | "90d" | "1y" | customDates }`
- Auto-refetch based on `REFRESH_INTERVAL`

---

#### 3. `/EN_VISION_FE/lib/api/dashboard.ts`
**Status:** COMPLETE - 3 new API functions added

**New TypeScript Interfaces:**

```typescript
export interface CostMetrics {
  total_cost: number
  electricity_cost: number
  gas_cost: number
  previous_cost: number
  current_cost: number
  previous_month: string
  current_month: string
  cost_change_percent: number
}

export interface EnergyIntensity {
  intensity: number
  current_usage: number
  predicted_usage: number
  usage_history: Array<{ date: string; value: number }>
  carbon_till_date: number
  carbon_predicted: number
  green_energy_percent: number
}

export interface ActiveAppliance {
  name: string
  usage: number
  maxUsage?: number
}
```

**New API Functions:**

```typescript
export const getCostMetrics = async (params?: any): Promise<CostMetrics> => {
  const { data } = await api.get("/dashboard/cost-metrics", { params })
  return data
}

export const getEnergyIntensity = async (params?: any): Promise<EnergyIntensity> => {
  const { data } = await api.get("/dashboard/energy-intensity", { params })
  return data
}

export const getActiveAppliances = async (params?: any): Promise<ActiveAppliance[]> => {
  const { data } = await api.get("/dashboard/active-appliances", { params })
  return data
}
```

---

## BACKEND CHANGES NEEDED (TODO ⏳)

### Total Endpoints Needed: 3

**Base URL:** `{API_BASE}/dashboard/`

Query parameters (common to all):
```
?range=7d|30d|90d|1y
?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
```

---

### Endpoint 1: Cost Metrics
**Path:** `GET /dashboard/cost-metrics`

**Query Parameters:**
```
range: str = "30d"  # "7d", "30d", "90d", "1y", or custom dates
start_date: str (optional)  # YYYY-MM-DD
end_date: str (optional)    # YYYY-MM-DD
```

**Response (JSON):**
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

**Field Descriptions:**
- `total_cost` (float): Total cost for the period
- `electricity_cost` (float): Cost for electricity only
- `gas_cost` (float): Cost for gas only
- `previous_cost` (float): Cost from previous month for comparison
- `current_cost` (float): Cost from current month
- `previous_month` (str): Name/label of previous month
- `current_month` (str): Name/label of current month
- `cost_change_percent` (float): Percentage change from previous month

**FastAPI Example:**
```python
from fastapi import APIRouter, Query
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard/cost-metrics")
async def get_cost_metrics(
    range: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    # Your implementation to fetch from database
    # Calculate costs based on date range
    
    return {
        "total_cost": 300.0,
        "electricity_cost": 214.0,
        "gas_cost": 86.0,
        "previous_cost": 203.0,
        "current_cost": 214.0,
        "previous_month": "May",
        "current_month": "Jun",
        "cost_change_percent": 5.42
    }
```

---

### Endpoint 2: Energy Intensity
**Path:** `GET /dashboard/energy-intensity`

**Query Parameters:**
```
range: str = "30d"
start_date: str (optional)
end_date: str (optional)
```

**Response (JSON):**
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

**Field Descriptions:**
- `intensity` (float): Energy intensity in kWh/sqft
- `current_usage` (float): Usage till today in kWh
- `predicted_usage` (float): Predicted total usage for period in kWh
- `usage_history` (array): Historical usage data points for charting
  - `date` (str): Date label
  - `value` (float): Usage value in kWh
- `carbon_till_date` (float): Carbon emissions till date in kg CO₂
- `carbon_predicted` (float): Predicted carbon emissions for period
- `green_energy_percent` (float): Percentage of green energy used (0-100)

**FastAPI Example:**
```python
@router.get("/dashboard/energy-intensity")
async def get_energy_intensity(
    range: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    # Your implementation
    # Calculate intensity, usage, carbon metrics
    
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
```

---

### Endpoint 3: Active Appliances
**Path:** `GET /dashboard/active-appliances`

**Query Parameters:**
```
range: str = "30d"
start_date: str (optional)
end_date: str (optional)
```

**Response (JSON):**
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

**Field Descriptions:**
- `name` (str): Appliance name
- `usage` (float): Current usage in kWh
- `maxUsage` (float): Maximum capacity of appliance in kWh

**FastAPI Example:**
```python
@router.get("/dashboard/active-appliances")
async def get_active_appliances(
    range: str = Query("30d", regex="^(7d|30d|90d|1y)$"),
    start_date: str = Query(None),
    end_date: str = Query(None)
):
    # Your implementation
    # Fetch active appliances and their current usage
    
    return [
        {"name": "Heating & AC", "usage": 1.4, "maxUsage": 2},
        {"name": "EV Charge", "usage": 0.9, "maxUsage": 2},
        {"name": "Plug Loads", "usage": 0.8, "maxUsage": 2},
        {"name": "Refrigeration", "usage": 0.7, "maxUsage": 2}
    ]
```

---

## Summary of Changes

### Frontend (Complete)
- **1 Tab Modified:** Energy/Dashboard tab
- **3 Files Changed:** energy-tab.tsx, use-dashboard-data.ts, dashboard.ts
- **3 New Hooks:** useCostMetrics, useEnergyIntensity, useActiveAppliances
- **3 New API Functions:** getCostMetrics, getEnergyIntensity, getActiveAppliances
- **New Visualizations:** 6 new metric cards with charts
- **Status:** Ready to use with fallback data

### Backend (Pending Implementation)
- **3 New Endpoints:** All under `/dashboard/` route
- **Support Required:** Time range filtering (7d, 30d, 90d, 1y)
- **Database Queries:** Need to calculate costs, usage, intensity, and appliance data
- **Estimated Time:** 1-2 hours to implement all 3 endpoints
- **Status:** Specifications complete, awaiting implementation

---

## How Frontend & Backend Connect

1. **User opens Dashboard tab**
   ↓
2. **Component mounts** → calls 3 hooks
   ↓
3. **Hooks trigger** → API calls to `/dashboard/cost-metrics`, `/dashboard/energy-intensity`, `/dashboard/active-appliances`
   ↓
4. **Backend processes** → calculates data based on time range filter
   ↓
5. **Frontend receives response** → displays in 6 metric cards + 2 charts
   ↓
6. **If API fails** → fallback data shown (won't break UI)

---

## Testing the Integration

**Test Endpoints (using curl or Postman):**

```bash
# Test Cost Metrics
curl "http://localhost:8000/dashboard/cost-metrics?range=30d"

# Test Energy Intensity
curl "http://localhost:8000/dashboard/energy-intensity?range=30d"

# Test Active Appliances
curl "http://localhost:8000/dashboard/active-appliances?range=30d"

# With custom dates
curl "http://localhost:8000/dashboard/cost-metrics?start_date=2024-01-01&end_date=2024-01-31"
```

**Expected Frontend Behavior:**
- Charts load with data from endpoints
- If endpoints are slow, loading spinners show
- If endpoints fail, fallback data displays (no errors)
- Time range selector filters all data
- Data refreshes every 30 seconds (configurable)

---

## Next Steps

1. **Backend Team:** Implement the 3 endpoints using the FastAPI examples provided
2. **Database:** Ensure you have tables for:
   - Energy consumption by appliance/zone
   - Cost/billing data
   - Carbon emissions tracking
3. **Testing:** Test each endpoint with the curl commands above
4. **Integration:** Once endpoints are ready, dashboard will automatically consume the real data
5. **No Frontend Changes Needed** - Already configured and ready to go!

