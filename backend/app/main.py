from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import FRONTEND_ORIGIN
from .routes.analyze import router as analyze_router
from .routes.reports import router as reports_router

app = FastAPI(
    title="RedoX — Medical Image Analysis API",
    description="AI-powered medical scan analysis using Google Gemini",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow the React frontend
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Register routers
# ---------------------------------------------------------------------------
app.include_router(analyze_router, prefix="/api", tags=["Analysis"])
app.include_router(reports_router, prefix="/api", tags=["Reports"])


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "RedoX API", "version": "1.0.0"}
