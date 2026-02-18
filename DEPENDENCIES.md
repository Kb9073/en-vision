# Dependencies and Virtual Environment Guide

Complete reference for all project dependencies, virtual environment setup, and dependency management.

## Table of Contents

1. [Frontend Dependencies](#frontend-dependencies)
2. [Backend Dependencies](#backend-dependencies)
3. [Virtual Environment Setup](#virtual-environment-setup)
4. [Dependency Management](#dependency-management)
5. [Common Issues](#common-issues)

---

## Frontend Dependencies

### Node Modules Overview

The frontend (EN_VISION_FE) uses **Next.js 16** with React 19 and a modern web stack.

### Core Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.0.10 | Next.js framework |
| `react` | 19.2.0 | React library |
| `react-dom` | 19.2.0 | DOM rendering |
| `typescript` | ^5 | TypeScript support |

### UI & Components

| Package | Version | Purpose |
|---------|---------|---------|
| `@radix-ui/*` | Various | Headless UI components |
| `lucide-react` | ^0.454.0 | Icon library |
| `shadcn/ui` | - | Component library (built from radix) |
| `tailwindcss` | ^4.1.9 | Utility-first CSS |
| `class-variance-authority` | ^0.7.1 | CSS class composition |
| `tailwind-merge` | ^3.3.1 | Merge Tailwind classes |
| `clsx` | ^2.1.1 | Class name utility |

### Data & State Management

| Package | Version | Purpose |
|---------|---------|---------|
| `@tanstack/react-query` | 5.90.16 | Data fetching & caching |
| `axios` | 1.13.2 | HTTP client |
| `zod` | 3.25.76 | Schema validation |

### Forms & Validation

| Package | Version | Purpose |
|---------|---------|---------|
| `react-hook-form` | ^7.60.0 | Form management |
| `@hookform/resolvers` | ^3.10.0 | Form validation resolvers |

### Charts & Visualization

| Package | Version | Purpose |
|---------|---------|---------|
| `recharts` | 2.15.4 | Chart components |
| `date-fns` | 4.1.0 | Date utilities |

### Animations & Effects

| Package | Version | Purpose |
|---------|---------|---------|
| `framer-motion` | 12.25.0 | Animation library |
| `tailwindcss-animate` | ^1.0.7 | Animation utilities |

### Other Utilities

| Package | Version | Purpose |
|---------|---------|---------|
| `sonner` | ^1.7.4 | Toast notifications |
| `next-themes` | ^0.4.6 | Dark mode theming |
| `embla-carousel-react` | 8.5.1 | Carousel component |
| `react-resizable-panels` | ^2.1.7 | Resizable panels |
| `@vercel/analytics` | 1.3.1 | Analytics tracking |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@types/node` | ^22 | Node.js type definitions |
| `@types/react` | ^19 | React type definitions |
| `@types/react-dom` | ^19 | React DOM type definitions |
| `postcss` | ^8.5 | CSS processor |
| `@tailwindcss/postcss` | ^4.1.9 | Tailwind PostCSS plugin |
| `autoprefixer` | ^10.4.20 | Vendor prefixes for CSS |

### Installation Size

```
Total: ~500MB (node_modules directory)
```

### Package Lock File

- **File**: `package-lock.json`
- **Purpose**: Locks exact versions for reproducible installs
- **Commit**: ✓ Should be committed to git
- **Update**: Only when running `npm install` with new packages

---

## Backend Dependencies

### Python Packages Overview

The backend (EN_VISION_BE) uses **FastAPI** with PostgreSQL for data persistence.

### Core Web Framework

| Package | Version | Purpose |
|---------|---------|---------|
| `fastapi` | 0.104.1 | Web framework |
| `uvicorn[standard]` | 0.24.0 | ASGI server |
| `python-multipart` | 0.0.6 | File upload handling |

### Database

| Package | Version | Purpose |
|---------|---------|---------|
| `sqlalchemy` | 2.0.23 | ORM & database toolkit |
| `psycopg2-binary` | 2.9.9 | PostgreSQL adapter |

### Data Processing

| Package | Version | Purpose |
|---------|---------|---------|
| `pandas` | 2.1.3 | Data manipulation |
| `numpy` | 1.26.2 | Numerical computing |

### Configuration

| Package | Version | Purpose |
|---------|---------|---------|
| `python-dotenv` | 1.0.0 | Environment variable loading |
| `pydantic` | 2.5.0 | Data validation |
| `pydantic-settings` | 2.1.0 | Settings management |

### API & Documentation

| Package | Version | Purpose |
|---------|---------|---------|
| `openapi-schema-pydantic` | 1.3.0 | OpenAPI schema validation |

### Installation Size

```
Total: ~200MB (venv directory)
```

### Requirements File

- **File**: `requirements.txt`
- **Format**: Pinned versions for reproducibility
- **Python Version**: 3.9+
- **Commit**: ✓ Should be committed to git

---

## Virtual Environment Setup

### What is a Virtual Environment?

A Python virtual environment is an isolated Python installation on your system. It allows you to install packages specific to one project without affecting other projects.

**Benefits:**
- ✓ Isolate project dependencies
- ✓ Avoid version conflicts
- ✓ Easy cleanup (just delete the folder)
- ✓ Easy sharing (requirements.txt)

### Creating and Using Virtual Environment

#### On macOS/Linux

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Your prompt should now show: (venv) user@machine:path$

# Install packages
pip install -r requirements.txt

# When done, deactivate
deactivate
```

#### On Windows (Command Prompt)

```bash
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate.bat

# Your prompt should now show: (venv) C:\path>

# Install packages
pip install -r requirements.txt

# When done, deactivate
deactivate
```

#### On Windows (PowerShell)

```powershell
# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\Activate.ps1

# Install packages
pip install -r requirements.txt

# When done
deactivate
```

### Verifying Virtual Environment is Active

```bash
# macOS/Linux
which python  # Should show: /path/to/venv/bin/python

# Windows
where python  # Should show: \path\to\venv\Scripts\python.exe
```

---

## Dependency Management

### Frontend: Adding New Packages

```bash
cd EN_VISION_FE

# Install and save to dependencies
npm install package-name

# Install as development dependency
npm install -D package-name

# Update package-lock.json
npm install

# List all packages
npm list

# Check for outdated packages
npm outdated

# Update all packages
npm update
```

### Frontend: Removing Packages

```bash
npm uninstall package-name
```

### Backend: Adding New Packages

```bash
cd EN_VISION_BE

# Activate virtual environment first!
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate.bat  # Windows

# Install package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt

# List all installed packages
pip list

# Check for outdated packages
pip list --outdated

# Update a package
pip install --upgrade package-name
```

### Backend: Removing Packages

```bash
pip uninstall package-name
pip freeze > requirements.txt  # Update requirements.txt
```

### Upgrading All Backend Dependencies

```bash
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

---

## Dependency Tree Analysis

### Frontend Dependency Tree (Simplified)

```
next@16.0.10
├── react@19.2.0
├── react-dom@19.2.0
└── @swc/core (build tool)

tailwindcss@4.1.9
├── postcss@8.5
└── autoprefixer@10.4.20

@tanstack/react-query@5.90.16
└── (handles caching/fetching)

axios@1.13.2
└── (HTTP requests)

recharts@2.15.4
├── react@19.2.0
└── d3 (chart library)

@radix-ui/* (multiple components)
└── @radix-ui/react-slot@1.1.1 (shared dependency)
```

### Backend Dependency Tree (Simplified)

```
fastapi@0.104.1
├── starlette (ASGI framework)
├── pydantic@2.5.0 (validation)
└── uvicorn (server)

uvicorn[standard]@0.24.0
├── uvloop (performance)
└── httptools (performance)

sqlalchemy@2.0.23
├── greenlet (concurrency)
└── typing-extensions (types)

psycopg2-binary@2.9.9
└── (PostgreSQL adapter)

pandas@2.1.3
├── numpy@1.26.2
├── python-dateutil
└── pytz
```

---

## Common Issues

### Frontend

#### Q: `npm install` fails
**A:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

#### Q: Out of memory during build
**A:**
```bash
# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### Q: Module not found
**A:**
```bash
rm -rf node_modules
npm install
```

### Backend

#### Q: Virtual environment not activating
**A:**
```bash
# On macOS/Linux, try:
python3 -m venv venv
source venv/bin/activate

# On Windows, try:
python -m venv venv
venv\Scripts\activate.bat
```

#### Q: `pip install` fails
**A:**
```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

#### Q: ModuleNotFoundError after installing
**A:**
```bash
# Verify venv is activated (should show (venv) in prompt)
which python  # macOS/Linux
where python  # Windows

# Should show path inside venv folder
```

#### Q: psycopg2 installation fails
**A:**
```bash
# Already using psycopg2-binary (no compilation needed)
# If issues persist, ensure Python development headers are installed

# macOS:
brew install libpq

# Ubuntu/Debian:
sudo apt-get install postgresql-client

# Windows: Should work with psycopg2-binary
```

---

## Dependency Update Strategy

### Keeping Dependencies Updated

#### Frontend - Minor Updates (Safe)
```bash
npm update  # Updates minor/patch versions
npm outdated  # See what can be updated
```

#### Frontend - Major Updates (Test Thoroughly)
```bash
npm install next@latest  # Update specific package
npm install  # Reinstall
npm run build  # Test
npm run dev  # Test locally
```

#### Backend - Minor Updates
```bash
pip install --upgrade -r requirements.txt
pip freeze > requirements.txt
```

#### Backend - Major Updates
```bash
pip install --upgrade package-name
# Test thoroughly before committing
pip freeze > requirements.txt
```

### Version Pinning Strategy

**Frontend (package.json):**
- `^` (caret) = Allow compatible versions (default)
  - `^5.0.0` allows `5.1.2` but not `6.0.0`
- `~` (tilde) = Allow patch updates only
  - `~5.1.0` allows `5.1.2` but not `5.2.0`

**Backend (requirements.txt):**
- Exact versions pinned for reproducibility
  - `fastapi==0.104.1`
- Use `pip freeze` to lock all versions

---

## Security

### Checking for Vulnerabilities

**Frontend:**
```bash
npm audit  # Check for vulnerabilities
npm audit fix  # Attempt to fix
npm audit --fix --force  # Force update (may break things)
```

**Backend:**
```bash
pip-audit  # Install: pip install pip-audit
```

### Updating Security Patches

**Frontend:**
```bash
npm update  # Updates to latest compatible version
npm audit fix
```

**Backend:**
```bash
pip install --upgrade package-name
pip freeze > requirements.txt
```

---

## Performance

### Checking Bundle Size

**Frontend:**
```bash
npm run build
# Check output for bundle sizes

# Analyze bundle
npm install -D webpack-bundle-analyzer
```

**Backend:**
```bash
# Check venv size
du -sh venv  # macOS/Linux
dir /s venv  # Windows

# Most space is in: venv/lib/python3.x/site-packages/
```

### Removing Unused Dependencies

**Frontend:**
```bash
npm list --depth=0  # See top-level packages
npm prune  # Remove unused packages
```

**Backend:**
```bash
pip list  # See all packages
# Manually remove unused and update requirements.txt
```

---

## Reference Commands

### Frontend Commands

```bash
npm install              # Install dependencies
npm install pkg-name     # Add new package
npm update              # Update packages
npm list                # List installed packages
npm run dev             # Start development server
npm run build           # Build for production
npm run lint            # Run linter
npm run start           # Start production server
npm cache clean --force # Clear npm cache
npm audit              # Check vulnerabilities
```

### Backend Commands

```bash
python -m venv venv           # Create virtual environment
source venv/bin/activate      # Activate (macOS/Linux)
venv\Scripts\activate.bat     # Activate (Windows)
deactivate                    # Deactivate
pip install -r requirements.txt  # Install dependencies
pip install package-name      # Install single package
pip list                     # List packages
pip freeze                   # Show installed versions
pip freeze > requirements.txt # Update requirements file
pip install --upgrade pip    # Upgrade pip
python main.py              # Run application
pip-audit                   # Check vulnerabilities
```

---

For detailed setup instructions, see **ENVIRONMENT_SETUP.md**
