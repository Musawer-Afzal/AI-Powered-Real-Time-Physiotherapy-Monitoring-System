from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user

from app.models.user import User

from app.services.admin_service import *

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


def admin_required(user):

    if user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admins only"
        )


@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    admin_required(current_user)

    return get_dashboard_stats(db)


@router.get("/users")
def users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    admin_required(current_user)

    return get_all_users(db)


@router.put("/approve/{user_id}")
def approve(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    admin_required(current_user)

    return approve_therapist(db, user_id)


@router.delete("/users/{user_id}")
def remove(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    admin_required(current_user)

    delete_user(db, user_id)

    return {
        "message": "Deleted"
    }