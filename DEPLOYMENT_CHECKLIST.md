# EN-Vision Integration - Deployment Checklist

## Pre-Deployment

### Code Quality
- [ ] All TypeScript files compile without errors
- [ ] No console.error or console.warn in production code
- [ ] All API calls wrapped in try-catch
- [ ] Error messages are user-friendly
- [ ] No hardcoded URLs or credentials

### Testing
- [ ] Frontend connects to backend successfully
- [ ] All dashboard components render without errors
- [ ] API calls complete and return expected data
- [ ] Network tab shows successful requests
- [ ] React Query devtools shows cache working
- [ ] Error scenarios tested (backend down, network error)

### Configuration
- [ ] Frontend `.env.local` created and configured
- [ ] Backend `.env` created and configured
- [ ] CORS origins match deployment URLs
- [ ] API timeout set appropriately
- [ ] Environment set to correct stage (dev/staging/prod)

---

## Development Environment

### Frontend Setup
```bash
# Clone and install
git clone <repo>
cd EN_VISION_FE
npm install

# Create .env.local
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
# NEXT_PUBLIC_ENV=development

# Start development server
npm run dev
# Frontend at http://localhost:3000

# Verify
✓ Open http://localhost:3000 in browser
✓ Check Console for no errors
✓ Dashboard loads with data
```

### Backend Setup
```bash
# Clone and install
git clone <repo>
cd EN_VISION_BE
pip install -r requirements.txt

# Create .env
cp .env.example .env

# Edit .env
# ENV=development
# ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Start backend
python main.py
# Backend at http://localhost:8000

# Verify
✓ Open http://localhost:8000 in browser
✓ See welcome message
✓ API endpoints accessible
```

### Integration Verification
```bash
# Open browser DevTools → Console
# Check for:
✓ No CORS errors
✓ API requests success (200 status)
✓ Dashboard data loads
✓ Charts render
✓ No JavaScript errors

# Network tab should show:
✓ OPTIONS preflight requests (200)
✓ GET requests to /dashboard/* (200)
✓ Response headers include CORS headers
```

---

## Staging Deployment

### Prerequisites
- [ ] Server/hosting prepared
- [ ] Database migrated/populated
- [ ] SSL certificates obtained
- [ ] DNS configured

### Frontend Deployment
```bash
# Build for staging
NEXT_PUBLIC_API_BASE_URL=https://staging-api.example.com \
NEXT_PUBLIC_ENV=staging \
npm run build

# Verify build output
- [ ] .next/ folder created
- [ ] No build errors
- [ ] Size reasonable

# Deploy to hosting (Vercel/Netlify/Custom)
- [ ] Deploy successful
- [ ] DNS resolves
- [ ] HTTPS working
- [ ] Staging URL accessible
```

### Backend Deployment
```bash
# Prepare backend
- [ ] Dependencies installed
- [ ] Database configured
- [ ] .env file with staging values
- [ ] Staging URL added to ALLOWED_ORIGINS

# Deploy
- [ ] Backend service running
- [ ] Port exposed correctly
- [ ] CORS headers in responses
- [ ] API endpoints responding

# Verify
- [ ] Health check endpoint works
- [ ] Database connection valid
- [ ] Tables exist with data
- [ ] No startup errors
```

### Staging Testing
```
Test Matrix:
┌─────────────────────┬──────────────────────┐
│ Scenario            │ Expected Result      │
├─────────────────────┼──────────────────────┤
│ Frontend loads      │ Dashboard visible    │
│ Click refresh       │ Data updates         │
│ Slow network        │ Request retries      │
│ Intermittent error  │ Auto-recover in 7s   │
│ Invalid response    │ Error logged         │
│ Browser refresh     │ Data reloads         │
│ Mobile browser      │ Responsive layout    │
│ Different browser   │ Works same           │
└─────────────────────┴──────────────────────┘

Checklist:
- [ ] All tests pass
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Load times < 3s
- [ ] Charts render correctly
- [ ] Mobile responsive
```

---

## Production Deployment

### Pre-Flight Checks
- [ ] All staging tests passed
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Database backups ready
- [ ] Rollback plan prepared
- [ ] Monitoring configured
- [ ] Alerting configured
- [ ] Runbook prepared

### Frontend Production Build
```bash
# Build with production settings
NEXT_PUBLIC_API_BASE_URL=https://api.example.com \
NEXT_PUBLIC_ENV=production \
NEXT_PUBLIC_API_TIMEOUT=30000 \
npm run build

# Verify build
- [ ] Build succeeded
- [ ] No warnings
- [ ] Output size < 500KB
- [ ] Source maps generated

# Deploy to CDN
- [ ] Files uploaded
- [ ] CDN cache cleared
- [ ] HTTPS verified
- [ ] DNS pointed
- [ ] Health check passes
```

### Backend Production Deployment
```bash
# Verify configuration
- [ ] ENV=production
- [ ] ALLOWED_ORIGINS=https://app.example.com only
- [ ] Database credentials correct
- [ ] Log level set to INFO
- [ ] Rate limiting enabled
- [ ] Error tracking enabled

# Deploy
- [ ] Load balancer configured
- [ ] Multiple instances running
- [ ] Health checks passing
- [ ] Auto-scaling configured
- [ ] Backup running
```

### Post-Deployment Verification
```
✓ Health check endpoint responds
✓ API endpoints return correct data
✓ Frontend connects to backend
✓ Error handling working
✓ Retries working
✓ CORS headers present
✓ Monitoring showing normal metrics
✓ No error spikes in logs
✓ Response times normal
✓ Database queries performing
```

---

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Frontend load time | < 2s | ? |
| API response time | < 500ms | ? |
| Cache hit rate | > 70% | ? |
| API success rate | > 99.5% | ? |
| Error rate | < 0.5% | ? |
| Uptime | > 99.9% | ? |

---

## Monitoring & Alerting

### Key Metrics to Monitor
```
Frontend:
- [ ] Page load time
- [ ] Time to interactive
- [ ] JavaScript error rate
- [ ] Network requests count

Backend:
- [ ] Request latency
- [ ] Error rate
- [ ] Database query time
- [ ] CPU usage
- [ ] Memory usage
- [ ] Disk usage

Application:
- [ ] API success rate
- [ ] Retry rate
- [ ] Cache hit rate
- [ ] User login rate
```

### Alert Thresholds
```
Critical:
- API error rate > 5%
- Response time > 5s
- Frontend error rate > 2%
- Database connection failed

Warning:
- API error rate > 1%
- Response time > 1s
- CPU usage > 80%
- Memory usage > 85%
```

### Monitoring Tools Setup
- [ ] Error tracking: Sentry/Datadog
- [ ] Performance: New Relic/APM
- [ ] Uptime: Pingdom/Uptime Robot
- [ ] Logs: CloudWatch/ELK
- [ ] Alerts: Slack/PagerDuty

---

## Troubleshooting Guide

### If Frontend Can't Connect to Backend
```
Debug Steps:
1. [ ] Check frontend .env has correct API_BASE_URL
2. [ ] Verify backend is running and responding
3. [ ] Check Network tab for requests
4. [ ] Look for CORS error in console
5. [ ] Check backend CORS configuration
6. [ ] Verify DNS resolution

Fix:
- Update NEXT_PUBLIC_API_BASE_URL in .env
- Restart frontend (npm run dev)
- Clear browser cache (Ctrl+Shift+Del)
- Test with curl: curl http://backend-url/
```

### If Requests Are Timing Out
```
Debug Steps:
1. [ ] Check response times in Network tab
2. [ ] Monitor backend CPU/memory
3. [ ] Check database query performance
4. [ ] Review backend logs for errors
5. [ ] Check network latency

Fix:
- Increase NEXT_PUBLIC_API_TIMEOUT
- Optimize database queries
- Add database indexes
- Scale backend horizontally
- Enable caching on backend
```

### If CORS Error Occurs
```
Debug Steps:
1. [ ] Check OPTIONS preflight request
2. [ ] Verify ALLOWED_ORIGINS in .env
3. [ ] Check response headers
4. [ ] Verify frontend URL matches ALLOWED_ORIGINS

Fix:
- Update ALLOWED_ORIGINS to include frontend URL
- Restart backend
- Clear browser cache
- Try in incognito mode
```

### If Data Is Stale or Not Updating
```
Debug Steps:
1. [ ] Open React Query Devtools
2. [ ] Check cache status
3. [ ] Verify stale time not too long
4. [ ] Check refetch intervals

Fix:
- Manually refresh page (F5)
- Lower stale time in config
- Increase refetch interval
- Clear React Query cache
```

---

## Rollback Plan

### If Critical Issue Found
```
Immediate (within 5 mins):
1. [ ] Stop deployment
2. [ ] Revert to previous version
3. [ ] Clear CDN cache
4. [ ] Notify team

Short-term (within 1 hour):
1. [ ] Root cause analysis
2. [ ] Fix identified issue
3. [ ] Full testing
4. [ ] Re-deploy carefully

Document:
- [ ] What went wrong
- [ ] How it was fixed
- [ ] Preventive measures
- [ ] Update playbook
```

### Rollback Commands
```bash
# Frontend Rollback (if using Vercel)
vercel rollback --prod

# Backend Rollback (manual)
# 1. Stop current deployment
# 2. Revert .env file
# 3. Restart with previous code
# 4. Verify health checks

# Database Rollback
# 1. Restore from backup
# 2. Verify data integrity
# 3. Resume services
```

---

## Post-Deployment

### Day 1 Monitoring
- [ ] Check error tracking dashboard
- [ ] Review API response times
- [ ] Verify caching working
- [ ] Monitor user feedback
- [ ] Check support tickets

### Week 1 Review
- [ ] Analyze performance metrics
- [ ] Review error logs
- [ ] Gather user feedback
- [ ] Plan improvements
- [ ] Document lessons learned

### Ongoing
- [ ] Weekly performance review
- [ ] Monthly optimization passes
- [ ] Quarterly security audits
- [ ] Annual architecture review

---

## Documentation

### Create/Update
- [ ] Deployment documentation
- [ ] System architecture docs
- [ ] Operations runbook
- [ ] Troubleshooting guide
- [ ] Release notes
- [ ] API documentation

### Share With
- [ ] Development team
- [ ] Operations team
- [ ] Support team
- [ ] Management

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Developer | | | |
| QA Lead | | | |
| DevOps Lead | | | |
| Product Manager | | | |
| Stakeholder | | | |

---

## Version History

| Version | Date | Changes | Deployed By |
|---------|------|---------|-------------|
| 1.0.0 | TBD | Initial release | |
| 1.0.1 | | Bug fixes | |
| 1.1.0 | | New features | |

---

## Emergency Contacts

| Role | Name | Phone | Email |
|------|------|-------|-------|
| On-Call Developer | | | |
| DevOps Engineer | | | |
| Database Admin | | | |
| Security Team | | | |

---

## Notes

```
General Notes:
- Keep this checklist updated
- Review before each deployment
- Document all deviations
- Share lessons learned
- Improve process continuously
```
