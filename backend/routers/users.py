from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select, SQLModel
from core.database import get_session
from models.agreement import User

router = APIRouter(prefix="/users", tags=["users"])


class UserCreatePayload(SQLModel):
    name: Optional[str] = None
    role: Optional[str] = "creator"
    email: Optional[str] = None


@router.get("/")
def list_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return [{"id": u.id, "name": u.name, "role": u.role, "email": u.email} for u in users]


@router.post("/")
def create_user(
    name: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    email: Optional[str] = Query(None),
    body: Optional[UserCreatePayload] = None,
    session: Session = Depends(get_session),
):
    final_name = (body.name if body and body.name else name) or "User"
    final_role = (body.role if body and body.role else role) or "creator"
    final_email = (body.email if body and body.email else email)

    if not final_email:
        raise HTTPException(status_code=400, detail="User email is required")

    existing = session.exec(select(User).where(User.email == final_email)).first()
    if existing:
        return {"id": existing.id, "name": existing.name, "role": existing.role, "email": existing.email}
    user = User(name=final_name, role=final_role, email=final_email)
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"id": user.id, "name": user.name, "role": user.role, "email": user.email}


@router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user.id, "name": user.name, "role": user.role, "email": user.email}