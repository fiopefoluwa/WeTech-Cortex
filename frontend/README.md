# AgreementOS — Frontend Workspace

> **The Operating System for Creator Partnerships & Commercial Rights**

---

## 💡 What is AgreementOS?

**AgreementOS** is an intelligent collaboration platform designed to eliminate miscommunication, unpaid scope creep, and expired commercial usage in the creator economy.

Instead of burying contract terms in static PDFs and negotiating revisions across fragmented DMs, AgreementOS provides a shared, active deal room where:
- **Contracts are living entities**: Key terms (deliverables, exclusivity, revisions, licensing periods, payment terms) are extracted and displayed as active term cards.
- **Scope is protected in real time**: An AI Scope Guardian audits communications as they happen, catching informal revision requests and suggesting fair market compensation.
- **Commercial rights are tracked**: RightsGuard actively monitors asset licensing to prevent unauthorized usage past contractual end dates.
- **Both perspectives are unified**: Features instant persona toggling between **Brand (`Northstar Coffee`)** and **Creator (`Amara Okafor`)** to experience workflows from both vantage points.

Built with **Next.js 16 (Turbopack)**, **React 19**, and **Tailwind CSS**.

---

## 🚀 Key Modules & Routing

All deal room pages are nested under `/deals/[dealId]` and protected by `AuthGuard`:

| Route | Purpose | Key Components |
|---|---|---|
| `/login` | Authentication & 1-Click Demo Login | Demo account selector, email/password form |
| `/` | Root redirection | Directs authenticated users to `/deals/1`, otherwise to `/login` |
| `/deals/[dealId]` | Deal Overview | High-priority attention cards, milestone status, quick actions |
| `/deals/[dealId]/agreement` | Agreement & Terms | Extracted term cards, revision history, evidence viewer |
| `/deals/[dealId]/messages` | Communications & Scope Guardian | Chat thread, inline AI scope change detection, drawer modal |
| `/deals/[dealId]/deliverables` | Deliverables Pipeline | Video submission, status badges, review & approval workflow |
| `/deals/[dealId]/content` | Commercial Assets | Asset metadata, active licensing duration, usage breakdown |
| `/deals/[dealId]/licensing` | RightsGuard Monitoring | Expired usage flags, interactive license extension modal |
| `/deals/[dealId]/change-requests` | Scope Adjustments | Compensation requests, approval and payout workflows |
| `/deals/[dealId]/payments` | Financial Milestones | Payment schedules, disbursement receipts, fee breakdowns |
| `/deals/[dealId]/activity` | Audit Trail | Chronological event log of all actions, submissions, and approvals |

---

## 🎨 Theme & Typography

- **Headings**: `Fraunces` (`font-serif`) loaded via `@next/font/google`
- **Body & Technical UI**: `Inter` (`font-sans`) loaded via `@next/font/google`
- **Background**: `#FBF9F5` (Brand Cream)
- **Palette**:
  - Primary Purple: `#A05AFF`
  - Secondary Mint: `#1BCFB4`
  - Supporting Cyan: `#4BCBEB`
  - Warning Coral: `#FE9496`
  - Deep Violet: `#9E58FF`

---

## 🔐 Session Management

Session state is handled centrally in `UserContext.tsx`:
- **Hydration Safety**: Stored in `localStorage` (`agreementos_active_persona`).
- **Zero-Flash AuthGuard**: Protected routes render a clean loader while hydrating, preventing unauthorized layout flashing.
- **Dynamic Role Switching**: Real-time perspective toggling between:
  - `brand` (`Northstar Coffee`)
  - `creator` (`Amara Okafor`)

---

## ⚙️ Environment Variables

Create a `.env.local` file in this directory to configure your API endpoint:

```env
# Optional: defaults to https://coolpractical.onrender.com if not specified
NEXT_PUBLIC_API_URL=https://coolpractical.onrender.com
```

---

## 🛠️ Development & Production Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run ESLint validation
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```
