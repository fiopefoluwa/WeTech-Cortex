# Scope — Frontend Workspace

The web application for Scope built with Next.js 16 (App Router, Turbopack), React 19, and Tailwind CSS.

---

## About the Application

Scope provides a collaborative deal room for commercial creator partnerships. It converts static contract terms into an active interface that allows brands and creators to review deliverables, monitor real-time conversation for scope changes, manage digital licensing windows, and approve milestone payouts.

Key capabilities include:
- Structured contract term cards extracted from legal documents.
- Real-time scope auditing using Gemini AI to identify uncontracted requests in chat.
- RightsGuard commercial licensing tracker for digital asset usage and renewals.
- Dual-persona simulation allowing instant switching between Brand (`Northstar Coffee`) and Creator (`Amara Okafor`) perspectives.

---

## Route Structure

Protected routes are nested under `/deals/[dealId]` and guarded by `AuthGuard`:

| Route | Purpose | Key Components |
|---|---|---|
| `/login` | Authentication & Demo Access | 1-click persona buttons, email/password fallback |
| `/` | Session-aware redirect | Directs logged-in users to `/deals/1`, otherwise to `/login` |
| `/deals/[dealId]` | Deal Overview | High-priority attention cards, milestone status, quick actions |
| `/deals/[dealId]/agreement` | Agreement & Terms | Extracted term cards, revision timeline, evidence viewer |
| `/deals/[dealId]/messages` | Messages & Scope Guardian | Chat thread, inline AI scope change detection, drawer modal |
| `/deals/[dealId]/deliverables` | Deliverables Pipeline | Video submission, status badges, review and approval flow |
| `/deals/[dealId]/content` | Commercial Assets | Asset metadata, active licensing duration, usage breakdown |
| `/deals/[dealId]/licensing` | RightsGuard Monitoring | Expired usage flags, interactive license extension modal |
| `/deals/[dealId]/change-requests` | Scope Adjustments | Compensation requests, approval and payout workflows |
| `/deals/[dealId]/payments` | Financial Milestones | Payment schedules, disbursement receipts, fee breakdowns |
| `/deals/[dealId]/activity` | Audit Trail | Chronological event log of all actions, submissions, and approvals |

---

## Design System and Typography

- **Headings**: Fraunces (`font-serif`) loaded via `next/font/google`
- **Body and Technical UI**: Inter (`font-sans`) loaded via `next/font/google`
- **Background**: `#FBF9F5` (Brand Cream)
- **Palette**:
  - Primary Purple: `#A05AFF`
  - Mint / Teal: `#1BCFB4`
  - Supporting Cyan: `#4BCBEB`
  - Warning Coral: `#FE9496`
  - Deep Violet: `#9E58FF`

---

## Session and State Management

Session state is managed globally through `UserContext.tsx`:
- **Hydration Safety**: Persisted in `localStorage` under `Scope_active_persona`.
- **Zero-Flash AuthGuard**: Protected routes display a loading spinner until hydration resolves, preventing unauthorized layout flashing.
- **Dynamic Perspective Switching**: Toggle between `brand` (`Northstar Coffee`) and `creator` (`Amara Okafor`) in real time.

---

## Environment Configuration

Create a `.env.local` file in this directory to override default endpoints:

```env
# Optional: defaults to https://coolpractical.onrender.com if omitted
NEXT_PUBLIC_API_URL=https://coolpractical.onrender.com
```

---

## Development and Build Commands

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Run ESLint validation (enforces 0 errors and 0 warnings)
npm run lint

# Compile production build
npm run build

# Start production server
npm run start
```
