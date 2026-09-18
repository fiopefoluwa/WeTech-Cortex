# routers/users.py
from fastapi import APIRouter, Depends
from sqlmodel import Session
from core.database import get_session
from models.agreement import User

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/")
def create_user(name: str, role: str, email: str, session: Session = Depends(get_session)):
    user = User(name=name, role=role, email=email)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("/{user_id}")
def get_user(user_id: int, session: Session = Depends(get_session)):
    return session.get(User, user_id)