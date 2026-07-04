# PRD.md — SubGuardAI MVP v0.2

> Product: **SubGuardAI — Personal Subscriptions Tracker**  
> Version: **MVP v0.2**  
> Purpose: Build-ready PRD for **Zed + AI Agent CodeX** execution  
> Target stack: **Hono + TanStack React monorepo, Prisma ORM + PostgreSQL, authentication, authorization, and provider-agnostic LLM integration**  
> MVP timeline: **Less than 2 weeks**  
> Added in v0.2: **Public landing page with Register and Login buttons**

---

## 0. CodeX Execution Contract

### 0.1 Primary instruction for CodeX

Build a responsive web MVP for **SubGuardAI**, a personal subscriptions tracker for Indonesian users.

The MVP must allow users to:

1. Open a public landing page.
2. Register and log in.
3. Add, edit, delete, list, and update subscriptions.
4. View monthly and yearly recurring subscription costs.
5. View upcoming billing and in-app reminders.
6. Mark cancellation candidates and estimate potential savings.
7. Run an AI Subscription Review Assistant.
8. Join a mock premium waitlist without payment.

### 0.2 Hard rules

- Do not build native mobile apps.
- Do not build bank, email, e-wallet, Play Store, or App Store integrations.
- Do not build auto-cancellation.
- Do not build payment collection.
- Do not build family account sharing.
- Do not build multi-currency.
- Use **IDR only**.
- Use **manual subscription input only**.
- User data must always be isolated by `userId`.
- Never send passwords, password hashes, email addresses, or unnecessary personal data to the LLM.
- AI Review must be triggered only by user click, not automatically.
- Backend scoring is the source of truth for estimated savings and review priority.

### 0.3 Preferred implementation order

CodeX should implement the MVP in this order:

1. Project setup and shared types.
2. Database schema and Prisma client.
3. Auth API and protected middleware.
4. Landing page.
5. Login and register pages.
6. Protected dashboard shell.
7. Subscription CRUD.
8. Dashboard summary calculations.
9. Upcoming billing and in-app reminder logic.
10. Candidate marking and estimated saving.
11. AI Review scoring and provider-agnostic LLM wrapper.
12. Premium interest modal and API.
13. Analytics event logging.
14. QA test coverage and polish.

---

## 1. Product Summary

### 1.1 Product promise

SubGuardAI helps users:

> Track all subscriptions, see true monthly cost, get reminded before billing, and let AI highlight what may be worth cancelling.

### 1.2 MVP objective

Validate whether Indonesian digital-heavy users are willing to manually input subscriptions and whether they find value in seeing:

- Total monthly recurring cost.
- Total yearly recurring cost.
- Upcoming billing reminders.
- Potential savings from cancellation candidates.
- AI-assisted subscription review.

### 1.3 Target users

- Young professionals in Indonesia.
- Urban families.
- Freelancers and remote workers.
- Digital-heavy users who pay for streaming, telco, SaaS, AI tools, cloud storage, productivity apps, and education apps.

---

## 2. Problem Statement

Target users struggle to manage recurring subscription expenses because data is scattered across apps, email, app stores, bank statements, e-wallets, and memory.

Core problems:

1. Users forget active subscriptions.
2. Users do not realize when free trials become paid.
3. Users do not know their true monthly and yearly recurring subscription costs.
4. Users continue paying for rarely used services.
5. Users forget billing dates and delay cancellation decisions.

---

## 3. Goals and Non-Goals

### 3.1 Goals

| Goal | Description |
|---|---|
| Validate manual tracking | Prove users are willing to manually add subscription data. |
| Create spending visibility | Show estimated monthly and yearly subscription spending clearly. |
| Reduce forgotten billing | Show upcoming billing and in-app reminders. |
| Identify savings opportunity | Let users mark cancellation candidates and estimate monthly savings. |
| Validate AI usefulness | Test whether AI Review helps users decide what to review first. |
| Validate monetization signal | Use a mock premium CTA and waitlist. |

### 3.2 Non-goals

| Non-goal | Reason |
|---|---|
| Bank transaction integration | Too complex for two-week MVP. |
| Email scanning | Privacy and parsing complexity. |
| App Store or Play Store sync | Platform integration complexity. |
| Auto-detection | Not required for first validation. |
| Auto-cancellation | High risk and provider-dependent. |
| Full AI chatbot | Too broad and hard to measure. |
| Native mobile app | Responsive web app is faster. |
| WhatsApp reminders | Useful later, but not MVP. |
| Full calendar UI | Upcoming billing list is enough. |
| Family account sharing | Useful later, but not required. |
| Real payment integration | Use fake-door premium first. |
| Full personal finance app | Product must stay focused on subscriptions. |

---

## 4. MVP Scope

### 4.1 In-scope features

| Feature | MVP requirement |
|---|---|
| Public landing page | Public homepage explaining the product with Register and Login buttons. |
| Register/login | User can create an account and log in. |
| Authorization | User can only access their own data. |
| Subscription CRUD | Add, edit, delete, list, and update subscription status. |
| Fixed categories and statuses | Use enums for consistent filtering and AI analysis. |
| Spending summary | Calculate monthly/yearly estimated spend and active/trial counts. |
| Upcoming billing list | Show upcoming billing sorted by nearest date. |
| In-app reminder | Show billing due within 7 days. |
| Email reminder preference | Store preference; actual sending optional for MVP. |
| Usage frequency | User selects often, sometimes, rarely, or not sure. |
| Cancellation candidate | User can mark/unmark subscription as a candidate. |
| Estimated saving | Calculate potential saving if candidates are cancelled. |
| AI Subscription Review Assistant | AI explains review candidates using structured data and backend score. |
| Mock premium CTA | Measure premium interest with a waitlist modal. |
| Basic analytics logging | Track key product events in the database. |

### 4.2 Future requirements

- WhatsApp reminders.
- Premium payment integration.
- Family sharing.
- Multi-currency.
- Email receipt scanning.
- Bank/e-wallet transaction detection.
- App Store / Play Store sync.
- Provider-specific cancellation guide.
- Full AI chatbot.
- Native mobile app.

---

## 5. User Journey

### 5.1 First-time user journey

1. User opens `/`.
2. Landing page explains value proposition.
3. User clicks **Register** or **Login**.
4. User registers or logs in.
5. User reaches protected dashboard.
6. Empty dashboard prompts user to add first subscription.
7. User adds at least 3 subscriptions.
8. Dashboard shows monthly/yearly recurring cost.
9. User opens AI Review.
10. System shows review candidates and possible savings.
11. User marks a candidate.
12. Estimated savings update.
13. User clicks premium CTA.
14. System records premium interest.

### 5.2 Core product loop

```text
Add subscription
-> See total spend
-> Review upcoming billing
-> Get AI recommendation
-> Mark cancellation candidate
-> Estimate saving
-> Update subscription status
```

---

## 6. Information Architecture

### 6.1 Public routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing page | Public |
| `/login` | Login page | Public only |
| `/register` | Register page | Public only |

### 6.2 Protected routes

| Route | Page | Access |
|---|---|---|
| `/dashboard` | Dashboard overview | Authenticated |
| `/subscriptions` | Subscription list | Authenticated |
| `/subscriptions/new` | Add subscription | Authenticated |
| `/subscriptions/:id/edit` | Edit subscription | Authenticated |
| `/ai-review` | AI Review result | Authenticated |
| `/settings` | Reminder preferences | Authenticated |

### 6.3 Redirect rules

- Unauthenticated user opening protected route redirects to `/login`.
- Authenticated user opening `/login` or `/register` redirects to `/dashboard`.
- User clicking logout clears session/token and redirects to `/`.

---

## 7. Feature Requirements

## 7.1 Feature: Public Landing Page

### 7.1.1 Purpose

The landing page helps first-time visitors quickly understand SubGuardAI and choose to register or log in.

### 7.1.2 Route

```text
GET /
```

### 7.1.3 Required elements

The landing page must include:

1. Header with product name: **SubGuardAI**.
2. Primary navigation actions:
   - **Login** button.
   - **Register** button.
3. Hero section:
   - Headline: `Stop losing money on forgotten subscriptions`
   - Subheadline: `Track your subscriptions, see your real monthly cost, get billing reminders, and let AI highlight what may be worth reviewing.`
   - Primary CTA: **Register Free**
   - Secondary CTA: **Login**
4. Value proposition cards:
   - `Track recurring costs`
   - `Get billing reminders`
   - `Find possible savings with AI`
5. How it works section:
   - Add your subscriptions.
   - See monthly and yearly cost.
   - Review AI suggestions.
   - Mark cancellation candidates.
6. Target-user section:
   - Young professionals.
   - Families.
   - Freelancers / remote workers.
7. Mock premium teaser:
   - `Premium AI Review and smarter reminders are coming soon.`
8. Footer with:
   - Product name.
   - Short privacy disclaimer: `For MVP validation, only manually entered subscription data is used.`

### 7.1.4 UI behavior

- Clicking **Register**, **Register Free**, or **Get Started** routes to `/register`.
- Clicking **Login** routes to `/login`.
- If user is already authenticated:
  - Primary CTA routes to `/dashboard`.
  - Login button may be replaced with **Dashboard**.
- Landing page must be mobile responsive.
- No authenticated subscription data should be fetched on landing page.

### 7.1.5 Acceptance criteria

- User can open landing page without being logged in.
- User sees clear product value within first screen.
- Register button navigates to `/register`.
- Login button navigates to `/login`.
- Authenticated user can navigate to dashboard from landing page.
- Page renders properly on mobile width.
- Page does not expose private user data.
- Page has no broken CTA.

---

## 7.2 Feature: Authentication and Authorization

### 7.2.1 Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | User can register with email and password. | MVP |
| FR-002 | User can log in with email and password. | MVP |
| FR-003 | User can log out. | MVP |
| FR-004 | User can only view, edit, delete, and review their own subscriptions. | MVP |
| FR-005 | System prevents unauthenticated users from accessing dashboard pages. | MVP |

### 7.2.2 Validation rules

- Email must be valid format.
- Password minimum length: 8 characters.
- Duplicate email registration returns clear error.
- Invalid login returns generic error: `Invalid email or password`.
- Password must be hashed before storing.
- Never return `passwordHash` from API.

### 7.2.3 Acceptance criteria

- Valid registration creates user and redirects to `/dashboard`.
- Valid login redirects to `/dashboard`.
- Invalid login shows error and does not create session.
- Logout clears session/token.
- Unauthenticated access to `/dashboard` redirects to `/login`.
- Authenticated users cannot access other users' subscription data.

---

## 7.3 Feature: Subscription Management

### 7.3.1 Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-006 | User can add a subscription manually. | MVP |
| FR-007 | User can edit an existing subscription. | MVP |
| FR-008 | User can delete a subscription after confirmation. | MVP |
| FR-009 | User can mark subscription as cancelled. | MVP |
| FR-010 | User can mark/unmark a subscription as a cancellation candidate. | MVP |
| FR-011 | User can view all subscriptions in a list. | MVP |
| FR-012 | User can filter subscriptions by status and category. | MVP |
| FR-013 | User can sort subscriptions by next billing date. | MVP |

### 7.3.2 Subscription fields

| Field | Type | Required | Rule |
|---|---|---|---|
| `name` | string | yes | 2–80 characters |
| `price` | number | yes | greater than 0 |
| `currency` | enum | yes | `IDR` only |
| `billingCycle` | enum | yes | `MONTHLY` or `YEARLY` |
| `nextBillingDate` | date | yes | today or future preferred; past allowed with warning |
| `category` | enum | yes | fixed category enum |
| `status` | enum | yes | fixed status enum |
| `paymentMethod` | string/enum | optional | e-wallet, debit, credit card, bank transfer, app store, other |
| `usageFrequency` | enum | yes | `OFTEN`, `SOMETIMES`, `RARELY`, `NOT_SURE` |
| `isCancellationCandidate` | boolean | yes | default false |
| `notes` | string | optional | max 500 characters |

### 7.3.3 Category enum

```ts
type SubscriptionCategory =
  | "ENTERTAINMENT"
  | "WORK_TOOLS"
  | "FAMILY"
  | "EDUCATION"
  | "CLOUD"
  | "TELCO"
  | "AI_TOOLS"
  | "OTHER";
```

### 7.3.4 Status enum

```ts
type SubscriptionStatus =
  | "ACTIVE"
  | "TRIAL"
  | "PENDING_CANCELLATION"
  | "CANCELLED";
```

### 7.3.5 Usage frequency enum

```ts
type UsageFrequency =
  | "OFTEN"
  | "SOMETIMES"
  | "RARELY"
  | "NOT_SURE";
```

### 7.3.6 Acceptance criteria

- Valid subscription saves and appears in the list.
- Invalid price shows validation error.
- Empty name shows validation error.
- Empty next billing date shows validation error.
- Duplicate service names are allowed but may show warning.
- Delete action requires confirmation.
- Cancelled subscription is excluded from active spending and upcoming billing.
- Editing price, status, or cycle recalculates summary.

---

## 7.4 Feature: Dashboard Summary

### 7.4.1 Functional requirements

| ID | Requirement |
|---|---|
| FR-014 | System calculates estimated monthly spend from active, trial, and pending-cancellation subscriptions. |
| FR-015 | System calculates estimated yearly spend. |
| FR-016 | System excludes cancelled subscriptions from active spending. |
| FR-017 | System shows active count, trial count, and cancellation candidate count. |
| FR-018 | System shows estimated monthly saving if cancellation candidates are cancelled. |

### 7.4.2 Calculation rules

| Billing cycle | Monthly cost calculation | Yearly cost calculation |
|---|---:|---:|
| Monthly | `price` | `price * 12` |
| Yearly | `price / 12` | `price` |

### 7.4.3 Summary cards

Dashboard must display:

- Estimated monthly spend.
- Estimated yearly spend.
- Active subscription count.
- Trial subscription count.
- Cancellation candidate count.
- Estimated monthly saving.

### 7.4.4 Acceptance criteria

- Monthly and yearly totals are correct.
- Cancelled items are excluded.
- Candidate savings sum normalized monthly cost of candidate subscriptions.
- Empty state appears when user has no subscription.
- If user only has cancelled subscriptions, active spend is zero.

---

## 7.5 Feature: Upcoming Billing and In-App Reminder

### 7.5.1 Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-019 | System shows subscriptions with upcoming billing dates. | MVP |
| FR-020 | System sorts upcoming billing by nearest date. | MVP |
| FR-021 | System highlights billing due within 7 days. | MVP |
| FR-022 | System excludes cancelled subscriptions from upcoming billing list. | MVP |
| FR-023 | System shows in-app reminder for subscriptions due within 7 days. | MVP |
| FR-024 | User can enable/disable email reminder preference. | Optional MVP |
| FR-025 | System sends email reminder 3 days before billing if enabled. | Optional MVP |

### 7.5.2 Reminder rules

- Use `Asia/Jakarta` timezone for MVP.
- Due soon = `nextBillingDate` is within 7 calendar days.
- Past billing date:
  - Allow save.
  - Show warning: `This billing date has passed. Please update it if needed.`
- Cancelled subscriptions must never appear in reminders.

### 7.5.3 Acceptance criteria

- Upcoming billing list sorted by nearest date.
- Due within 7 days highlighted.
- In-app reminder appears for due-soon items.
- Cancelled subscription due soon does not appear.
- Email reminder preference can be saved even if actual email sending is not enabled.

---

## 7.6 Feature: AI Subscription Review Assistant

### 7.6.1 Purpose

The AI Subscription Review Assistant helps users identify subscriptions worth reviewing, downgrading, or cancelling based on structured subscription data.

The AI should explain recommendations, but final decisions remain with the user.

### 7.6.2 Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-026 | User can click `Review with AI` from dashboard. | MVP |
| FR-027 | System calculates subscription review score before calling LLM. | MVP |
| FR-028 | System sends only relevant subscription data to LLM. | MVP |
| FR-029 | LLM returns structured JSON response. | MVP |
| FR-030 | UI displays overall summary, candidates, reasons, urgency, and estimated savings. | MVP |
| FR-031 | User can mark recommended subscription as cancellation candidate. | MVP |
| FR-032 | System handles AI failure gracefully. | MVP |
| FR-033 | System does not send passwords or unnecessary personal data to LLM. | MVP |

### 7.6.3 Minimum requirement before AI Review

- If user has fewer than 3 non-cancelled subscriptions:
  - Do not call LLM.
  - Show: `Add at least 3 active or trial subscriptions to get a useful AI review.`

### 7.6.4 Review score rules

Backend must calculate review score before the LLM call.

| Condition | Score |
|---|---:|
| Usage = rarely | +3 |
| Usage = not sure | +1 |
| Status = trial | +2 |
| Status = pending cancellation | +2 |
| Billing date within 7 days | +2 |
| Monthly normalized cost > Rp100,000 | +2 |
| Same category has 3+ active subscriptions | +1 |

### 7.6.5 Score interpretation

| Score | Priority |
|---:|---|
| 0–2 | Low priority |
| 3–4 | Medium review priority |
| 5+ | High review priority |

### 7.6.6 Data sent to LLM

Allowed fields:

```ts
type AIReviewInputItem = {
  id: string;
  name: string;
  category: SubscriptionCategory;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  monthlyNormalizedCost: number;
  nextBillingDate: string;
  usageFrequency: UsageFrequency;
  reviewScore: number;
};
```

Do not send:

- User email.
- Password.
- Password hash.
- Session token.
- Notes if they may contain private information.
- Payment credentials.
- Any unnecessary personal data.

### 7.6.7 Expected LLM JSON response

The LLM must return JSON only.

```ts
type AIReviewResponse = {
  overallSummary: string;
  totalPotentialMonthlySaving: number;
  recommendations: Array<{
    subscriptionId: string;
    name: string;
    urgency: "LOW" | "MEDIUM" | "HIGH";
    reason: string;
    estimatedMonthlySaving: number;
    suggestedAction: "REVIEW" | "CONSIDER_CANCEL" | "CONSIDER_DOWNGRADE" | "CHECK_BEFORE_BILLING" | "KEEP";
  }>;
  disclaimer: string;
};
```

### 7.6.8 AI guardrails

The AI must:

- Use soft language:
  - `Review`
  - `Consider cancelling`
  - `Check before billing`
  - `Consider downgrading`
- Never say: `You must cancel this`.
- Clearly say when data is insufficient.
- Not provide broad financial advice beyond subscription cost review.
- Not claim to know real usage beyond user-provided usage frequency.
- Not recommend cancelling critical services when usage is unclear.
- Return structured JSON only.
- Be validated before rendering.

### 7.6.9 Fallback behavior

If LLM fails, times out, or returns invalid JSON:

- Show user-friendly error:
  - `AI review is temporarily unavailable. You can still review candidates manually based on usage and cost.`
- Do not crash UI.
- Log failure in `AIReviewLog`.
- Allow retry.

### 7.6.10 Acceptance criteria

- Fewer than 3 subscriptions prompts user to add more.
- 3+ subscriptions produce AI Review.
- Result includes:
  - Overall summary.
  - Recommendations.
  - Urgency.
  - Reason.
  - Estimated monthly saving.
  - Suggested action.
- User can mark recommended item as candidate.
- Invalid JSON does not crash app.
- Backend calculation remains source of truth for estimated saving.

---

## 7.7 Feature: Mock Premium Interest

### 7.7.1 Purpose

Validate whether users show interest in paying for premium functionality without collecting payment.

### 7.7.2 Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-034 | Dashboard shows `Upgrade to Premium` or `Unlock Premium AI Review` CTA. | MVP |
| FR-035 | Clicking CTA opens modal explaining premium is coming soon. | MVP |
| FR-036 | User can click `Notify me` or `Join waitlist`. | MVP |
| FR-037 | System records premium interest event. | MVP |
| FR-038 | No payment is collected in MVP. | MVP |

### 7.7.3 Modal copy

Title:

```text
Premium is coming soon
```

Body:

```text
We are testing interest in smarter AI review, advanced reminders, and savings insights. No payment is needed now.
```

Buttons:

- `Join waitlist`
- `Maybe later`

### 7.7.4 Acceptance criteria

- CTA opens modal.
- Waitlist click creates `PremiumInterest` row.
- Waitlist click logs analytics event.
- No payment page is opened.
- No card or bank data is requested.

---

## 8. Screens

## 8.1 Landing Page

### Required UI sections

1. Header:
   - Logo/name: `SubGuardAI`
   - Buttons: `Login`, `Register`
2. Hero:
   - Headline.
   - Subheadline.
   - CTA buttons.
3. Value cards.
4. How it works.
5. Target users.
6. Premium teaser.
7. Footer.

### Empty states

Not applicable.

### Error states

Landing page should render static content even if API is unavailable.

---

## 8.2 Login Page

Required elements:

- Email input.
- Password input.
- Login button.
- Link to register.
- Validation error.
- Loading state.

Acceptance criteria:

- Valid credentials route to dashboard.
- Invalid credentials show generic error.
- Button disabled while loading.

---

## 8.3 Register Page

Required elements:

- Email input.
- Password input.
- Confirm password input.
- Register button.
- Link to login.
- Validation error.
- Loading state.

Acceptance criteria:

- Valid registration creates account and routes to dashboard.
- Duplicate email shows clear error.
- Password mismatch shows error.

---

## 8.4 Dashboard

Required elements:

- Monthly spend card.
- Yearly spend card.
- Active count card.
- Trial count card.
- Candidate count card.
- Estimated saving card.
- Upcoming billing section.
- In-app reminder alert.
- AI Review CTA.
- Add Subscription CTA.
- Premium CTA.
- Subscription summary list or link to full list.

Acceptance criteria:

- Dashboard loads under 2 seconds for 100 subscriptions.
- Summary updates after CRUD.
- Empty state prompts user to add first subscription.

---

## 8.5 Subscription List

Required elements:

- Service name.
- Category.
- Price.
- Billing cycle.
- Next billing date.
- Status.
- Usage frequency.
- Candidate indicator.
- Edit button.
- Delete button.
- Mark/unmark candidate button.
- Filters by status and category.
- Sort by next billing date.

---

## 8.6 Add/Edit Subscription

Required elements:

- Name.
- Price.
- Billing cycle.
- Next billing date.
- Category.
- Status.
- Usage frequency.
- Payment method.
- Notes.
- Save button.
- Cancel button.
- Validation/loading/error states.

---

## 8.7 AI Review Result

Required elements:

- Overall summary.
- Total potential monthly saving.
- Recommendation list.
- Urgency.
- Reason.
- Estimated monthly saving.
- Suggested action.
- Mark candidate button.
- Retry button if failed.

---

## 8.8 Premium Modal

Required elements:

- Coming soon message.
- Benefits.
- Join waitlist button.
- Close button.

---

## 9. Technical Architecture

## 9.1 High-level architecture

| Layer | Responsibility |
|---|---|
| TanStack React frontend | UI, forms, dashboard, routing. |
| TanStack Query | Client API state and mutations. |
| Hono API backend | REST API, auth middleware, business logic. |
| Prisma ORM | Database access. |
| PostgreSQL | Persistent data. |
| Auth system | Registration, login, session/token handling. |
| LLM service wrapper | AI review request and structured response validation. |
| Reminder logic | In-app reminder calculation; optional worker for email later. |
| Analytics layer | Event tracking. |

## 9.2 Recommended repository structure

```text
subguardai/
  README.md
  PRD.md
  package.json
  pnpm-workspace.yaml
  .env.example
  apps/
    api/
      package.json
      src/
        index.ts
        app.ts
        config/
          env.ts
        middleware/
          auth.ts
          error-handler.ts
        modules/
          auth/
            auth.routes.ts
            auth.service.ts
            auth.schema.ts
          subscriptions/
            subscriptions.routes.ts
            subscriptions.service.ts
            subscriptions.schema.ts
            subscription-calculations.ts
          dashboard/
            dashboard.routes.ts
            dashboard.service.ts
          ai/
            ai.routes.ts
            ai.service.ts
            ai.schema.ts
            review-scoring.ts
            llm-provider.ts
          reminders/
            reminders.routes.ts
            reminders.service.ts
          premium/
            premium.routes.ts
            premium.service.ts
          analytics/
            analytics.service.ts
        utils/
          date.ts
          money.ts
    web/
      package.json
      src/
        main.tsx
        router.tsx
        app.tsx
        lib/
          api-client.ts
          auth.ts
          format.ts
        components/
          layout/
          ui/
          subscriptions/
          dashboard/
          ai/
        pages/
          landing-page.tsx
          login-page.tsx
          register-page.tsx
          dashboard-page.tsx
          subscriptions-page.tsx
          subscription-form-page.tsx
          ai-review-page.tsx
          settings-page.tsx
  packages/
    db/
      package.json
      prisma/
        schema.prisma
        seed.ts
      src/
        client.ts
    shared/
      package.json
      src/
        types.ts
        constants.ts
        validation.ts
```

## 9.3 Environment variables

Create `.env.example`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/subguardai"
JWT_SECRET="replace-with-secure-secret"
APP_URL="http://localhost:5173"
API_URL="http://localhost:3000"

# Optional for AI Review
LLM_PROVIDER="mock"
OPENAI_API_KEY=""

# Optional later
EMAIL_PROVIDER="none"
EMAIL_FROM=""
```

## 9.4 Recommended package scripts

Root `package.json` should include:

```json
{
  "scripts": {
    "dev": "pnpm -r dev",
    "dev:web": "pnpm --filter web dev",
    "dev:api": "pnpm --filter api dev",
    "db:generate": "pnpm --filter db prisma generate",
    "db:migrate": "pnpm --filter db prisma migrate dev",
    "db:seed": "pnpm --filter db seed",
    "typecheck": "pnpm -r typecheck",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test"
  }
}
```

---

## 10. Database Schema

## 10.1 Prisma schema

Use this schema as the starting point.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Currency {
  IDR
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

enum SubscriptionCategory {
  ENTERTAINMENT
  WORK_TOOLS
  FAMILY
  EDUCATION
  CLOUD
  TELCO
  AI_TOOLS
  OTHER
}

enum SubscriptionStatus {
  ACTIVE
  TRIAL
  PENDING_CANCELLATION
  CANCELLED
}

enum UsageFrequency {
  OFTEN
  SOMETIMES
  RARELY
  NOT_SURE
}

enum ReminderType {
  IN_APP
  EMAIL
}

enum ReminderLogStatus {
  PENDING
  SENT
  FAILED
  SKIPPED
}

enum AIReviewLogStatus {
  SUCCESS
  FAILED
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  subscriptions      Subscription[]
  reminderPreference ReminderPreference?
  reminderLogs       ReminderLog[]
  aiReviewLogs       AIReviewLog[]
  premiumInterests   PremiumInterest[]
  analyticsEvents    AnalyticsEvent[]
}

model Subscription {
  id                      String               @id @default(cuid())
  userId                  String
  name                    String
  price                   Decimal              @db.Decimal(12, 2)
  currency                Currency             @default(IDR)
  billingCycle            BillingCycle
  nextBillingDate         DateTime
  category                SubscriptionCategory
  status                  SubscriptionStatus
  paymentMethod           String?
  usageFrequency          UsageFrequency
  isCancellationCandidate Boolean              @default(false)
  notes                   String?
  createdAt               DateTime             @default(now())
  updatedAt               DateTime             @updatedAt

  user          User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  reminderLogs  ReminderLog[]

  @@index([userId])
  @@index([userId, status])
  @@index([userId, nextBillingDate])
  @@index([userId, category])
}

model ReminderPreference {
  id                   String   @id @default(cuid())
  userId               String   @unique
  emailReminderEnabled Boolean  @default(false)
  reminderDaysBefore   Int      @default(3)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model ReminderLog {
  id             String            @id @default(cuid())
  userId         String
  subscriptionId String
  reminderType   ReminderType
  scheduledFor   DateTime
  sentAt         DateTime?
  status         ReminderLogStatus @default(PENDING)
  createdAt      DateTime          @default(now())

  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscription Subscription @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([subscriptionId])
}

model AIReviewLog {
  id            String            @id @default(cuid())
  userId        String
  inputSummary  Json
  outputSummary Json?
  status        AIReviewLogStatus
  errorMessage  String?
  createdAt     DateTime          @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model PremiumInterest {
  id        String   @id @default(cuid())
  userId    String
  source    String
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model AnalyticsEvent {
  id        String   @id @default(cuid())
  userId    String?
  eventName String
  properties Json?
  createdAt DateTime @default(now())

  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId])
  @@index([eventName])
}
```

---

## 11. API Requirements

## 11.1 Auth endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Register new user | public |
| POST | `/auth/login` | Login user | public |
| POST | `/auth/logout` | Logout user | required |
| GET | `/auth/me` | Get current user | required |

### POST `/auth/register`

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

### POST `/auth/login`

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com"
  },
  "token": "jwt_token"
}
```

---

## 11.2 Subscription endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/subscriptions` | Get user subscriptions | required |
| POST | `/subscriptions` | Create subscription | required |
| GET | `/subscriptions/:id` | Get subscription detail | required |
| PATCH | `/subscriptions/:id` | Update subscription | required |
| DELETE | `/subscriptions/:id` | Delete subscription | required |
| PATCH | `/subscriptions/:id/candidate` | Mark/unmark cancellation candidate | required |
| PATCH | `/subscriptions/:id/status` | Update status | required |

### Create/update request body

```json
{
  "name": "Netflix",
  "price": 186000,
  "currency": "IDR",
  "billingCycle": "MONTHLY",
  "nextBillingDate": "2026-07-15",
  "category": "ENTERTAINMENT",
  "status": "ACTIVE",
  "paymentMethod": "Credit card",
  "usageFrequency": "SOMETIMES",
  "isCancellationCandidate": false,
  "notes": "Family streaming plan"
}
```

### Standard subscription response

```json
{
  "id": "subscription_id",
  "name": "Netflix",
  "price": 186000,
  "currency": "IDR",
  "billingCycle": "MONTHLY",
  "nextBillingDate": "2026-07-15",
  "category": "ENTERTAINMENT",
  "status": "ACTIVE",
  "paymentMethod": "Credit card",
  "usageFrequency": "SOMETIMES",
  "isCancellationCandidate": false,
  "notes": "Family streaming plan",
  "createdAt": "2026-07-03T00:00:00.000Z",
  "updatedAt": "2026-07-03T00:00:00.000Z"
}
```

---

## 11.3 Dashboard endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/dashboard/summary` | Get spending summary | required |
| GET | `/dashboard/upcoming-billing` | Get upcoming billing list | required |

### GET `/dashboard/summary`

Response:

```json
{
  "estimatedMonthlySpend": 550000,
  "estimatedYearlySpend": 6600000,
  "activeSubscriptionCount": 5,
  "trialSubscriptionCount": 1,
  "cancellationCandidateCount": 2,
  "estimatedMonthlySaving": 175000
}
```

### GET `/dashboard/upcoming-billing`

Response:

```json
{
  "items": [
    {
      "id": "subscription_id",
      "name": "Canva",
      "price": 95000,
      "currency": "IDR",
      "billingCycle": "MONTHLY",
      "nextBillingDate": "2026-07-08",
      "daysUntilBilling": 5,
      "isDueSoon": true,
      "status": "ACTIVE"
    }
  ]
}
```

---

## 11.4 AI endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/ai/subscription-review` | Generate AI subscription review | required |

### POST `/ai/subscription-review`

Request body:

```json
{}
```

Response:

```json
{
  "overallSummary": "You have 2 subscriptions worth reviewing this week.",
  "totalPotentialMonthlySaving": 175000,
  "recommendations": [
    {
      "subscriptionId": "subscription_id",
      "name": "Canva",
      "urgency": "HIGH",
      "reason": "This subscription is rarely used, costs more than Rp100,000/month, and renews within 7 days.",
      "estimatedMonthlySaving": 95000,
      "suggestedAction": "CHECK_BEFORE_BILLING"
    }
  ],
  "disclaimer": "This review is based only on the subscription data you entered."
}
```

---

## 11.5 Reminder endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/reminders` | Get in-app reminders | required |
| PATCH | `/reminders/preferences` | Update reminder preferences | required |

### GET `/reminders`

Response:

```json
{
  "items": [
    {
      "subscriptionId": "subscription_id",
      "name": "Spotify",
      "nextBillingDate": "2026-07-06",
      "daysUntilBilling": 3,
      "message": "Spotify renews in 3 days."
    }
  ]
}
```

### PATCH `/reminders/preferences`

Request:

```json
{
  "emailReminderEnabled": false,
  "reminderDaysBefore": 3
}
```

Response:

```json
{
  "emailReminderEnabled": false,
  "reminderDaysBefore": 3
}
```

---

## 11.6 Premium endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/premium/interest` | Record premium interest | required |

Request:

```json
{
  "source": "dashboard_premium_cta"
}
```

Response:

```json
{
  "success": true
}
```

---

## 12. Business Logic

## 12.1 Monthly normalized cost

```ts
function getMonthlyNormalizedCost(price: number, billingCycle: "MONTHLY" | "YEARLY") {
  if (billingCycle === "MONTHLY") return price;
  return price / 12;
}
```

## 12.2 Yearly normalized cost

```ts
function getYearlyNormalizedCost(price: number, billingCycle: "MONTHLY" | "YEARLY") {
  if (billingCycle === "MONTHLY") return price * 12;
  return price;
}
```

## 12.3 Active spending inclusion

Include statuses:

- `ACTIVE`
- `TRIAL`
- `PENDING_CANCELLATION`

Exclude status:

- `CANCELLED`

## 12.4 Estimated monthly saving

Sum monthly normalized cost for all subscriptions where:

```ts
isCancellationCandidate === true
status !== "CANCELLED"
```

## 12.5 Due soon

```ts
daysUntilBilling >= 0 && daysUntilBilling <= 7
```

Use `Asia/Jakarta` timezone for date logic in MVP.

---

## 13. Analytics Events

Implement simple server-side event logging into `AnalyticsEvent`.

| Area | Event name | Trigger / properties |
|---|---|---|
| Landing | `landing_viewed` | User opens landing page; anonymous if unauthenticated. |
| Landing | `landing_register_clicked` | User clicks register CTA; location. |
| Landing | `landing_login_clicked` | User clicks login CTA; location. |
| Onboarding | `user_registered` | User creates account; userId, createdAt. |
| Onboarding | `onboarding_completed` | User adds 3rd subscription; userId, subscriptionCount. |
| Subscription | `subscription_created_manual` | User creates subscription; category, status, billingCycle, priceRange. |
| Subscription | `subscription_updated` | User edits subscription; changedFields. |
| Subscription | `subscription_deleted` | User deletes subscription; category. |
| Subscription | `subscription_status_changed` | Status changes; fromStatus, toStatus. |
| Subscription | `subscription_marked_candidate` | Candidate marked; subscriptionId, monthlyCost. |
| Dashboard | `dashboard_viewed` | Dashboard opened; activeSubscriptionCount, totalMonthlySpend. |
| Dashboard | `upcoming_billing_viewed` | Upcoming billing section viewed; dueSoonCount. |
| Dashboard | `estimated_saving_viewed` | Saving estimate viewed; estimatedMonthlySaving. |
| Reminder | `reminder_in_app_shown` | In-app reminder shown; daysBeforeBilling. |
| Reminder | `reminder_clicked` | User clicks reminder; reminderType, subscriptionId. |
| AI | `ai_review_clicked` | User clicks AI Review; subscriptionCount. |
| AI | `ai_review_completed` | AI succeeds; recommendationCount, totalPotentialSaving. |
| AI | `ai_review_failed` | AI fails; errorType. |
| AI | `ai_recommendation_candidate_marked` | User marks AI recommendation as candidate. |
| Premium | `premium_cta_clicked` | User clicks premium CTA; location. |
| Premium | `premium_waitlist_joined` | User joins waitlist. |

---

## 14. Success Metrics

### 14.1 Primary MVP metric

| Metric | Definition | MVP target |
|---|---|---|
| Average subscriptions added per activated user | Average subscriptions added by users who create at least 1 subscription. | 5+ subscriptions/user |

### 14.2 Supporting metrics

| Category | Metric | Definition | MVP target |
|---|---|---|---|
| Activation | Activation rate | % registered users who add at least 3 subscriptions. | 50% |
| Activation | Time to first subscription | Median time from registration to first subscription. | < 5 minutes |
| Engagement | Reminder engagement rate | % reminders clicked or acted on. | 25–35% |
| Engagement | AI review usage rate | % activated users who click AI Review. | 30–40% |
| Savings | Cancellation candidate rate | % activated users who mark at least 1 candidate. | 30% |
| Savings | Average estimated monthly saving | Candidate normalized monthly cost per user with candidates. | Rp50k–Rp250k |
| Monetization | Premium CTA click rate | % activated users who click premium CTA. | 5–10% |
| Monetization | Premium waitlist conversion | % CTA clickers who join waitlist. | 30–50% |
| Retention | D7 retention | % users returning within 7 days. | 25–35% |
| Retention | D30 retention | % users returning within 30 days. | 20–30% |
| Retention | D90 retention | Future long-term retention metric. | Track later |

---

## 15. Non-Functional Requirements

| Area | Requirement | MVP target |
|---|---|---|
| Performance | Dashboard should load quickly for typical user data. | < 2 seconds for 100 subscriptions |
| Security | User data must be isolated by user ID. | Required |
| Privacy | Only necessary data sent to LLM. | Required |
| Reliability | CRUD actions should not lose data. | Required |
| Error handling | User should receive clear error messages. | Required |
| Responsiveness | Works on desktop and mobile browser. | Required |
| Observability | Key events should be tracked. | Required |
| Maintainability | API and frontend should have clear module separation. | Required |

---

## 16. Security and Privacy Requirements

### 16.1 Authentication

- Store hashed passwords only.
- Use secure JWT secret.
- Do not expose password hash in API response.
- Use middleware to protect all authenticated routes.
- Frontend stores token in a secure approach suitable for MVP.
  - Prefer httpOnly cookie if implemented.
  - If using localStorage for speed, document the tradeoff.

### 16.2 Authorization

Every subscription query must include:

```ts
where: {
  id: subscriptionId,
  userId: currentUser.id
}
```

Never query subscription by `id` only for protected operations.

### 16.3 LLM privacy

Do not send:

- Email.
- Password.
- Password hash.
- Full notes.
- Tokens.
- Any payment credential.
- Any unrelated profile data.

### 16.4 Public launch requirement

Before wider beta/public launch, add:

- Privacy policy.
- Terms or usage disclaimer.
- AI data usage disclaimer.

For MVP closed beta, include lightweight disclaimer on AI Review page:

```text
AI Review uses only the subscription data you entered. Do not add sensitive payment credentials or private information in notes.
```

---

## 17. QA Test Scenarios

| Scenario | Expected result |
|---|---|
| Open landing page | Page loads publicly with Register and Login buttons. |
| Click landing Register | User routes to `/register`. |
| Click landing Login | User routes to `/login`. |
| Register new user | User can access empty dashboard. |
| Register duplicate email | Clear error appears. |
| Login valid user | User enters dashboard. |
| Login invalid user | Generic error appears. |
| Unauthenticated dashboard access | User is redirected to login. |
| Add monthly subscription | Subscription appears and monthly spend updates. |
| Add yearly subscription | Monthly and yearly calculations are correct. |
| Edit subscription price | Summary recalculates. |
| Mark subscription cancelled | Subscription is excluded from active spend. |
| Mark cancellation candidate | Estimated saving updates. |
| Filter by category | Only matching subscriptions appear. |
| Sort by billing date | Nearest billing appears first. |
| Run AI Review with fewer than 3 subscriptions | User is asked to add more subscriptions. |
| Run AI Review with 3+ subscriptions | Recommendations appear. |
| LLM failure | Error state appears and app does not crash. |
| Delete subscription | Confirmation appears and data is removed. |
| Access another user's subscription | Access denied. |
| Billing due within 7 days | In-app reminder appears. |
| Cancelled billing due within 7 days | No reminder appears. |
| Click premium CTA | Premium interest modal appears. |
| Click Join waitlist | Premium interest is recorded. |

---

## 18. Edge Cases and Error States

| Category | Edge case | Expected behavior |
|---|---|---|
| Landing | API unavailable | Landing still renders static content. |
| Landing | Authenticated user visits `/` | CTA can point to dashboard. |
| Input | Price entered as text, zero, or negative | Show validation error. |
| Input | Past billing date | Allow save but show warning. |
| Input | Duplicate service name | Allow but optionally warn similar subscription exists. |
| Input | Yearly price | Normalize monthly cost correctly. |
| Dashboard | No subscriptions | Show empty state and Add Subscription CTA. |
| Dashboard | Only cancelled subscriptions | Show zero active spend and suggest adding active subscription. |
| Reminder | Email provider fails | Log failure; app remains usable. |
| Reminder | Cancelled subscription due soon | Do not remind. |
| AI | Fewer than 3 subscriptions | Ask user to add more. |
| AI | LLM timeout or invalid JSON | Show fallback, log error, allow retry. |
| AI | AI recommends cancelled subscription | Filter cancelled subscriptions before AI call. |
| AI | User has all high-usage subscriptions | AI can say no strong cancellation candidate. |
| Security | User tries another user's subscription ID | Return 404 or 403 without leaking data. |

---

## 19. Rollout Plan

| Day | Focus | Deliverable |
|---:|---|---|
| 1 | Product/tech setup | Finalize scope, schema, routes, UI wireframe. |
| 2 | Auth foundation | Register, login, protected routes. |
| 3 | Landing page + dashboard shell | Public homepage, layout, navigation, empty dashboard. |
| 4 | Subscription CRUD | Add/edit/delete/list. |
| 5 | Dashboard summary | Monthly/yearly calculation, active count. |
| 6 | Upcoming billing | Billing list, due-soon state. |
| 7 | Candidate and saving | Candidate marking, estimated saving. |
| 8 | Reminder MVP | In-app reminder, email preference. |
| 9 | AI Review Assistant | Scoring logic, LLM wrapper, JSON output. |
| 10 | Mock premium and analytics | CTA, waitlist, key events. |
| 11 | QA and polish | Bug fixing, edge cases, empty states. |
| 12 | Internal testing | 5–10 friendly users. |
| 13–14 | Closed beta | 20–30 beta users across target segments. |

---

## 20. CodeX Implementation Tasks

## 20.1 Task 1 — Setup monorepo

Acceptance criteria:

- `pnpm install` works.
- `pnpm dev` starts API and web.
- TypeScript is configured.
- Environment variables are documented in `.env.example`.

Deliverables:

- Root workspace.
- `apps/api`
- `apps/web`
- `packages/db`
- `packages/shared`

---

## 20.2 Task 2 — Implement database

Acceptance criteria:

- Prisma schema created.
- Migration works.
- Prisma client generated.
- Seed file creates sample user and sample subscriptions.

Seed data examples:

- Netflix — Entertainment — monthly.
- Spotify — Entertainment — monthly.
- ChatGPT — AI Tools — monthly.
- Canva — Work Tools — monthly.
- Google Workspace — Work Tools — yearly.
- Telkomsel package — Telco — monthly.

---

## 20.3 Task 3 — Implement auth

Acceptance criteria:

- Register API works.
- Login API works.
- Auth middleware works.
- Frontend register/login pages work.
- Protected routes redirect correctly.

---

## 20.4 Task 4 — Implement landing page

Acceptance criteria:

- `/` page is public.
- Register and Login buttons are visible in header and hero.
- CTA routing works.
- Page is responsive.
- No private API call is required to render landing page.

---

## 20.5 Task 5 — Implement subscription CRUD

Acceptance criteria:

- User can create, read, update, delete own subscriptions.
- API validates input.
- Frontend form handles errors.
- User cannot access another user's subscriptions.

---

## 20.6 Task 6 — Implement dashboard summary

Acceptance criteria:

- Summary endpoint returns correct normalized spend.
- Dashboard cards render correctly.
- Summary updates after mutation.

---

## 20.7 Task 7 — Implement upcoming billing and reminders

Acceptance criteria:

- Upcoming billing sorted by nearest date.
- Due-soon item highlighted.
- In-app reminder appears.
- Cancelled items excluded.

---

## 20.8 Task 8 — Implement candidate and saving flow

Acceptance criteria:

- User can mark/unmark candidate.
- Estimated monthly saving updates.
- Candidate count updates.

---

## 20.9 Task 9 — Implement AI Review

Acceptance criteria:

- Review score calculated in backend.
- Fewer than 3 subscriptions does not call LLM.
- Mock LLM provider works if `LLM_PROVIDER=mock`.
- Real LLM provider can be added behind wrapper.
- JSON response validated before rendering.
- Failure logged gracefully.

---

## 20.10 Task 10 — Implement premium interest

Acceptance criteria:

- Premium CTA visible.
- Modal opens.
- Join waitlist calls API.
- `PremiumInterest` row created.
- Analytics event logged.

---

## 20.11 Task 11 — Implement analytics logging

Acceptance criteria:

- Major events are logged.
- Logging failure does not block main user action.

---

## 20.12 Task 12 — QA and polish

Acceptance criteria:

- Test scenarios pass.
- Empty states are helpful.
- Loading states are visible.
- Error states are user-friendly.
- Mobile layout works.

---

## 21. Suggested Frontend Copy

### 21.1 Landing page

Headline:

```text
Stop losing money on forgotten subscriptions
```

Subheadline:

```text
Track your subscriptions, see your real monthly cost, get billing reminders, and let AI highlight what may be worth reviewing.
```

Primary CTA:

```text
Register Free
```

Secondary CTA:

```text
Login
```

Value cards:

```text
Track recurring costs
See all monthly and yearly subscription spending in one place.
```

```text
Get billing reminders
Know what will renew soon before the payment happens.
```

```text
Find possible savings with AI
Review rarely used or expensive subscriptions before renewal.
```

### 21.2 Empty dashboard

```text
Your subscription list is empty
Add your first subscription to start seeing your monthly and yearly recurring cost.
```

CTA:

```text
Add Subscription
```

### 21.3 AI Review minimum data

```text
Add at least 3 active or trial subscriptions to get a useful AI review.
```

### 21.4 AI fallback

```text
AI review is temporarily unavailable. You can still review candidates manually based on usage and cost.
```

### 21.5 Premium modal

```text
Premium is coming soon
We are testing interest in smarter AI review, advanced reminders, and savings insights. No payment is needed now.
```

---

## 22. Definition of Done

MVP is done when:

1. User can open the landing page.
2. User can register.
3. User can log in.
4. User can add at least 3 subscriptions.
5. User can see monthly and yearly spending.
6. User can see upcoming billing.
7. User can see in-app reminders for due-soon subscriptions.
8. User can mark cancellation candidates.
9. User can see estimated monthly saving.
10. User can run AI Review.
11. User can join premium waitlist.
12. Authorization prevents cross-user data access.
13. Basic analytics events are logged.
14. QA scenarios pass.
15. App works on desktop and mobile browser.

---

## 23. Final MVP Recommendation

Build SubGuardAI as a focused responsive web MVP, not as a broad finance app.

The first version must prove four things:

1. Users are willing to enter subscription data manually.
2. Users care about seeing true recurring cost.
3. Users value reminders before billing.
4. Users find AI-assisted review useful enough to consider premium features.

The added public landing page is important because it gives the MVP a clear acquisition and onboarding entry point. It should be simple, fast, and conversion-focused, with visible **Register** and **Login** buttons.
