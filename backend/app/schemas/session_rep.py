from pydantic import BaseModel


class SessionRepCreate(BaseModel):
    session_id: str
    rep_number: int
    form_score: float
    is_good_rep: bool