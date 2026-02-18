@echo off
REM EN-Vision Complete Setup Script for Windows
REM This script automates the entire development environment setup

setlocal enabledelayedexpansion

REM Colors and formatting
color 0B

echo.
echo ============================================================
echo        EN-Vision Complete Setup Script (Windows)
echo ============================================================
echo.

REM Check if running from project root
if not exist "QUICK_START.md" (
    echo ERROR: Please run this script from the EN-Vision project root directory
    pause
    exit /b 1
)

REM Check system requirements
echo.
echo -- Checking System Requirements --
echo.

REM Check Node.js
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed. Please install Node.js 18.17+
    echo Download from: https://nodejs.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js !NODE_VERSION! installed
)

REM Check npm
where npm >nul 2>nul
if errorlevel 1 (
    echo ERROR: npm is not installed
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm !NPM_VERSION! installed
)

REM Check Python
where python >nul 2>nul
if errorlevel 1 (
    echo WARNING: Python is not installed. Please install Python 3.9+
    echo Download from: https://www.python.org
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo [OK] !PYTHON_VERSION! installed
)

REM Check pip
where pip >nul 2>nul
if errorlevel 1 (
    echo ERROR: pip is not installed
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('pip --version') do set PIP_VERSION=%%i
    echo [OK] pip is installed
)

REM Backend Setup
echo.
echo ============================================================
echo        Setting Up Backend (FastAPI)
echo ============================================================
echo.

if not exist "EN_VISION_BE" (
    echo ERROR: EN_VISION_BE directory not found
    pause
    exit /b 1
)

cd EN_VISION_BE

REM Create virtual environment
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo [OK] Virtual environment created
) else (
    echo [OK] Virtual environment already exists
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo [OK] Virtual environment activated

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip >nul 2>&1
echo [OK] pip upgraded

REM Install dependencies
echo Installing backend dependencies...
pip install -r requirements.txt >nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    echo Try running manually:
    echo   cd EN_VISION_BE
    echo   venv\Scripts\activate.bat
    echo   pip install -r requirements.txt
    pause
    exit /b 1
)
echo [OK] Backend dependencies installed

REM Create .env file
if not exist ".env" (
    echo Creating .env file...
    if exist ".env.example" (
        copy .env.example .env >nul
        echo [OK] .env file created
    ) else (
        (
            echo ENV=development
            echo ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
            echo DATABASE_URL=postgresql://user:password@localhost:5432/en_vision
            echo HOST=0.0.0.0
            echo PORT=8000
        ) > .env
        echo [OK] .env file created with defaults
    )
) else (
    echo [OK] .env file already exists
)

REM Return to project root
cd ..

REM Frontend Setup
echo.
echo ============================================================
echo        Setting Up Frontend (Next.js)
echo ============================================================
echo.

if not exist "EN_VISION_FE" (
    echo ERROR: EN_VISION_FE directory not found
    pause
    exit /b 1
)

cd EN_VISION_FE

REM Install dependencies
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install >nul 2>&1
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        echo Try running manually:
        echo   cd EN_VISION_FE
        echo   npm install
        pause
        exit /b 1
    )
    echo [OK] Frontend dependencies installed
) else (
    echo [OK] Frontend dependencies already installed
)

REM Create .env.local file
if not exist ".env.local" (
    echo Creating .env.local file...
    if exist ".env.local.example" (
        copy .env.local.example .env.local >nul
        echo [OK] .env.local file created
    ) else (
        (
            echo NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
            echo NEXT_PUBLIC_API_TIMEOUT=10000
            echo NODE_ENV=development
        ) > .env.local
        echo [OK] .env.local file created with defaults
    )
) else (
    echo [OK] .env.local file already exists
)

REM Return to project root
cd ..

REM Final Summary
echo.
echo ============================================================
echo        Setup Complete!
echo ============================================================
echo.
echo All dependencies installed successfully!
echo.
echo NEXT STEPS:
echo.
echo [1] Open Command Prompt/PowerShell - Terminal 1:
echo     cd EN_VISION_BE
echo     venv\Scripts\activate.bat
echo     python main.py
echo.
echo [2] Open Command Prompt/PowerShell - Terminal 2:
echo     cd EN_VISION_FE
echo     npm run dev
echo.
echo Access the application at: http://localhost:3000
echo API documentation at: http://localhost:8000/docs
echo.
echo For more details, see ENVIRONMENT_SETUP.md
echo.
echo ============================================================
echo.

pause
exit /b 0
