# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from core.database import get_session
from core.security import get_password_hash, verify_password, create_access_token, get_current_user
from models.agreement import User
from schemas.auth import UserRegister, UserLogin, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )
    
    hashed = get_password_hash(user_in.password)
    user = User(
        name=user_in.name,
        email=user_in.email,
        role=user_in.role,
        hashed_password=hashed,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "role": user.role, "email": user.email},
    }


@router.post("/login", response_model=TokenResponse)
def login(login_data: UserLogin, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == login_data.email)).first()
    if not user:
        # Check if this is a known demo account request and create it on the fly
        if "northstar" in login_data.email.lower() or "brand" in login_data.email.lower():
            user = User(
                name="Nescafe Coffee",
                email=login_data.email,
                role="brand",
                hashed_password=get_password_hash(login_data.password or "demo123"),
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        elif "amara" in login_data.email.lower() or "creator" in login_data.email.lower():
            user = User(
                name="Amaka Moyinlola",
                email=login_data.email,
                role="creator",
                hashed_password=get_password_hash(login_data.password or "demo123"),
            )
            session.add(user)
            session.commit()
            session.refresh(user)
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )

    if user.hashed_password and not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "role": user.role, "email": user.email},
    }


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
    }
