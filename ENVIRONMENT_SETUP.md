# Environment Setup Guide

Complete instructions for setting up virtual environments and installing all dependencies for both frontend and backend.

## Table of Contents

1. [Frontend Setup (Next.js)](#frontend-setup)
2. [Backend Setup (FastAPI)](#backend-setup)
3. [Troubleshooting](#troubleshooting)
4. [Verification Steps](#verification-steps)
5. [Development Workflow](#development-workflow)

---

## Frontend Setup

### Prerequisites

- **Node.js** 18.17+ or 20+ (check with `node --version`)
- **npm** 9+, **yarn** 1.22+, **pnpm** 8+, or **bun** 1.0+ (any modern package manager)

### Installation Steps

#### Step 1: Navigate to Frontend Directory

```bash
cd EN_VISION_FE
```

#### Step 2: Install Dependencies

**Using npm (most common):**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm (faster):**
```bash
pnpm install
```

**Using bun (fastest):**
```bash
bun install
```

**What it does:**
- Downloads all dependencies listed in `package.json`
- Creates a `node_modules/` folder (can be large ~500MB)
- Locks versions using `package-lock.json` (npm) or equivalent

#### Step 3: Create Environment Configuration

```bash
# Copy the example environment file
cp .env.local.example .env.local
```

Edit `.env.local` and set:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000

# Development/Production
NODE_ENV=development
```

#### Step 4: Verify Installation

```bash
npm run build
```

This compiles TypeScript and ensures everything is set up correctly.

### Running the Frontend

```bash
npm run dev
```

Output should show:
```
> EN_VISION_FE@0.1.0 dev
> next dev

  ▲ Next.js 16.0.10
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Visit: http://localhost:3000

---

## Backend Setup

### Prerequisites

- **Python** 3.9+ (check with `python --version`)
- **pip** (comes with Python, check with `pip --version`)
- **PostgreSQL** 12+ (for database)

### Installation Steps

#### Step 1: Navigate to Backend Directory

```bash
cd EN_VISION_BE
```

#### Step 2: Create Python Virtual Environment

A virtual environment isolates Python packages for this project.

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows (Command Prompt):**
```bash
python -m venv venv
venv\Scripts\activate.bat
```

**On Windows (PowerShell):**
```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

**Verify activation:**
- Your terminal prompt should show `(venv)` prefix
- Check with: `which python` (macOS/Linux) or `where python` (Windows)

#### Step 3: Upgrade pip

```bash
pip install --upgrade pip
```

#### Step 4: Install Dependencies

```bash
pip install -r requirements.txt
```

**What it installs:**
- `fastapi` - Web framework
- `uvicorn` - Server
- `sqlalchemy` - Database ORM
- `psycopg2-binary` - PostgreSQL adapter
- `pandas` - Data manipulation
- `python-multipart` - File uploads

#### Step 5: Create Environment Configuration

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Environment
ENV=development

# Frontend CORS Origins
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001

# Database (if using PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/en_vision

# Server
HOST=0.0.0.0
PORT=8000
```

#### Step 6: Verify Installation

```bash
python -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"
python -c "import sqlalchemy; print(f'SQLAlchemy {sqlalchemy.__version__}')"
```

### Running the Backend

```bash
python main.py
```

Or with uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

Visit: http://localhost:8000/docs (API documentation)

---

## Troubleshooting

### Frontend Issues

#### ❌ `npm install` fails with "ERR!"

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete old files
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### ❌ Port 3000 already in use

**Solution (macOS/Linux):**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
npm run dev -- -p 3001
```

**Solution (Windows):**
```bash
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### ❌ Module not found errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next node_modules package-lock.json

# Reinstall everything
npm install
npm run build
```

### Backend Issues

#### ❌ Virtual environment not activating

**macOS/Linux:**
```bash
# Try absolute path
source ./venv/bin/activate

# Or use Python directly
./venv/bin/python -m pip install -r requirements.txt
```

**Windows:**
```bash
# Try from project root
.\venv\Scripts\activate.bat
```

#### ❌ `pip install` fails

**Solution:**
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install with verbose output to see errors
pip install -r requirements.txt -v

# Or try without cache
pip install --no-cache-dir -r requirements.txt
```

#### ❌ ModuleNotFoundError: No module named 'fastapi'

**Solution:**
```bash
# Verify venv is activated (should show (venv) in prompt)
which python  # macOS/Linux
where python  # Windows

# Reinstall within venv
pip install fastapi uvicorn sqlalchemy psycopg2-binary pandas python-multipart
```

#### ❌ Port 8000 already in use

**Solution (macOS/Linux):**
```bash
lsof -ti:8000 | xargs kill -9
# Or run on different port
python main.py --port 8001
```

**Solution (Windows):**
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

---

## Verification Steps

### Frontend Verification

```bash
# 1. Check Node.js installation
node --version  # Should be 18.17+
npm --version   # Should be 9+

# 2. Check dependencies installed
npm list react  # Should show version
npm list next   # Should show 16.0.10

# 3. Check env file
cat .env.local  # Should show API_BASE_URL

# 4. Try building
npm run build

# 5. Start dev server
npm run dev
```

### Backend Verification

```bash
# 1. Check Python installation
python --version  # Should be 3.9+
pip --version     # Should match Python version

# 2. Verify venv activation
which python  # macOS/Linux (should show venv path)
where python  # Windows (should show venv path)

# 3. Check installed packages
pip list  # Should show fastapi, uvicorn, sqlalchemy, etc.

# 4. Verify specific imports
python -c "import fastapi, sqlalchemy, pandas; print('✓ All modules available')"

# 5. Test FastAPI
python main.py
# Visit: http://localhost:8000/docs
```

---

## Development Workflow

### Daily Development

```bash
# Terminal 1: Start Backend
cd EN_VISION_BE
source venv/bin/activate  # or venv\Scripts\activate on Windows
python main.py

# Terminal 2: Start Frontend
cd EN_VISION_FE
npm run dev
```

### Installing New Dependencies

**Frontend:**
```bash
npm install package-name
npm install -D package-name  # Dev dependency
```

**Backend:**
```bash
# Activate venv first!
source venv/bin/activate

pip install package-name
pip freeze > requirements.txt  # Update requirements.txt
```

### Deactivating Virtual Environment

When done developing:

```bash
deactivate  # Works on all platforms when venv is activated
```

### Cleaning Up

If you need to start fresh:

**Frontend:**
```bash
rm -rf node_modules package-lock.json .next
npm install
```

**Backend:**
```bash
deactivate  # If venv is active
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## System Requirements Summary

| Component | Requirement | Check Command |
|-----------|-------------|----------------|
| Node.js | 18.17+ | `node --version` |
| npm | 9+ | `npm --version` |
| Python | 3.9+ | `python --version` |
| pip | Latest | `pip --version` |
| PostgreSQL | 12+ | `psql --version` |
| Git | Any | `git --version` |

---

## Quick Reference

### Complete Fresh Setup

```bash
# Frontend
cd EN_VISION_FE
npm install
cp .env.local.example .env.local
npm run dev  # Visit http://localhost:3000

# Backend (different terminal)
cd EN_VISION_BE
python3 -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
python main.py  # Visit http://localhost:8000/docs
```

### Running Both Services

```bash
# Terminal 1
cd EN_VISION_BE && source venv/bin/activate && python main.py

# Terminal 2
cd EN_VISION_FE && npm run dev
```

Both should now be running and communicating with each other!

---

## Next Steps

1. ✓ Install dependencies (this guide)
2. → Configure environment variables
3. → Run verification checks
4. → Start both services
5. → Check dashboard loads data
6. → Review INTEGRATION_FIXES.md for API details

**Need help?** Check the specific troubleshooting section above or review QUICK_START.md.
