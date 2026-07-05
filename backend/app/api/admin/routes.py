from fastapi import APIRouter, Depends, HTTPException, Query
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
def get_users(
    role: str | None = Query(None),
    approved: bool | None = Query(None),
    search: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin only"
        )

    return get_all_users(
        db=db,
        role=role,
        approved=approved,
        search=search
    )


@router.put("/approve/{user_id}")
def approve(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    admin_required(current_user)

    return approve_therapist(db, user_id)


@router.put("/users/{user_id}/status")
def update_user_status(
    user_id: str,
    is_approved: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":
        raise HTTPException(status_code=403)

    success = update_user_status(
        db,
        user_id,
        is_approved
    )

    if not success:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Status updated"
    }


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