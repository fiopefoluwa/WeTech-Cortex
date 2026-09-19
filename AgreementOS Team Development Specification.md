## Scope — Team Development Specification

## 1. Objective

Build a working MVP of Scope, a shared workspace for brands and creators/freelancers to manage agreements, communication, deliverables, licensing, scope changes, and payments.

The MVP must prove one core concept:

Scope understands what was agreed and detects when what happens in reality goes beyond those terms.

We are not building a full legal/contract-management platform for the hackathon.

## 2. Primary Users

## Brand / Client

Uses the platform to:

- Create deals

- Invite creators/freelancers

- Communicate

- Approve deliverables

- Approve additional charges

- Pay

- Manage content usage

## Creator / Freelancer

Uses the platform to:

- Receive/create agreements

- Communicate with clients

- Manage deliverables

- Submit work

- Request payment for additional work

- Track content licensing

- Request license renewals

## 3. Main Product Structure

The application should revolve around Deal Rooms.


A Deal Room contains:

## Deal

├── Overview

├── Agreement

├── Messages

├── Deliverables

├── Content

├── Licensing

├── Change Requests

├── Payments

└── Activity

Do not build these as disconnected features. They should all relate to the same deal/agreement.

## 4. Core User Flow

## Step 1 — Create a Deal

A brand creates a deal and invites a creator/freelancer.

Basic information:

- Deal name

- Parties

- Description

- Total amount

- Start/end date

## Step 2 — Create or Upload Agreement

Allow the user to:

- Upload PDF/document, or

- Enter agreement text manually.

The AI processes the agreement.

It should extract structured information such as:

Scope Deliverables Price Revision limit Deadline Payment terms


```
Platforms Usage rights License duration Geographic restrictions Exclusivity
```

The extracted terms must be stored as structured data, not just as AI-generated text.

## 5. Agreement Engine

This is the most important backend component.

Create a normalized representation of the agreement.

For example:

## Agreement

├── Scope

├── Deliverables

├── Financial Terms

├── Revision Rules

├── License Rules

└── Restrictions

The AI should help with extraction, but the application should make decisions using structured agreement data wherever possible.

This becomes the source of truth for the rest of the system.

## 6. Deal Room Communication

Build a simple real-time or near-real-time messaging system.

Users can communicate inside the Deal Room.

Every message should belong to a specific deal.

## Example:

Brand: Can you also create a YouTube Shorts version?

The system should be able to send the message to the Agreement Analysis Engine.


The AI determines whether the message represents:

- Normal communication

- Scope change

- Revision request

- Licensing change

- Payment-related request

- Other

## 7. ScopeGuard

When a potentially new request is detected, compare it with the agreement.

Example:

## Agreement:

3 TikTok videos 1 revision each ₦300,000

Message:

“Can you also create a YouTube Shorts version?”

## System response:

Potential Scope Change

Request:

YouTube Shorts version

Reason:

This deliverable is not included in the agreement.

Estimated additional fee:

₦40,000

The user should then be able to:

## Create Change Request


## 8. Change Request System

A change request should contain:

- Description

- Reason

- Additional amount

- Requested by

- Status

## Statuses:

```
Pending
Approved
Rejected
Paid
```

The other party can approve or reject it.

If approved:

## Payment → Agreement Update

The additional deliverable becomes part of the deal.

## 9. RightsGuard — Licensing

Licensing should use the same agreement engine.

## Example:

```
Content: Video #01
Platform: TikTok + Instagram
Usage: Organic
Duration: 30 days
Start: September 1
Expiry: October 1
```

The system should be able to determine the current license status:

```
Active
Expiring Soon
Expired
```


For the MVP, we can simulate content usage instead of building complex social-media monitoring.

## Example:

Simulated Event:

Brand used Video #01

Platform: Instagram

Usage: Paid Advertisement

Date: October 15

## Agreement says:

Organic usage only, 30 days.

## Scope detects:

## Potential licensing violation

and explains why.

## 10. License Renewal

When a license expires or usage changes, generate a renewal request.

## Example:

License Renewal Request

Content: Video #01

New usage: Paid advertising

Duration: 30 days

Suggested price: ₦100,000

## Brand can:

## Approve → Pay → License Updated

## 11. Payments

For the hackathon, keep payments simple.


Implement one payment provider suitable for the demo.

Payment should support:

- Original deal payment

- Change request payment

- License renewal payment

The important part isn't building a banking system.

The important demonstration is:

Agreement Event

↓

Financial Impact

↓

Payment Request

↓

Payment

↓

Agreement Updated

## 12. Activity / Audit Trail

Every important event should be recorded.

## Example:

Sept 10 — Agreement created

Sept 11 — Creator invited

Sept 12 — Deliverable submitted

Sept 13 — Scope change detected

Sept 13 — Change request created

Sept 14 — Change request approved

Sept 14 — ₦40,000 payment received

Sept 14 — Agreement updated

This gives the platform a reliable history of what happened.

## 13. Recommended Architecture


## Suggested stack

## Frontend

- Next.js

- TypeScript

- Tailwind CSS

## Backend

- NestJS or Next.js API • PostgreSQL

- Prisma

## AI

- LLM API for agreement extraction and event classification

## Payments

- Paystack or another suitable payment provider

## Storage

- Object storage for uploaded agreements/content


## 14. Database Core Entities

## Start with:

User

Organization

Deal

DealMember

Agreement

AgreementTerm

Deliverable

Message

Content

License

ScopeChange

ChangeRequest

Payment

Activity

Keep the schema simple.

Do not create unnecessary entities before the core flow works.

## 15. Development Phases

## Phase 1 — Foundation

## Set up:

- Repository

- Next.js application

- Backend

- Database

- Prisma

- Authentication

- Basic UI system

- Environment configuration

Output: Users can sign in and access the application.

## Phase 2 — Deals & Agreements

## Build:

- Create Deal


- Invite participant

- Upload agreement

- Store agreement

- AI extraction

- Agreement overview

Output: A deal has a structured agreement.

## Phase 3 — Deal Room

## Build:

- Deal dashboard

- Messaging

- Deliverables

- Activity timeline

Output: Two users can actually work around a deal.

## Phase 4 — ScopeGuard

## Build:

- Message analysis

- Scope comparison

- Detection UI

- Financial estimate

- Change request

Output: The system can detect additional work.

## Phase 5 — RightsGuard

## Build:

- Content records

- License terms

- License status

- Simulated usage events

- License violation detection

- Renewal request

Output: The system can detect usage outside agreed rights.


## Phase 6 — Payments

## Build:

- Payment request

- Checkout

- Payment confirmation

- Payment status

- Link payment to change/renewal

- Update agreement after successful payment

Output: The financial loop is complete.

## Phase 7 — Polish & Demo

## Focus on:

- UI consistency

- Empty/loading/error states

- Notifications

- Activity timeline

- Clear AI explanations

- Seed/demo data

- Mobile responsiveness

- Deployment

Do not add major new features at this stage.

## 16. What We Are NOT Building

For the MVP, do not build:

- Full WhatsApp integration

- Gmail integration

- Slack integration

- Automatic legal enforcement

- Complex contract generation

- Full accounting software

- Complete social media monitoring

- Every payment provider

- Marketplace/discovery

- Advanced invoicing

- Enterprise permissions

- Every possible licensing scenario

We need a working core, not a huge unfinished platform.


## 17. Team Development Rules

## 1. Build around the core flow

Every feature should support:

## Agreement → Reality → Detection → Action → Payment

If it doesn't contribute to this flow, it is probably not an MVP priority.

## 2. Backend first for core logic

The agreement structure, scope detection, licensing rules, change requests, and payment states must be reliable before spending too much time on UI polish.

## 3. AI should not control the system

AI interprets agreements and messages.

The application/database remains responsible for:

- Agreement state

- Payment state

- License state

- Approval state

- Permissions

## 4. Every important action must be traceable

If the system says something is outside the agreement, the user should be able to see which agreement term caused that conclusion.

## 5. Don't fake the core intelligence

We can simulate external events such as social-media usage, but the underlying detection logic must actually work.

## 18. Definition of Done

The MVP is ready when we can perform this entire demonstration:

```
Brand creates deal
↓
Agreement uploaded
↓
AI extracts terms
↓
```


Creator joins Deal Room

↓

They communicate

↓

Brand requests extra work

↓

Scope detects scope change

↓

Creator creates ₦40,000 request

↓

Brand approves

↓

Brand pays

↓

Agreement updates

↓

Content license expires

↓

Usage event occurs

↓

Scope detects license issue

↓

Renewal request generated

↓

Brand pays

↓

License extended

If we can execute this flow smoothly, we have demonstrated the actual product.

## Final Product Principle

We are not building another project-management tool, chat app, contract-storage system, or creator marketplace.

We are building the layer that connects:

What was agreed → What actually happened → What needs to happen next.

And when that difference has a financial impact:
