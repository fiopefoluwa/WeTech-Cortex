# core/database.py
import os
from typing import Dict, Any
from sqlmodel import SQLModel, Session, create_engine
from core.config import DATABASE_URL

connect_args = {"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
engine_kwargs: Dict[str, Any] = {
    "echo": False,
}
if "sqlite" not in DATABASE_URL:
    engine_kwargs.update({"pool_pre_ping": True, "pool_recycle": 300})

engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


def to_dict(obj):
    if obj is None:
        return None
    if isinstance(obj, list):
        return [to_dict(x) for x in obj]
    if hasattr(obj, "__table__"):
        res = {}
        for c in obj.__table__.columns:
            val = getattr(obj, c.name)
            if hasattr(val, "isoformat"):
                val = val.isoformat()
            res[c.name] = val
        return res
    if hasattr(obj, "dict"):
        return obj.dict()
    return obj