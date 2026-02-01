from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager

from app.routes import pose, exercises, sessions
from app.database.connection import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events"""
    # Startup
    print("🚀 Starting Physiotherapy AI Backend...")
    init_db()
    yield
    # Shutdown
    print("👋 Shutting down...")

app = FastAPI(
    title="Physiotherapy AI Assistant",
    description="Real-time exercise form analysis using AI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(pose.router, prefix="/api/pose", tags=["pose"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["exercises"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])

@app.get("/")
async def root():
    return {"message": "Physiotherapy AI API", "status": "running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)