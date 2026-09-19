# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from core.database import create_db_and_tables, engine
from core.security import get_password_hash
from models.agreement import (
    User,
    Deal,
    Agreement,
    AgreementTerm,
    Message,
    ChangeRequest,
    Deliverable,
    Content,
    License,
    Activity,
    Payment,
)
from routers import (
    auth,
    deals,
    agreement,
    messages,
    change_requests,
    deliverables,
    licensing,
    payments,
    activity_log,
    users,
)

app = FastAPI(
    title="Scope API",
    description="The Operating System for Creator Partnerships, Real-Time Scope Auditing, and Commercial Rights",
    version="2.0.0",
)

# Enable CORS for all frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all subrouters
app.include_router(auth.router)
app.include_router(deals.router)
app.include_router(agreement.router)
app.include_router(messages.router)
app.include_router(change_requests.router)
app.include_router(deliverables.router)
app.include_router(licensing.router)
app.include_router(payments.router)
app.include_router(activity_log.router)
app.include_router(users.router)


def seed_demo_data():
    with Session(engine) as session:
        # Check if users already exist
        brand_user = session.exec(select(User).where(User.email == "demo@northstar.com")).first()
        if not brand_user:
            brand_user = User(
                name="Northstar Coffee",
                email="demo@northstar.com",
                role="brand",
                hashed_password=get_password_hash("demo123"),
            )
            session.add(brand_user)

        creator_user = session.exec(select(User).where(User.email == "amara@okafor.com")).first()
        if not creator_user:
            creator_user = User(
                name="Amara Okafor",
                email="amara@okafor.com",
                role="creator",
                hashed_password=get_password_hash("demo123"),
            )
            session.add(creator_user)

        session.commit()
        session.refresh(brand_user)
        session.refresh(creator_user)

        # Check if Deal #1 or default deal exists
        existing_deal = session.exec(select(Deal)).first()
        if not existing_deal:
            default_deal = Deal(
                name="Summer Creator Campaign",
                brand_id=brand_user.id,
                creator_id=creator_user.id,
                description="3 TikTok videos with seasonal theme, 30 days organic licensing",
                total_amount=300000.0,
                status="active",
                start_date="Sept 1",
                end_date="Oct 31",
            )
            session.add(default_deal)
            session.commit()
            session.refresh(default_deal)

            # Agreement
            raw_agreement_text = """
COMMERCIAL CREATOR AGREEMENT
Parties: Northstar Coffee ("Brand") and Amara Okafor ("Creator")
Scope: 3 TikTok videos highlighting seasonal cold brew products.
Deliverables: 3 TikTok videos (60-90s, high-resolution vertical format).
Total Compensation: ₦300,000 NGN payable upon milestone delivery.
Revisions: 1 free round of revision included per deliverable. Additional revisions at ₦35,000 each.
Licensing & Usage Rights: 30 days organic usage on TikTok + Instagram from publication date. No paid advertising rights granted without formal commercial extension.
Exclusivity: Category exclusivity for coffee/beverage brands during active 30-day window.
"""
            agreement_record = Agreement(
                deal_id=default_deal.id,
                raw_text=raw_agreement_text,
            )
            session.add(agreement_record)
            session.commit()
            session.refresh(agreement_record)

            term = AgreementTerm(
                agreement_id=agreement_record.id,
                scope="3 TikTok videos with seasonal theme",
                deliverables="3 TikTok videos",
                price=300000.0,
                revision_limit=1,
                deadline="Oct 15",
                payment_terms="50% deposit, 50% milestone disbursement",
                platforms="TikTok + Instagram",
                usage_rights="Organic usage only",
                license_duration="30 days",
                geographic_restrictions="Worldwide",
                exclusivity="Category exclusivity (Coffee) for 30 days",
            )
            session.add(term)

            # Deliverables
            d1 = Deliverable(
                deal_id=default_deal.id,
                name="Video #01",
                agreed_scope="TikTok video (60s)",
                status="Approved",
                deadline="Sept 15",
                revisions="1 of 1 revisions used",
                reference_clause="Deliverables §2",
                reference_text="“3 TikTok videos”",
                submission_url="https://tiktok.com/@amara_okafor/video/7281928391",
            )
            d2 = Deliverable(
                deal_id=default_deal.id,
                name="Video #02",
                agreed_scope="TikTok video (60s)",
                status="In review",
                deadline="Sept 25",
                revisions="0 of 1 revisions used",
                reference_clause="Deliverables §2",
                reference_text="“3 TikTok videos”",
                submission_url="https://tiktok.com/@amara_okafor/video/7283891023",
            )
            d3 = Deliverable(
                deal_id=default_deal.id,
                name="Video #03",
                agreed_scope="TikTok video (60s)",
                status="Not started",
                deadline="Oct 5",
                revisions="0 of 1 revisions used",
                reference_clause="Deliverables §2",
                reference_text="“3 TikTok videos”",
            )
            session.add_all([d1, d2, d3])

            # Content & License
            c1 = Content(
                deal_id=default_deal.id,
                title="Video #01",
                platform="TikTok + Instagram",
                submission_url="https://tiktok.com/@amara_okafor/video/7281928391",
            )
            session.add(c1)
            session.commit()
            session.refresh(c1)

            lic1 = License(
                deal_id=default_deal.id,
                content_id=c1.id,
                title="Video #01",
                platforms="TikTok + Instagram",
                usage_type="Organic",
                status="Expired",
                original_period="Sept 1 – Oct 1",
                start_date="2026-09-01",
                expiry_date="2026-10-01",
                current_position="Ad running without active license",
            )
            session.add(lic1)

            # Change Request
            cr1 = ChangeRequest(
                deal_id=default_deal.id,
                description="YouTube Shorts cutdown version",
                reason="Requested deliverable is not included in baseline contract (Deliverables §2)",
                additional_amount=40000.0,
                requested_by=creator_user.id,
                status="approved",
            )
            session.add(cr1)

            # Activities
            session.add(Activity(deal_id=default_deal.id, description="Deal created: Summer Creator Campaign"))
            session.add(Activity(deal_id=default_deal.id, description="Agreement uploaded and verified via AI"))
            session.add(Activity(deal_id=default_deal.id, description="Deliverable 'Video #01' approved by Brand"))
            session.add(Activity(deal_id=default_deal.id, description="Scope change flagged: YouTube Shorts version"))
            session.add(Activity(deal_id=default_deal.id, description="Change request approved: YouTube Shorts version (₦40,000)"))

            session.commit()


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    seed_demo_data()


@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": "Scope Backend API",
        "version": "2.0.0",
        "docs_url": "/docs",
    }