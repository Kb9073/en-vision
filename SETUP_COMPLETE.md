# Complete Setup & Installation Guide

Your comprehensive guide to setting up the EN-Vision project with virtual environments and all dependencies.

## Quick Start (5 minutes)

### Automated Setup

#### macOS/Linux:
```bash
# Navigate to project root and run:
bash setup.sh
```

#### Windows:
```bash
# Navigate to project root and run:
setup.bat
```

The script will automatically:
- ✓ Check system requirements
- ✓ Create Python virtual environment
- ✓ Install all dependencies
- ✓ Setup environment files
- ✓ Verify installation

---

## Manual Setup

If you prefer manual setup or the script doesn't work, follow these steps:

### Prerequisites

- **Node.js 18.17+** - [Download](https://nodejs.org)
- **Python 3.9+** - [Download](https://www.python.org)
- **Git** (optional) - [Download](https://git-scm.com)

**Verify Installation:**
```bash
node --version    # Should be v18.17+
npm --version     # Should be 9+
python --version  # Should be 3.9+
pip --version     # Should be 21+
```

---

## Step 1: Backend Setup

### Create Virtual Environment

```bash
cd EN_VISION_BE

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows (Command Prompt)
python -m venv venv
venv\Scripts\activate.bat

# Windows (PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1
```

**You should see `(venv)` in your terminal prompt**

### Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**What gets installed:**
- FastAPI - Web framework
- Uvicorn - Server
- SQLAlchemy - Database ORM
- psycopg2-binary - PostgreSQL support
- Pandas & NumPy - Data processing
- Pydantic - Data validation
- python-dotenv - Environment variables

### Setup Environment

```bash
# Copy template
cp .env.example .env

# Edit .env (optional - defaults are fine for local dev)
# Modify if you need different database or CORS settings
```

### Verify Setup

```bash
python -c "import fastapi, sqlalchemy; print('✓ Backend ready')"
```

---

## Step 2: Frontend Setup

### Install Dependencies

```bash
cd EN_VISION_FE

npm install
# or: yarn install / pnpm install / bun install
```

**What gets installed (~500MB):**
- Next.js 16
- React 19
- TailwindCSS
- Radix UI components
- React Query
- Zod validation
- And 30+ other packages

### Setup Environment

```bash
# Copy template
cp .env.local.example .env.local

# Edit .env.local (optional - defaults are fine)
# Default: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Verify Setup

```bash
npm run build
# Should complete without errors
```

---

## Step 3: Running the Application

### Terminal 1: Start Backend

```bash
cd EN_VISION_BE
source venv/bin/activate        # macOS/Linux
# or: venv\Scripts\activate.bat # Windows

python main.py
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**API Documentation:** http://localhost:8000/docs

### Terminal 2: Start Frontend

```bash
cd EN_VISION_FE
npm run dev
```

**Expected output:**
```
> next dev
▲ Next.js 16.0.10
- Local: http://localhost:3000
✓ Ready in 2.5s
```

**Application:** http://localhost:3000

---

## Verification Checklist

- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Dashboard loads without errors
- [ ] No console errors in browser
- [ ] Can see data in tables/charts

---

## What Gets Installed

### Frontend (npm packages)

**Core:** Next.js, React, React DOM, TypeScript

**UI Components:** 30+ Radix UI components, Tailwind CSS, Framer Motion

**Data:** React Query, Axios, Zod

**Forms:** React Hook Form, @hookform/resolvers

**Charts:** Recharts

**Utilities:** date-fns, Lucide icons, Sonner toast, next-themes

**Total Size:** ~500MB

### Backend (pip packages)

**Web:** FastAPI, Uvicorn, Python-multipart

**Database:** SQLAlchemy, psycopg2-binary

**Data:** Pandas, NumPy

**Config:** Pydantic, python-dotenv

**Total Size:** ~200MB (Python venv)

---

## Environment Configuration

### Frontend (.env.local)

```env
# API Endpoint
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Timeout (milliseconds)
NEXT_PUBLIC_API_TIMEOUT=10000

# Development flag
NODE_ENV=development
```

### Backend (.env)

```env
# Environment
ENV=development

# CORS - Allowed Frontend Origins
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/en_vision

# Server
HOST=0.0.0.0
PORT=8000
```

---

## Common Tasks

### Installing New Frontend Package

```bash
cd EN_VISION_FE
npm install package-name

# For dev dependencies
npm install -D package-name
```

### Installing New Backend Package

```bash
cd EN_VISION_BE
source venv/bin/activate  # Activate venv first!
pip install package-name
pip freeze > requirements.txt  # Update requirements
```

### Deactivating Virtual Environment

```bash
deactivate
```

### Fresh Start (Clean Install)

**Frontend:**
```bash
cd EN_VISION_FE
rm -rf node_modules package-lock.json .next
npm install
```

**Backend:**
```bash
cd EN_VISION_BE
deactivate 2>/dev/null  # If venv is active
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## Troubleshooting

### Backend Issues

**Virtual environment not found:**
```bash
# Recreate it
cd EN_VISION_BE
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Port 8000 already in use:**
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Module not found:**
```bash
# Ensure venv is activated (look for (venv) in prompt)
which python  # or 'where python' on Windows

# Should show path inside venv folder
```

### Frontend Issues

**npm install fails:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Port 3000 already in use:**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
npm run dev -- -p 3001

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Build errors:**
```bash
rm -rf .next
npm run build
```

---

## Performance Tips

### Backend
- Use `--reload` flag during development for auto-restart
- Database queries use proper indexing
- API caching configured with React Query

### Frontend
- Lazy loading enabled for routes
- Image optimization enabled
- Code splitting automatic with Next.js
- Tailwind CSS purges unused styles

---

## System Requirements Summary

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Node.js | 18.17 | 20+ |
| Python | 3.9 | 3.11+ |
| RAM | 4GB | 8GB+ |
| Disk Space | 2GB | 5GB+ |
| OS | macOS 10.15+ / Windows 10 / Ubuntu 18.04+ | Latest |

---

## Next Steps After Setup

1. ✓ Run setup (this guide)
2. → Verify both services are running
3. → Read QUICK_START.md for development tips
4. → Check INTEGRATION_FIXES.md for API details
5. → Review ARCHITECTURE.md for system design

---

## Getting Help

### Setup Issues
- See ENVIRONMENT_SETUP.md for detailed troubleshooting
- See DEPENDENCIES.md for package details

### Integration Issues
- See INTEGRATION_FIXES.md for API integration details
- Check README_INTEGRATION.md for full guide

### Architecture
- See ARCHITECTURE.md for system design
- See IMPLEMENTATION_SUMMARY.md for technical details

---

## Documentation Index

- **ENVIRONMENT_SETUP.md** - Detailed environment setup (recommended read)
- **DEPENDENCIES.md** - All packages and versions
- **QUICK_START.md** - 5-minute quick reference
- **INTEGRATION_FIXES.md** - What was fixed
- **ARCHITECTURE.md** - System design
- **README_INTEGRATION.md** - Integration guide
- **DEPLOYMENT_CHECKLIST.md** - Before going live

---

## Ready?

Run the automated setup script, or follow the manual steps above. Both should take about 5-10 minutes depending on your internet speed.

**Questions?** Check the docs or see the troubleshooting section above.

**Good luck! 🚀**
