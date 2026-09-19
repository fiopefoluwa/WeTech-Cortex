# routers/users.py
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from core.database import get_session
from models.agreement import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/")
def list_users(session: Session = Depends(get_session)):
    users = session.exec(select(User)).all()
    return [{"id": u.id, "name": u.name, "role": u.role, "email": u.email} for u in users]


@router.post("/")
def create_user(name: str, role: str, email: str, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        return {"id": existing.id, "name": existing.name, "role": existing.role, "email": existing.email}
    user = User(name=name, role=role, email=email)
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