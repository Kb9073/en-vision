# EN-Vision Frontend-Backend Integration - Quick Start

## 5-Minute Setup

### Step 1: Frontend Configuration
```bash
cd EN_VISION_FE

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local - set your backend URL
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# NEXT_PUBLIC_ENV=development

# Install dependencies
npm install

# Start frontend
npm run dev
```

### Step 2: Backend Configuration
```bash
cd EN_VISION_BE

# Copy environment template  
cp .env.example .env

# Edit .env - ensure CORS is configured
# ENV=development
# ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Install dependencies (if not done)
pip install -r requirements.txt

# Start backend
python main.py
```

### Step 3: Verify Connection
Open browser console and look for:
- No CORS errors
- Successful API calls in Network tab
- Data loading in dashboard

---

## Key Fixes Applied

1. **No More Hardcoded URLs** - Use environment variables
2. **Automatic Retries** - Failed requests retry automatically (3x)
3. **CORS Fixed** - Backend now accepts frontend requests
4. **Type Safety** - All API responses validated with Zod
5. **Better Caching** - React Query optimized for dashboards
6. **Error Handling** - Consistent error messages and logging

---

## Troubleshooting

### Frontend can't reach backend?
```
1. Check frontend .env.local has correct NEXT_PUBLIC_API_BASE_URL
2. Verify backend is running on that URL
3. Open browser Network tab, check if requests go out
4. Check for CORS errors in console
```

### CORS error?
```
1. Check backend .env has ALLOWED_ORIGINS set
2. Verify it includes http://localhost:3000 (or your frontend URL)
3. Restart backend after changing .env
```

### API 404 errors?
```
1. Verify backend routes exist and are registered
2. Check endpoint paths match (case-sensitive)
3. Verify database tables exist
4. Check backend logs for import errors
```

### Timeouts?
```
1. Increase NEXT_PUBLIC_API_TIMEOUT to 60000
2. Check backend is responsive (not hanging)
3. Check network latency
4. Verify backend isn't overwhelmed with requests
```

---

## Files Changed

### Frontend (`EN_VISION_FE/`)
- ✅ `.env.local.example` - Template for environment variables
- ✅ `lib/config.ts` - New: Configuration management
- ✅ `lib/api/axios.ts` - Enhanced with retry & error handling
- ✅ `lib/api/client.ts` - New: Type-safe API wrapper
- ✅ `lib/api/schemas.ts` - New: Zod validation schemas
- ✅ `lib/api/errors.ts` - New: Error utilities
- ✅ `lib/api/dashboard.ts` - Updated with new client
- ✅ `components/providers.tsx` - Enhanced React Query config

### Backend (`EN_VISION_BE/`)
- ✅ `.env.example` - Template for environment variables
- ✅ `main.py` - Enhanced CORS configuration

---

## Architecture

```
Frontend Request Flow:
┌─────────────────────────────────────────────┐
│ React Component (useQuery hook)             │
├─────────────────────────────────────────────┤
│ ↓                                           │
│ API Hook (useDashboardKPIs, etc.)          │
├─────────────────────────────────────────────┤
│ ↓                                           │
│ Dashboard API Function (getKPIs, etc.)     │
├─────────────────────────────────────────────┤
│ ↓                                           │
│ API Client Wrapper (type-safe, validates)  │
├─────────────────────────────────────────────┤
│ ↓                                           │
│ Axios Instance (retries, error handling)   │
├─────────────────────────────────────────────┤
│ ↓ (Network Request)                         │
│ Backend API                                 │
└─────────────────────────────────────────────┘
```

---

## Environment Variables Reference

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_ENV=development
```

### Backend (.env)
```
ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

---

## Performance Tips

1. **Caching** - Data stays fresh for 30s, cached for 5 minutes
2. **Refetch** - Only on manual refresh, not window focus
3. **Retry** - Automatic on network/server errors
4. **Devtools** - Use React Query Devtools to monitor (dev only)

---

## Next: Add Features

Once integration is working, add:
1. Authentication & tokens
2. User preferences
3. Data export
4. Real-time updates (WebSocket)
5. Advanced filtering
6. Custom dashboards

See `INTEGRATION_FIXES.md` for detailed documentation.
