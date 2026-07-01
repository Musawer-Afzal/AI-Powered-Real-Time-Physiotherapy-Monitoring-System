from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.schemas.user import UserRegister
from app.schemas.auth import (
    LoginRequest,
    TokenResponse
)

from app.services.auth_service import (
    create_user,
    authenticate_user
)

from app.core.security import (
    create_access_token
)

from app.core.database import get_db


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register")
def register(
    user: UserRegister,
    db: Session = Depends(get_db)
):
    created_user = create_user(
        db,
        user.name,
        user.email,
        user.password
    )

    if not created_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    return {
        "message": "User created successfully"
    }


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db,
        request.email,
        request.password
    )

    if user == "NOT_APPROVED":
        raise HTTPException(
            status_code=403,
            detail="Your therapist account is awaiting admin approval."
        )
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user.role

    }