from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth.routes import (
    router as auth_router
)

from app.api.users.routes import (
    router as users_router
)

from app.api.patients.routes import (
    router as patients_router
)

from app.api.exercises.routes import (
    router as exercise_router
)

from app.api.sessions.routes import (
    router as sessions_router
)

from app.api.progress.routes import (
    router as progress_router
)

from app.api.session_reps.routes import (
    router as session_rep_router
)

from app.api.therapist.routes import (
    router as therapist_router
)

from app.api.admin.routes import (
    router as admin_router
)

app = FastAPI(
    title="Physiotherapy AI API",
    version="1.0.0"
)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(patients_router)
app.include_router(exercise_router)
app.include_router(sessions_router)
app.include_router(progress_router)
app.include_router(session_rep_router)
app.include_router(therapist_router)
app.include_router(admin_router)

@app.get("/")
def root():
    return {
        "message": "Physiotherapy AI Backend Running"
    }