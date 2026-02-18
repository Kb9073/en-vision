#!/bin/bash

# EN-Vision Complete Setup Script
# This script automates the entire development environment setup

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       EN-Vision Complete Setup Script${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Function to print section headers
section() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to print success messages
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error messages
error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning messages
warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running from project root
if [ ! -f "QUICK_START.md" ]; then
    error "Please run this script from the EN-Vision project root directory"
    exit 1
fi

# Check system requirements
section "Checking System Requirements"

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 18.17+"
    exit 1
fi
NODE_VERSION=$(node --version)
success "Node.js $NODE_VERSION installed"

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is not installed"
    exit 1
fi
NPM_VERSION=$(npm --version)
success "npm $NPM_VERSION installed"

# Check Python
if ! command -v python3 &> /dev/null; then
    error "Python 3 is not installed. Please install Python 3.9+"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
success "$PYTHON_VERSION installed"

# Check pip
if ! command -v pip3 &> /dev/null; then
    error "pip3 is not installed"
    exit 1
fi
PIP_VERSION=$(pip3 --version)
success "$PIP_VERSION installed"

# Check git
if ! command -v git &> /dev/null; then
    warning "Git is not installed (optional)"
else
    GIT_VERSION=$(git --version)
    success "$GIT_VERSION installed"
fi

# Backend Setup
section "Setting Up Backend (FastAPI)"

if [ ! -d "EN_VISION_BE" ]; then
    error "EN_VISION_BE directory not found"
    exit 1
fi

cd EN_VISION_BE

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    success "Virtual environment created"
else
    warning "Virtual environment already exists"
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate
success "Virtual environment activated"

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip > /dev/null 2>&1
success "pip upgraded"

# Install dependencies
echo "Installing backend dependencies..."
pip install -r requirements.txt > /dev/null 2>&1
success "Backend dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        success ".env file created"
    else
        warning ".env file not found, creating with defaults..."
        cat > .env << EOF
ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
DATABASE_URL=postgresql://user:password@localhost:5432/en_vision
HOST=0.0.0.0
PORT=8000
EOF
        success ".env file created with defaults"
    fi
else
    success ".env file already exists"
fi

# Verify FastAPI installation
echo "Verifying FastAPI installation..."
python -c "import fastapi; print(f'FastAPI {fastapi.__version__}')" 2>/dev/null
success "FastAPI verified"

# Return to project root
cd ..

# Frontend Setup
section "Setting Up Frontend (Next.js)"

if [ ! -d "EN_VISION_FE" ]; then
    error "EN_VISION_FE directory not found"
    exit 1
fi

cd EN_VISION_FE

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install > /dev/null 2>&1
    success "Frontend dependencies installed"
else
    success "Frontend dependencies already installed"
fi

# Create .env.local if it doesn't exist
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file from template..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        success ".env.local file created"
    else
        warning ".env.local file not found, creating with defaults..."
        cat > .env.local << EOF
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=10000
NODE_ENV=development
EOF
        success ".env.local file created with defaults"
    fi
else
    success ".env.local file already exists"
fi

# Verify Next.js installation
echo "Verifying Next.js installation..."
npm list next > /dev/null 2>&1
success "Next.js verified"

# Return to project root
cd ..

# Final Summary
section "Setup Complete!"

echo -e "${GREEN}✓ All dependencies installed successfully!${NC}\n"

echo "📋 Next Steps:"
echo -e "  ${BLUE}1. Backend:${NC}"
echo "     cd EN_VISION_BE"
echo "     source venv/bin/activate"
echo "     python main.py"
echo ""
echo -e "  ${BLUE}2. Frontend (in another terminal):${NC}"
echo "     cd EN_VISION_FE"
echo "     npm run dev"
echo ""
echo -e "${GREEN}Access the application at: http://localhost:3000${NC}"
echo -e "${GREEN}API documentation at: http://localhost:8000/docs${NC}\n"

echo -e "For more details, see ${YELLOW}ENVIRONMENT_SETUP.md${NC}"
echo -e "\n${BLUE}═══════════════════════════════════════════════════════════${NC}\n"
