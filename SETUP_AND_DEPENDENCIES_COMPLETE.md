# Virtual Environment & Dependencies Setup - COMPLETE ✓

Comprehensive guide for setting up virtual environments and installing all dependencies for EN-Vision.

---

## What Was Added

### Setup Scripts

1. **setup.sh** (macOS/Linux)
   - Automated setup script
   - Checks all requirements
   - Creates virtual environment
   - Installs dependencies
   - Sets up environment files
   - Run with: `bash setup.sh`

2. **setup.bat** (Windows)
   - Automated setup script for Windows
   - Same features as setup.sh
   - Run with: `setup.bat`

### Documentation Files

1. **SETUP_COMPLETE.md** (THIS IS YOUR START POINT)
   - Quick 5-minute setup guide
   - Manual step-by-step instructions
   - Common tasks reference
   - Troubleshooting section

2. **ENVIRONMENT_SETUP.md** (DETAILED REFERENCE)
   - Comprehensive environment setup
   - Detailed troubleshooting
   - System requirements
   - Development workflow

3. **DEPENDENCIES.md** (TECHNICAL REFERENCE)
   - All frontend packages listed
   - All backend packages listed
   - Dependency tree analysis
   - Package management commands
   - Update strategies
   - Security checking

### Updated Files

1. **EN_VISION_BE/requirements.txt**
   - Added version pinning for all packages
   - Added python-dotenv for environment variables
   - Added pydantic-settings for configuration
   - Better organized with comments

2. **EN_VISION_FE/.env.local.example**
   - Template for frontend environment
   - API base URL configuration
   - Timeout settings

3. **EN_VISION_BE/.env.example**
   - Template for backend environment
   - CORS configuration
   - Database settings

---

## Quick Start (Choose One)

### Option 1: Automated Setup (Recommended)

```bash
# macOS/Linux
bash setup.sh

# Windows
setup.bat
```

Takes 5-10 minutes. Script handles everything automatically.

### Option 2: Manual Setup

```bash
# Backend
cd EN_VISION_BE
python3 -m venv venv
source venv/bin/activate  # or: venv\Scripts\activate.bat on Windows
pip install -r requirements.txt
cp .env.example .env

# Frontend (in another terminal)
cd EN_VISION_FE
npm install
cp .env.local.example .env.local

# Start services
# Terminal 1: cd EN_VISION_BE && source venv/bin/activate && python main.py
# Terminal 2: cd EN_VISION_FE && npm run dev
```

---

## What Gets Installed

### Frontend (npm)

**Core Framework:**
- Next.js 16.0.10
- React 19.2.0
- React DOM 19.2.0
- TypeScript 5

**UI Library:**
- 30+ Radix UI components
- TailwindCSS 4.1.9
- Tailwind animations

**Data Management:**
- React Query 5.90.16
- Axios 1.13.2
- Zod 3.25.76

**Charts & Visualization:**
- Recharts 2.15.4

**Total Size:** ~500MB

### Backend (pip)

**Web Framework:**
- FastAPI 0.104.1
- Uvicorn 0.24.0

**Database:**
- SQLAlchemy 2.0.23
- psycopg2-binary 2.9.9

**Data Processing:**
- Pandas 2.1.3
- NumPy 1.26.2

**Configuration:**
- Pydantic 2.5.0
- python-dotenv 1.0.0

**Total Size:** ~200MB (Python venv)

---

## Running the Application

### After Setup is Complete

**Terminal 1 - Backend:**
```bash
cd EN_VISION_BE
source venv/bin/activate  # macOS/Linux
# or: venv\Scripts\activate.bat  # Windows
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd EN_VISION_FE
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## Understanding Virtual Environments

### What is a Virtual Environment?

A virtual environment is an isolated Python installation for your project.

**Why use it?**
- Isolate dependencies (Project A uses v1.0, Project B uses v2.0)
- Easy cleanup (just delete the folder)
- Easy sharing (requirements.txt)
- Avoid system-wide pollution

**Size:** ~200MB (just for this project)

### Creating Virtual Environment

```bash
# macOS/Linux
python3 -m venv venv

# Windows
python -m venv venv
```

This creates a `venv` folder with isolated Python.

### Activating Virtual Environment

You MUST activate before installing packages:

```bash
# macOS/Linux
source venv/bin/activate

# Windows Command Prompt
venv\Scripts\activate.bat

# Windows PowerShell
venv\Scripts\Activate.ps1
```

**Check activation:** Your prompt should show `(venv)`

### Installing Packages in Virtual Environment

```bash
# Activate first!
source venv/bin/activate

# Now install
pip install -r requirements.txt
```

### Deactivating Virtual Environment

```bash
deactivate
```

---

## Dependency Management

### Adding Packages

**Frontend:**
```bash
cd EN_VISION_FE
npm install package-name
```

**Backend:**
```bash
cd EN_VISION_BE
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt  # Update lock file
```

### Updating Packages

**Frontend:**
```bash
npm update
npm audit fix
```

**Backend:**
```bash
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

### Checking for Issues

**Frontend:**
```bash
npm audit  # Check vulnerabilities
npm list   # See all packages
npm outdated  # See outdated packages
```

**Backend:**
```bash
pip list  # See all packages
pip-audit  # Check vulnerabilities (install with: pip install pip-audit)
```

---

## System Requirements

### Minimum
- Node.js 18.17+
- Python 3.9+
- 4GB RAM
- 2GB disk space

### Recommended
- Node.js 20+
- Python 3.11+
- 8GB RAM
- 5GB disk space

### Check Your System

```bash
node --version    # Should be 18.17+
npm --version     # Should be 9+
python --version  # Should be 3.9+
pip --version     # Should match python version
```

---

## Troubleshooting

### Virtual Environment Issues

**Q: "command not found: source" (Windows)**
A: Use `venv\Scripts\activate.bat` instead of `source`

**Q: Virtual environment not activating**
A: 
```bash
# Try full path
./venv/bin/activate  # macOS/Linux
.\venv\Scripts\activate.bat  # Windows
```

**Q: ModuleNotFoundError after pip install**
A: 
```bash
# Check venv is activated
which python  # Should show path inside venv
# If not, activate: source venv/bin/activate
```

### Installation Issues

**Q: pip install fails**
A:
```bash
pip install --upgrade pip
pip install --no-cache-dir -r requirements.txt
```

**Q: npm install fails**
A:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Q: Port already in use**

Backend (8000):
```bash
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

Frontend (3000):
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Documentation Files

Start with these in order:

1. **SETUP_COMPLETE.md** ← START HERE
   - Quick setup instructions
   - Works for beginners

2. **ENVIRONMENT_SETUP.md** (if you need details)
   - Detailed environment setup
   - Comprehensive troubleshooting
   - Development workflow

3. **DEPENDENCIES.md** (for reference)
   - All packages listed
   - Dependency tree
   - Management commands

4. **QUICK_START.md** (daily reference)
   - Commands cheat sheet
   - Running services

---

## Key Files Created/Modified

### New Files
- `setup.sh` - Automated macOS/Linux setup
- `setup.bat` - Automated Windows setup
- `SETUP_COMPLETE.md` - Main setup guide
- `ENVIRONMENT_SETUP.md` - Detailed setup guide
- `DEPENDENCIES.md` - Package reference
- `SETUP_AND_DEPENDENCIES_COMPLETE.md` - This file
- `EN_VISION_FE/.env.local.example` - Frontend env template
- `EN_VISION_BE/.env.example` - Backend env template

### Modified Files
- `EN_VISION_BE/requirements.txt` - Added version pinning & new packages

---

## Common Commands Reference

### Backend

```bash
# Setup
cd EN_VISION_BE
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Running
python main.py
uvicorn main:app --reload

# Management
pip list
pip install package-name
pip freeze > requirements.txt
deactivate
```

### Frontend

```bash
# Setup
cd EN_VISION_FE
npm install
cp .env.local.example .env.local

# Running
npm run dev
npm run build
npm run lint

# Management
npm list
npm install package-name
npm update
npm audit fix
```

---

## Next Steps

1. ✓ Choose setup method (automated or manual)
2. ✓ Run setup script or follow manual steps
3. → Start both services (backend & frontend)
4. → Verify at http://localhost:3000
5. → Check QUICK_START.md for development tips

---

## Getting Help

### Setup Issues
- Check ENVIRONMENT_SETUP.md (Troubleshooting section)
- Check DEPENDENCIES.md (Common Issues section)
- This file's Troubleshooting section

### Development Issues
- Check QUICK_START.md
- Check INTEGRATION_FIXES.md (API issues)

### Questions
- All answers in ENVIRONMENT_SETUP.md
- Reference DEPENDENCIES.md for package info

---

## Summary

You now have:

✓ **Automated setup scripts** (setup.sh / setup.bat)
✓ **Comprehensive guides** (SETUP_COMPLETE.md, ENVIRONMENT_SETUP.md)
✓ **Reference documentation** (DEPENDENCIES.md)
✓ **Environment templates** (.env.local.example, .env.example)
✓ **Complete requirements** (requirements.txt with versions)

**Everything is ready. Choose your setup method and get started! 🚀**

---

## Final Checklist

Before starting development:

- [ ] Node.js 18.17+ installed
- [ ] Python 3.9+ installed
- [ ] Setup completed (automated or manual)
- [ ] Virtual environment created for backend
- [ ] Dependencies installed (both frontend & backend)
- [ ] Environment files created (.env, .env.local)
- [ ] Backend running at http://localhost:8000
- [ ] Frontend running at http://localhost:3000
- [ ] API docs accessible at http://localhost:8000/docs
- [ ] Dashboard loads without errors

**All set? Start reading QUICK_START.md for daily development! 🎉**
