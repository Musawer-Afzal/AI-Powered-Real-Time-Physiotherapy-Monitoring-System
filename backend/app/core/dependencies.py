from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer

from jose import jwt
from jose import JWTError

from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings

from app.models.user import User


security = HTTPBearer()

def get_current_user(
    token=Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Invalid token"
    )
    try:
        payload = jwt.decode(
            token.credentials,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = (
        db.query(User).filter(User.id == user_id).first()
    )

    if not user:
        raise credentials_exception

    return user