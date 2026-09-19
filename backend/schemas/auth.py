# schemas/auth.py
from typing import Optional
from sqlmodel import SQLModel


class UserRegister(SQLModel):
    name: str
    email: str
    password: str
    role: str = "brand"  # "brand" or "creator"


class UserLogin(SQLModel):
    email: str
    password: str


class TokenResponse(SQLModel):
    access_token: str
    token_type: str = "bearer"
    user: dict
