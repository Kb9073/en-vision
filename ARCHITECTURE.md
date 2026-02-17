# EN-Vision Integration Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  React Components (Dashboard, Charts, etc.)             │      │
│  │  - useDashboardKPIs()                                   │      │
│  │  - useEnergyTrend()                                     │      │
│  │  - useAnomalies()                                       │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  React Query Provider                                   │      │
│  │  - Caching (5 minutes)                                  │      │
│  │  - Retry logic (2x)                                     │      │
│  │  - Devtools (dev only)                                  │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  API Hooks (useDashboard.ts, etc.)                      │      │
│  │  - Query key management                                 │      │
│  │  - Refresh intervals                                    │      │
│  │  - Stale time configuration                             │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Dashboard API Functions (lib/api/dashboard.ts)         │      │
│  │  - getKPIs()                                            │      │
│  │  - getEnergyTrend()                                     │      │
│  │  - getCarbonMetrics()                                   │      │
│  │  - etc.                                                 │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Type-Safe API Client (lib/api/client.ts)              │      │
│  │  - Response validation (Zod)                            │      │
│  │  - Type checking                                        │      │
│  │  - Error handling                                       │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Axios Instance (lib/api/axios.ts)                      │      │
│  │  Request Interceptor:                                   │      │
│  │  - Add auth token                                       │      │
│  │  - Set base URL (from config)                           │      │
│  │  - Add headers                                          │      │
│  │                                                          │      │
│  │  Response Interceptor:                                  │      │
│  │  - Retry failed requests (3x)                           │      │
│  │  - Exponential backoff                                  │      │
│  │  - Format errors                                        │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Environment Config (lib/config.ts)                     │      │
│  │  - NEXT_PUBLIC_API_BASE_URL                             │      │
│  │  - NEXT_PUBLIC_API_TIMEOUT                              │      │
│  │  - NEXT_PUBLIC_ENV                                      │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
                    CORS Preflight (OPTIONS)
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  CORS Middleware (main.py)                              │      │
│  │  - Check ALLOWED_ORIGINS                                │      │
│  │  - Return CORS headers                                  │      │
│  │  - Cache preflight (1 hour)                             │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  FastAPI Routes                                         │      │
│  │  - /dashboard/kpis                                      │      │
│  │  - /dashboard/energy-trend                              │      │
│  │  - /dashboard/anomalies                                 │      │
│  │  - etc.                                                 │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Business Logic                                         │      │
│  │  - Data processing                                      │      │
│  │  - Calculations                                         │      │
│  │  - Aggregations                                         │      │
│  └──────────────────────────────────────────────────────────┘      │
│                              ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐      │
│  │  Database (PostgreSQL)                                  │      │
│  │  - energy_readings                                      │      │
│  │  - carbon_emissions_daily                               │      │
│  │  - baseline_metrics                                     │      │
│  │  - etc. (16 tables)                                     │      │
│  └──────────────────────────────────────────────────────────┘      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Request-Response Flow

### Happy Path (Success)
```
┌─────────────────────────────────────────────────────────────────┐
│ User: Click "Dashboard"                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ React Hook: useDashboardKPIs()                                 │
│ - Triggered by useQuery in component                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ React Query: Check cache                                        │
│ - Is data fresh? (< 30s stale)                                 │
│ - YES: Return cached data ✓                                    │
│ - NO: Make new request ↓                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard API: getKPIs()                                        │
│ - Calls apiClient_.get()                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API Client: Validate response                                   │
│ - Parse with DashboardResponseSchema (Zod)                     │
│ - Check types match                                            │
│ - Extract .data field                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Axios Request Interceptor:                                      │
│ - Add auth token (if available)                                │
│ - Set baseURL from config                                      │
│ - Add Content-Type header                                      │
│ - Mark retry attempt: 0                                        │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP GET
                 → OPTIONS (preflight)
                   Check CORS headers
                 ← CORS OK response
                   → GET /dashboard/kpis
┌─────────────────────────────────────────────────────────────────┐
│ Backend: CORS Middleware                                        │
│ - Check origin in ALLOWED_ORIGINS ✓                            │
│ - Add response CORS headers                                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Backend: Route Handler                                          │
│ - Execute business logic                                       │
│ - Query database                                               │
│ - Format response                                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ JSON
                 ← {success: true, data: {...}}
┌─────────────────────────────────────────────────────────────────┐
│ Axios Response Interceptor:                                     │
│ - Response received ✓                                           │
│ - No retry needed                                              │
│ - Return response to API client                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ React Query: Update cache                                       │
│ - Store data                                                   │
│ - Set timestamp                                                │
│ - Mark as fresh (30s)                                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ React: Re-render component                                      │
│ - Display KPI data                                             │
│ - User sees dashboard ✓                                        │
└─────────────────────────────────────────────────────────────────┘
```

### Error Path (Network Failure)
```
┌─────────────────────────────────────────────────────────────────┐
│ HTTP Request: GET /dashboard/kpis                              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Network Error
                  (Connection refused)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Axios Response Interceptor:                                     │
│ - Error caught: network error                                  │
│ - Check retry config:                                          │
│   • Retries so far: 0                                          │
│   • Max retries: 3 ✓                                           │
│   • Error is retryable ✓                                       │
│ - Schedule retry with delay: 1000ms                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓ WAIT 1s
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ HTTP Request: GET /dashboard/kpis (Retry #1)                   │
│ - Same request, retry count: 1                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Network Error
                   (Still not responding)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Axios Response Interceptor:                                     │
│ - Error caught                                                 │
│ - Check retry config:                                          │
│   • Retries so far: 1                                          │
│   • Max retries: 3 ✓                                           │
│   • Error is retryable ✓                                       │
│ - Schedule retry with delay: 2000ms (exponential)              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ WAIT 2s
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ HTTP Request: GET /dashboard/kpis (Retry #2)                   │
│ - Same request, retry count: 2                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    Network Error
                  (Backend still down)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Axios Response Interceptor:                                     │
│ - Error caught                                                 │
│ - Check retry config:                                          │
│   • Retries so far: 2                                          │
│   • Max retries: 3 ✓                                           │
│   • Error is retryable ✓                                       │
│ - Schedule retry with delay: 4000ms (exponential)              │
└─────────────────────────────────────────────────────────────────┘
                              ↓ WAIT 4s
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ HTTP Request: GET /dashboard/kpis (Retry #3)                   │
│ - Same request, retry count: 3                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ← 200 OK Response
            {success: true, data: {...}}
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Axios Response Interceptor:                                     │
│ - Success! Return response                                     │
│ - Log: "Retry successful after 3 attempts"                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ React Query: Update cache                                       │
│ - Data received despite delays                                 │
│ - User doesn't notice the retries ✓                            │
└─────────────────────────────────────────────────────────────────┘
```

### Validation Error Path
```
┌─────────────────────────────────────────────────────────────────┐
│ Backend: Returns unexpected response format                    │
│ {success: true, data: {invalid: "format"}}                     │
└─────────────────────────────────────────────────────────────────┘
                              ↓ Response received
┌─────────────────────────────────────────────────────────────────┐
│ API Client: Validate with Zod schema                           │
│ - Expected: {value: number, delta?: number}                    │
│ - Got: {invalid: "format"}                                     │
│ - Validation FAILS ✗                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ API Client: Handle error                                        │
│ - Parse error thrown                                           │
│ - Log error with details:                                      │
│   • Expected schema                                            │
│   • Actual data                                                │
│   • Stack trace                                                │
│ - Throw enhanced error                                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard API: Catch error                                      │
│ - Log: "[Dashboard] Failed to fetch KPIs: ..."                 │
│ - Re-throw error                                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ React Query: Handle mutation/query error                        │
│ - Mark query as error                                          │
│ - Trigger error state in component                             │
│ - Component shows error message                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌────────────┐
│ Components │
└────────────┘
      ↓ (calls)
┌──────────────────┐
│ useQuery hooks   │
└──────────────────┘
      ↓ (uses)
┌──────────────────┐
│ React Query      │
│ (caching/retry)  │
└──────────────────┘
      ↓ (calls)
┌──────────────────┐
│ Dashboard API    │
│ functions        │
└──────────────────┘
      ↓ (calls)
┌──────────────────┐
│ apiClient_       │
│ (validation)     │
└──────────────────┘
      ↓ (calls)
┌──────────────────┐
│ Axios instance   │
│ (HTTP + retry)   │
└──────────────────┘
      ↓ (HTTP)
┌──────────────────┐
│ Backend API      │
└──────────────────┘
```

---

## Error Handling Strategy

```
┌─────────────────────────────┐
│ Error Occurs               │
├─────────────────────────────┤
│ Network Error?             │
│ Timeout?                   │
│ 5xx Server Error?          │
│ 429 Rate Limit?            │
└─────────────────────────────┘
          ↓
         YES → Retryable?
          ↓
    ┌─────┴─────┐
    ↓           ↓
   YES         NO
    ↓           ↓
 Retry    Get Error Info
   ↓           ↓
 1s delay  Extract Message
   ↓           ↓
 Attempt   Log Error
   ↓           ↓
  1/3      Format for User
   ↓           ↓
 ...etc    Component
           Shows Toast
```

---

## Environment Configuration

```
Development:
├── Frontend
│   └── NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
│
└── Backend
    └── ALLOWED_ORIGINS=http://localhost:3000,*

Production:
├── Frontend
│   └── NEXT_PUBLIC_API_BASE_URL=https://api.example.com
│
└── Backend
    └── ALLOWED_ORIGINS=https://app.example.com
```

---

## Performance Optimization

### Caching Strategy
```
Fresh Data (< 30s):
└─ Use cached data immediately

Stale Data (30s - 5m):
└─ Use cached data
└─ Fetch in background
└─ Update when ready

Expired Data (> 5m):
└─ Refetch on next access
└─ Show loading state
```

### Request Timing
```
Request → 100ms average
Retry attempt 1: +1000ms
Retry attempt 2: +2000ms (exponential)
Retry attempt 3: +4000ms (exponential)

Total worst case: ~7.1 seconds with 3 retries
```

---

## Deployment Architecture

### Local Development
```
Frontend: localhost:3000 ←→ Backend: localhost:8000
CORS: * (allow all in development)
Retries: 3x
Cache: 5 minutes
```

### Staging
```
Frontend: staging-app.example.com
Backend: staging-api.example.com
CORS: staging-app.example.com
Retries: 3x
Cache: 10 minutes
```

### Production
```
Frontend: app.example.com (CDN)
Backend: api.example.com (load balanced)
CORS: app.example.com only
Retries: 3x with longer delays
Cache: 15+ minutes (based on data freshness)
```

---

## Scalability Considerations

1. **Horizontal Scaling**
   - Frontend: Static hosting (no server needed)
   - Backend: Load balanced across instances
   - Database: Replicated for read performance

2. **Caching Strategy**
   - Browser cache: 5 minutes
   - Backend cache: Implement Redis
   - Database indexes: Critical fields

3. **Rate Limiting**
   - Backend: 1000 requests/min per IP
   - Frontend: Debounce rapid requests
   - Queue: Batch API calls when possible

4. **Monitoring**
   - Error tracking: Sentry
   - Performance: New Relic
   - Availability: Uptime monitoring
