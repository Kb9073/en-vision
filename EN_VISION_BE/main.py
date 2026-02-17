from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.dashboard.router import router as dashboard_router
from services.ingestion.ingest import router as ingestion_router

app = FastAPI(
    title="En-Vision API",
    version="1.0.0"
)

# CORS (important for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ONLY TOP LEVEL ROUTERS
app.include_router(dashboard_router)
app.include_router(ingestion_router)

@app.get("/")
def root():
    return {"status": "En-Vision API running"}
