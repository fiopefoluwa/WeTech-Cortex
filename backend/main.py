from fastapi import FastAPI
from core.database import create_db_and_tables
from models.agreement import User, Deal, Agreement, AgreementTerm, Message, ChangeRequest, Activity
from routers import deals, agreement, messages, change_requests, users

app = FastAPI()

app.include_router(deals.router)
app.include_router(agreement.router)
app.include_router(messages.router)
app.include_router(change_requests.router)
app.include_router(users.router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()