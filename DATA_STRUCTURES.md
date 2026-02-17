# Data Structures - Complete Reference

## Overview

This document shows the exact data structures expected by each part of the enhanced dashboard.

---

## 1. Cost Metrics Endpoint

### Endpoint
```
GET /dashboard/cost-metrics?range=30d
```

### Request Parameters (Optional)
```typescript
interface CostMetricsParams {
  range?: "7d" | "30d" | "90d" | "1y"  // Default: current month
  start_date?: string                   // YYYY-MM-DD format
  end_date?: string                     // YYYY-MM-DD format
}
```

### Response Structure
```typescript
interface CostMetrics {
  total_cost: number                    // Sum of electricity + gas costs
  electricity_cost: number              // Cost for electricity in current period
  gas_cost: number                      // Cost for gas in current period
  previous_cost: number                 // Total cost of previous period
  current_cost: number                  // Total cost of current period
  previous_month: string                // E.g., "May"
  current_month: string                 // E.g., "Jun"
  cost_change_percent: number           // (current - previous) / previous * 100
}
```

### Example Response
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

### Frontend Usage
Used in three places:
1. **Cost Predicted Card** (Donut chart showing electricity vs gas split)
2. **Change in Cost Card** (Bar chart comparing months)
3. Calculated fields in both cards

### Calculation Guide
```python
# Calculate total cost
total_cost = electricity_cost + gas_cost

# Calculate cost change percent
cost_change_percent = ((current_cost - previous_cost) / previous_cost) * 100
```

---

## 2. Energy Intensity Endpoint

### Endpoint
```
GET /dashboard/energy-intensity?range=30d
```

### Request Parameters (Optional)
```typescript
interface EnergyIntensityParams {
  range?: "7d" | "30d" | "90d" | "1y"  // Default: current month
  start_date?: string                   // YYYY-MM-DD format
  end_date?: string                     // YYYY-MM-DD format
}
```

### Response Structure
```typescript
interface EnergyIntensity {
  intensity: number                     // kWh per square foot (e.g., 47)
  current_usage: number                 // Total kWh used so far in period
  predicted_usage: number               // Forecasted total kWh for full period
  usage_history: Array<{
    date: string                        // Date label (e.g., "Jun", "Jun 15")
    value: number                       // Energy usage in kWh
  }>
  carbon_till_date: number              // CO₂ emissions till now (Kg)
  carbon_predicted: number              // Projected CO₂ for full period (Kg)
  green_energy_percent: number          // Percentage from renewables (0-100)
}
```

### Example Response
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

### Frontend Usage
Used in three cards:
1. **Usage Estimate Card** (Line chart with usage_history)
2. **Energy Intensity Card** (Donut gauge showing intensity)
3. **Carbon Footprint Card** (Emissions tracking and green energy %)

### Calculation Guide
```python
# Calculate intensity (assuming building area is 3200 sqft)
building_area = 3200  # sqft
total_consumption = 150320  # kWh for the period
intensity = total_consumption / building_area  # = 47 kWh/sqft

# Generate usage history (4-5 data points)
# Sample points across the time period to show trend

# Calculate carbon emissions
kwh_to_kg_co2 = 0.385  # Conversion factor (varies by region)
carbon_till_date = current_usage * kwh_to_kg_co2
carbon_predicted = predicted_usage * kwh_to_kg_co2

# Green energy percentage
green_energy_percent = (green_kwh / total_kwh) * 100
```

---

## 3. Active Appliances Endpoint

### Endpoint
```
GET /dashboard/active-appliances?range=30d
```

### Request Parameters (Optional)
```typescript
interface ActiveAppliancesParams {
  range?: "7d" | "30d" | "90d" | "1y"  // Default: current period
  start_date?: string                   // YYYY-MM-DD format
  end_date?: string                     // YYYY-MM-DD format
}
```

### Response Structure
```typescript
interface Appliance {
  name: string                          // E.g., "Heating & AC"
  usage: number                         // Current usage in kWh
  maxUsage?: number                     // Max typical usage (for scaling)
}

type ActiveAppliancesResponse = Appliance[]  // Array of appliances
```

### Example Response
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

### Frontend Usage
Used in:
1. **Active Appliances Card** (Horizontal bars with progress indicators)
   - Shows each appliance
   - Bar width = (usage / maxUsage) * 100%

### Calculation Guide
```python
# Get top 4-5 active appliances
# Calculate average/current usage for each
# Determine max typical usage for scaling

# Example structure:
appliances = [
    {"name": "Heating & AC", "usage": 1.4, "maxUsage": 2},
    {"name": "EV Charge", "usage": 0.9, "maxUsage": 2},
    {"name": "Plug Loads", "usage": 0.8, "maxUsage": 2},
    {"name": "Refrigeration", "usage": 0.7, "maxUsage": 2},
    {"name": "Lighting", "usage": 0.5, "maxUsage": 1.5}
]
```

---

## 4. Existing Endpoints (Already Implemented)

These endpoints continue to work as before:

### GET /dashboard/kpis
```typescript
interface KPIs {
  total_energy: number
  avg_daily: number
  peak_kwh: number
  energy_saved: number
  over_consumption_percent: number
  co2_emissions: number
  system_status: "stable" | "at-risk" | "critical"
  sustainability_status: "on-track" | "deviating" | "exceeding"
  last_updated: string
}
```

### GET /dashboard/energy-trend
```typescript
interface EnergyTrendPoint {
  date: string
  actual: number
  baseline: number
}

type EnergyTrendResponse = EnergyTrendPoint[]
```

### GET /dashboard/deviation-over-time
```typescript
interface DeviationPoint {
  date: string
  deviation: number
}

type DeviationResponse = DeviationPoint[]
```

### GET /dashboard/zone-energy-distribution
```typescript
interface ZoneEnergy {
  zone: string
  energy: number
}

type ZoneEnergyResponse = ZoneEnergy[]
```

---

## Frontend Type Definitions

Here's how the frontend types these:

```typescript
// Cost Metrics Hook Return
{
  totalCost: number
  electricityCost: number
  gasCost: number
  previousCost: number
  currentCost: number
  previousMonth: string
  currentMonth: string
  costChangePercent: number
}

// Energy Intensity Hook Return
{
  intensity: number
  currentUsage: number
  predictedUsage: number
  usageHistory: Array<{date: string, value: number}>
  carbonTillDate: number
  carbonPredicted: number
  greenEnergyPercent: number
}

// Active Appliances Hook Return
Array<{
  name: string
  usage: number
  maxUsage?: number
}>
```

---

## Data Transformation Pipeline

```
Backend API Response
        ↓
Frontend Hook (use-dashboard-data.ts)
        ↓
Transform snake_case → camelCase
        ↓
Add fallback defaults
        ↓
React Query caching
        ↓
Component receives data
        ↓
Chart/UI rendering
```

---

## Sample Data for Testing

### Sample Cost Metrics
```json
{
  "total_cost": 500.75,
  "electricity_cost": 350.50,
  "gas_cost": 150.25,
  "previous_cost": 475.00,
  "current_cost": 500.75,
  "previous_month": "April",
  "current_month": "May",
  "cost_change_percent": 5.47
}
```

### Sample Energy Intensity
```json
{
  "intensity": 52.3,
  "current_usage": 245.8,
  "predicted_usage": 512.4,
  "usage_history": [
    {"date": "May 1", "value": 180},
    {"date": "May 10", "value": 220},
    {"date": "May 20", "value": 240},
    {"date": "May 31", "value": 512}
  ],
  "carbon_till_date": 94.6,
  "carbon_predicted": 197.3,
  "green_energy_percent": 45
}
```

### Sample Active Appliances
```json
[
  {"name": "HVAC System", "usage": 2.3, "maxUsage": 3},
  {"name": "Water Heating", "usage": 1.8, "maxUsage": 2.5},
  {"name": "Computers", "usage": 1.2, "maxUsage": 2},
  {"name": "Lighting", "usage": 0.9, "maxUsage": 1.5},
  {"name": "Equipment", "usage": 0.8, "maxUsage": 1.5}
]
```

---

## Error Handling

If an endpoint fails or returns an error, the frontend uses these defaults:

```typescript
// Default Cost Metrics
{
  totalCost: 300,
  electricityCost: 214,
  gasCost: 86,
  previousCost: 203,
  currentCost: 214,
  previousMonth: "May",
  currentMonth: "Jun",
  costChangePercent: 5.42
}

// Default Energy Intensity
{
  intensity: 47,
  currentUsage: 164.1,
  predictedUsage: 439,
  usageHistory: [...],
  carbonTillDate: 36.4,
  carbonPredicted: 181.8,
  greenEnergyPercent: 60
}

// Default Appliances
[
  { name: "Heating & AC", usage: 1.4, maxUsage: 2 },
  { name: "EV Charge", usage: 0.9, maxUsage: 2 },
  { name: "Plug Loads", usage: 0.8, maxUsage: 2 },
  { name: "Refrigeration", usage: 0.7, maxUsage: 2 }
]
```

---

## Validation Notes

- All numeric fields should be valid numbers (int or float)
- All string fields should be non-empty
- Arrays should be JSON arrays (not null)
- Percentages should be 0-100 range
- Dates should follow standard formats (e.g., "2024-06-15" or "Jun")

---

## Common Mistakes to Avoid

❌ Returning nested `{ data: {...} }` wrappers
✅ Return the object directly

❌ Using different field names than specified
✅ Use exact field names (including snake_case)

❌ Missing required fields
✅ Include all fields in spec

❌ Wrong data types (string vs number)
✅ Use correct types as specified

❌ Inconsistent date formats
✅ Use consistent date format throughout

---

That's it! These data structures should match exactly for the dashboard to work perfectly.
