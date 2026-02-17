# Enhanced Energy Dashboard - API Specifications

This document outlines all the new endpoints required to support the enhanced dashboard tab. The frontend is now connected and ready to receive this data.

## Base URL
`http://localhost:8000`

## New Endpoints Required

### 1. Cost Metrics
**Endpoint:** `GET /dashboard/cost-metrics`

**Query Parameters:**
- `range` (optional): Time range filter (e.g., "7d", "30d", "1y")
- `start_date` (optional): Start date for custom range
- `end_date` (optional): End date for custom range

**Response:**
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

**Description:**
- Returns current month cost breakdown and comparison with previous month
- Used for the "Cost Predicted" donut chart
- Used for the "Change in Cost" bar chart

---

### 2. Energy Intensity
**Endpoint:** `GET /dashboard/energy-intensity`

**Query Parameters:**
- `range` (optional): Time range filter
- `start_date` (optional): Start date for custom range
- `end_date` (optional): End date for custom range

**Response:**
```json
{
  "intensity": 47,
  "current_usage": 164.1,
  "predicted_usage": 439,
  "usage_history": [
    { "date": "Jun", "value": 100 },
    { "date": "Jun 15", "value": 300 },
    { "date": "Jun 22", "value": 200 },
    { "date": "Jun 29", "value": 439 }
  ],
  "carbon_till_date": 36.4,
  "carbon_predicted": 181.8,
  "green_energy_percent": 60
}
```

**Description:**
- Returns energy intensity metric (kWh per square foot)
- Provides usage estimates and historical data for line chart
- Includes carbon footprint predictions and green energy percentage
- Used for "Usage Estimate" line chart
- Used for "Energy Intensity" gauge chart
- Used for "Carbon Footprint" progress indicators

---

### 3. Active Appliances
**Endpoint:** `GET /dashboard/active-appliances`

**Query Parameters:**
- `range` (optional): Time range filter
- `start_date` (optional): Start date for custom range
- `end_date` (optional): End date for custom range

**Response:**
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

**Description:**
- Returns list of currently active appliances with their usage
- `usage`: Current energy consumption in kWh
- `maxUsage`: Maximum possible usage for that appliance (for progress bar scaling)
- Used for "Active Appliances" horizontal bar chart

---

## Existing Endpoints (Already Implemented)

These endpoints were already in use and continue to support the dashboard:

1. **GET /dashboard/kpis** - Main KPI metrics
2. **GET /dashboard/energy-trend** - Energy consumption trends
3. **GET /dashboard/deviation-over-time** - Deviation from baseline over time
4. **GET /dashboard/zone-energy-distribution** - Energy distribution by zone (or equivalent)

---

## Implementation Notes

### Frontend Fallbacks
The frontend has fallback data for all new endpoints. If an endpoint returns an error or is not available, the dashboard will display:
- Default cost values: $300 total ($214 electricity, $86 gas)
- Default intensity: 47 kWh/Sqft
- Default appliances: 4 common appliances with sample data

### Time Range Filtering
All new endpoints support the same filtering as existing endpoints:
- `range`: "7d" | "30d" | "90d" | "1y"
- Or custom date range with `start_date` and `end_date`

### Response Format
All endpoints follow the same pattern:
- Simple JSON objects/arrays
- No nested wrapper objects (e.g., `{ data: {...} }`)
- Return raw values for frontend transformation

---

## Dashboard Sections Overview

### Top KPIs (4 cards)
- Total Consumption (existing)
- Average Daily (existing)
- Peak Demand (existing)
- CO₂ Emissions (existing)

### Main Metrics Row (3 sections)
1. **Cost Predicted** - Uses `/dashboard/cost-metrics`
   - Donut chart showing electricity vs gas breakdown
   - Displays total cost in center

2. **Change in Cost** - Uses `/dashboard/cost-metrics`
   - Bar chart comparing previous month vs current month
   - Shows percentage increase

3. **Usage Estimate** - Uses `/dashboard/energy-intensity`
   - Line chart showing usage forecast
   - Displays current usage and predicted usage

### Secondary Metrics Row (3 sections)
1. **Active Appliances** - Uses `/dashboard/active-appliances`
   - Horizontal bar chart with progress indicators
   - Shows usage for each appliance

2. **Energy Intensity** - Uses `/dashboard/energy-intensity`
   - Gauge/donut chart showing intensity metric
   - Center displays intensity value in kWh/Sqft

3. **Carbon Footprint** - Uses `/dashboard/energy-intensity`
   - Displays carbon metrics (till date vs predicted)
   - Progress bar for green energy percentage

### Detailed Charts (2 sections)
1. **Daily Deviation** - Uses `/dashboard/deviation-over-time` (existing)
2. **Energy by Zone** - Uses `/dashboard/zone-energy-distribution` (existing)

---

## Implementation Priority

### Phase 1 (Critical)
- `GET /dashboard/cost-metrics` - For cost visualization
- `GET /dashboard/energy-intensity` - For usage and carbon metrics

### Phase 2 (High)
- `GET /dashboard/active-appliances` - For appliance monitoring

### Phase 3 (Enhancement)
- Improve existing zone distribution if possible
- Add more detailed appliance data

---

## Testing the Integration

Once you implement an endpoint:
1. The dashboard will automatically fetch data
2. Check browser console for any errors
3. Data will be cached and refreshed every 20 seconds (configurable)
4. If endpoint returns error, fallback data will be used

**Happy building!** 🚀
