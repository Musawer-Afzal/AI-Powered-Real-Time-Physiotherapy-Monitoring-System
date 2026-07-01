from sqlalchemy.orm import Session

from app.models.session_rep import SessionRep


def create_rep(
    db: Session,
    rep_data
):
    rep = SessionRep(
        session_id=rep_data.session_id,
        rep_number=rep_data.rep_number,
        form_score=rep_data.form_score,
        is_good_rep=rep_data.is_good_rep
    )

    db.add(rep)
    db.commit()
    db.refresh(rep)

    return rep