# core/security.py
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import os
import secrets
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session
from core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from core.database import get_session
from models.agreement import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    if not hashed_password:
        return True
    try:
        # Check standard bcrypt format
        if hashed_password.startswith("$2b$") or hashed_password.startswith("$2a$"):
            return bcrypt.checkpw(plain_password.encode("utf-8")[:72], hashed_password.encode("utf-8"))
        # Check pbkdf2 format (salt$hash)
        if "$" in hashed_password:
            salt, hash_val = hashed_password.split("$", 1)
            calculated = hashlib.sha256((salt + plain_password).encode("utf-8")).hexdigest()
            return secrets.compare_digest(hash_val, calculated)
    except Exception:
        pass
    return plain_password == hashed_password


def get_password_hash(password: str) -> str:
    # Use direct bcrypt hashpw
    try:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode("utf-8")[:72], salt)
        return hashed.decode("utf-8")
    except Exception:
        salt = secrets.token_hex(16)
        hash_val = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
        return f"{salt}${hash_val}"


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    user = session.get(User, int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user
