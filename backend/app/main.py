"""
SURE Backend Gateway
Main FastAPI Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api.routes import router

app = FastAPI(
    title="SURE — Standards for Unified Regulatory Engine",
    description="AI-Powered Indian Standards Recommendation Engine for Smart Public Procurement",
    version="1.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SURE — Standards for Unified Regulatory Engine",
        "version": "1.0.0"
    }

import os
from fastapi.staticfiles import StaticFiles

# Serve production frontend if built
dist_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")
if os.path.exists(dist_dir):
    app.mount("/", StaticFiles(directory=dist_dir, html=True), name="static")
else:
    @app.get("/")
    def root():
        return {
            "message": "SURE (Standards for Unified Regulatory Engine) is Online",
            "docs": "/docs",
            "recommend_endpoint": "/api/recommend"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
