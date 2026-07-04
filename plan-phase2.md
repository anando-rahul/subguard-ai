# SubGuardAI Phase 2 Implementation Plan

## 1. Objective

Implement the next product loop defined in `PRD.md` using the repository's existing database, architecture, packages, and UI system:

1. Add, list, view, edit, delete, and update subscriptions.
2. Show normalized monthly and yearly recurring costs.
3. Show upcoming billing and in-app reminders.
4. Mark or unmark cancellation candidates and estimate potential monthly savings.

This document is the implementation plan only. Creating it does not authorize Phase 2 application-code changes.

## 2. Phase boundary

### Included

- PRD Task 5: subscription CRUD.
- PRD Task 6: dashboard summary.
- PRD Task 7: upcoming billing and in-app reminders.
- PRD Task 8: cancellation-candidate and saving flow.
- English and Bahasa Indonesia copy for every new screen and state.
- Authorization, validation, responsive behavior, accessibility, and test coverage for these features.

### Deferred

- AI Subscription Review.
- Premium-interest modal and waitlist persistence.
- Analytics event persistence.
- Email reminder preferences and email delivery.
- Workers or scheduled jobs.
- Multi-currency support.
- Bank, e-wallet, email, App Store, or Play Store integrations.

In-app reminders are calculated from live subscription data. They do not require reminder-log records or a background worker in this phase.

## 3. Existing-system constraints

- Keep the pnpm monorepo and current workspace structure.
- Keep TanStack React, TanStack Router, TanStack Query, Hono, Zod, Prisma, PostgreSQL, Better Auth, Tailwind, and `@repo/ui`.
- Extend the existing Prisma schema and PostgreSQL database. Do not replace the database, recreate the initial migration, or modify Better Auth tables.
- Add one forward-only Prisma migration for Phase 2.
- Continue using Better Auth's httpOnly session cookie and the existing `loadAuthSession` middleware.
- Continue using the typed Hono client from `@repo/api-client`; do not add a second HTTP client.
- Use existing `@repo/ui` primitives. Do not install another component, form, icon, date, state, or validation library.
- Keep platform colors in `apps/platform/src/styles.css`; do not recolor the shared UI package.
- Preserve all unrelated working-tree changes.
- Do not hand-edit `apps/platform/src/routeTree.gen.ts`; regenerate it through the existing TanStack Router tooling.

## 4. Current-state audit

- Phase 1 already provides a public `/` route, login and registration, a protected `/dashboard`, a shared SubGuardAI shell, and bilingual copy.
- The dashboard currently shows authenticated account data and an honest empty placeholder. It does not fetch product data.
- The API currently exposes health, session, Better Auth, and admin-user routes.
- The Prisma schema currently contains only Better Auth user/session/account/verification models.
- The existing `User` model uses Better Auth's string ID. Phase 2 records must reference that exact ID.
- Prisma is already configured through `apps/api/src/utils/prisma.ts` and the existing PostgreSQL connection.
- `@repo/api-client` already derives its types from the Hono `AppType` and sends cookies with requests.
- Vitest, TypeScript checks, Biome, and production builds are already available. No new test runner is required.

## 5. Data model and migration

Add only the schema required by Phase 2.

### Enums

```prisma
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
```

### Subscription model

```prisma
model Subscription {
  id                      String               @id @default(cuid())
  userId                  String
  name                    String
  price                   Decimal              @db.Decimal(12, 2)
  currency                Currency             @default(IDR)
  billingCycle            BillingCycle
  nextBillingDate         DateTime             @db.Date
  category                SubscriptionCategory
  status                  SubscriptionStatus
  paymentMethod           String?
  usageFrequency          UsageFrequency
  isCancellationCandidate Boolean              @default(false)
  notes                   String?
  createdAt               DateTime             @default(now())
  updatedAt               DateTime             @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, status])
  @@index([userId, nextBillingDate])
  @@index([userId, category])
}
```

Add `subscriptions Subscription[]` to the existing `User` model. Use PostgreSQL `date` semantics for `nextBillingDate` because a billing day is a calendar date, not an instant.

### Migration rules

- Generate a new named migration such as `add_subscriptions_phase2`.
- Inspect the generated SQL before applying it.
- Apply it to the existing development database without dropping or recreating current tables.
- Regenerate Prisma Client.
- Do not add reminder, AI, premium, or analytics tables in this phase.

## 6. Shared domain rules

Create small pure utilities on the API side and test them independently.

### Money

- IDR is the only accepted currency.
- Store price as Prisma `Decimal`; never store currency values in floating-point database columns.
- Monthly normalization:
  - `MONTHLY`: `price`.
  - `YEARLY`: `price / 12`.
- Yearly normalization:
  - `MONTHLY`: `price * 12`.
  - `YEARLY`: `price`.
- Perform aggregation with Prisma `Decimal`, then serialize API totals as JSON numbers.
- Format values on the frontend with `Intl.NumberFormat` and the active locale. Do not hard-code currency separators.

### Spending inclusion

- Include `ACTIVE`, `TRIAL`, and `PENDING_CANCELLATION` in monthly and yearly spending.
- Exclude `CANCELLED` from spending, savings, upcoming billing, and reminders.
- `activeSubscriptionCount` counts only `ACTIVE`.
- `trialSubscriptionCount` counts only `TRIAL`.
- Candidate count and candidate savings include candidates whose status is not `CANCELLED`.

### Dates

- API requests and responses use `YYYY-MM-DD` for `nextBillingDate`.
- Validate date-only values strictly; reject impossible dates such as `2026-02-30`.
- Centralize Jakarta calendar helpers in one API utility. Do not calculate billing days from browser timezone or raw millisecond differences.
- `daysUntilBilling` is the difference between Jakarta calendar dates.
- Due soon means `daysUntilBilling >= 0 && daysUntilBilling <= 7`.
- Upcoming billing includes non-cancelled items dated today or later and sorts ascending by billing date.
- A past date is allowed during create or edit, but the UI must show the PRD warning before submission and after rendering stale records.

## 7. API modules and contracts

Add two Hono modules and mount them in `apps/api/src/app.ts`:

- `/subscriptions`
- `/dashboard`

Add a reusable `requireUser` helper beside the existing auth middleware. New protected endpoints return `401` when no authenticated user exists.

### Subscription endpoints

| Method | Path | Behavior |
|---|---|---|
| `GET` | `/subscriptions` | List the current user's subscriptions. |
| `POST` | `/subscriptions` | Create a subscription owned by the current user. |
| `GET` | `/subscriptions/:id` | Return one owned subscription for edit/detail loading. |
| `PATCH` | `/subscriptions/:id` | Update allowed fields on one owned subscription. |
| `DELETE` | `/subscriptions/:id` | Delete one owned subscription. |
| `PATCH` | `/subscriptions/:id/candidate` | Set `isCancellationCandidate`. |
| `PATCH` | `/subscriptions/:id/status` | Set subscription status. |

`GET /subscriptions` accepts validated optional query parameters:

- `status`: one `SubscriptionStatus` value.
- `category`: one `SubscriptionCategory` value.
- `sort`: `nextBillingDateAsc` or `nextBillingDateDesc`, defaulting to ascending.

The create body follows the PRD. The update schema is a non-empty partial version of the same fields. Dedicated candidate and status endpoints accept only their relevant field.

Return subscription dates as `YYYY-MM-DD` and prices as numbers. Duplicate names remain valid. The API does not silently change a candidate flag when status changes; summary rules already exclude cancelled candidates.

### Dashboard endpoints

`GET /dashboard/summary` returns:

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

`GET /dashboard/upcoming-billing` returns:

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
      "daysUntilBilling": 4,
      "isDueSoon": true,
      "status": "ACTIVE"
    }
  ]
}
```

The upcoming endpoint returns all future non-cancelled items needed by the dashboard. The UI may show a short preview and link to the full subscription list.

### Validation and errors

- Name: trimmed, 2 to 80 characters.
- Price: numeric, finite, and greater than zero; reject values exceeding the database precision.
- Currency: `IDR` only.
- Billing cycle, category, status, and usage frequency: exact enum values.
- Payment method: optional trimmed string with a documented maximum.
- Notes: optional trimmed string, maximum 500 characters.
- Next billing date: required valid `YYYY-MM-DD`.
- Unknown request fields are stripped or rejected consistently by Zod.
- Validation failures return `400` with stable field-level details.
- Missing owned records return `404` without revealing whether another user owns the ID.
- Unexpected database failures return a generic `500`; database details are not returned to the client.

## 8. Authorization requirements

- Never accept `userId` from a request body or query string.
- Derive ownership only from the authenticated Better Auth user.
- Every list, detail, update, candidate, status, delete, summary, and upcoming query must include `userId`.
- Mutations must use an ownership-constrained `where` condition, not a prior unrestricted lookup.
- Cross-user detail, mutation, and delete attempts must produce the same `404` response as an unknown ID.
- CORS and cookie behavior remain unchanged.

## 9. Frontend architecture

Add a `subscriptions` frontend module matching the existing auth-module conventions:

```text
apps/platform/src/modules/subscriptions/
  hooks/
    use-subscriptions.ts
  services.ts
  schema.ts
  types.ts
  utils.ts
```

Add a small `dashboard` module for summary and upcoming-billing query options:

```text
apps/platform/src/modules/dashboard/
  hooks/use-dashboard.ts
  services.ts
  types.ts
```

Use Hono's typed client in services, TanStack Query for server state, and Zod for form validation. Keep form state local to the route/component; do not add a form library.

### Query keys and invalidation

- Use stable root keys: `['subscriptions']`, `['dashboard', 'summary']`, and `['dashboard', 'upcoming']`.
- List keys include normalized filters and sort parameters.
- Detail keys include the subscription ID.
- Create, update, delete, candidate, and status mutations invalidate all subscription lists plus both dashboard queries.
- Successful edit mutations also refresh or replace the matching detail cache.
- Await invalidation before displaying final success feedback when the next screen depends on refreshed totals.
- Do not use optimistic updates for create, edit, or delete. Candidate toggling may remain pessimistic for consistent rollback behavior.

## 10. Routes and screens

All Phase 2 routes are protected using the same authorization guard as `/dashboard`.

### `/subscriptions`

Required behavior:

- List service name, category, IDR price, billing cycle, billing date, status, usage frequency, and candidate state.
- Provide status and category filters plus billing-date sort.
- Keep filters reflected in URL search parameters so refresh and back navigation preserve them.
- Provide Add, Edit, Delete, status, and Mark or Unmark Candidate actions.
- Use a confirmation dialog before delete.
- Show a stale-date warning for past billing dates.
- Use a responsive table on wide screens and a readable stacked item layout on small screens.
- Show loading skeletons, a first-use empty state, a filtered-empty state, retryable error state, and mutation-pending states.

### `/subscriptions/new`

- Render the shared subscription form in create mode.
- Default currency to `IDR`, status to `ACTIVE`, usage frequency to `NOT_SURE`, and candidate to false.
- On success, navigate to `/subscriptions` and show a success toast.
- Cancel returns to the list without mutation.

### `/subscriptions/$subscriptionId/edit`

- Load only the authenticated user's subscription detail.
- Render the same form in edit mode with server values.
- Handle loading, not-found, general error, and mutation-pending states.
- On success, navigate to `/subscriptions` and show a success toast.

### Shared subscription form

Fields:

- Name.
- Price.
- Billing cycle.
- Next billing date.
- Category.
- Status.
- Usage frequency.
- Payment method.
- Notes.
- Cancellation candidate.

Use accessible labels, descriptions, inline errors, and native date input behavior. Prevent duplicate submission. A past date is valid but displays the exact PRD warning.

### `/dashboard`

Replace the placeholder product area with live Phase 2 data while retaining route protection and logout behavior.

- Show all six PRD summary values.
- Give monthly spend and estimated saving the strongest hierarchy.
- Show upcoming billing ordered by nearest date.
- Show an in-app reminder alert when one or more items are due within seven days.
- Link to `/subscriptions` and `/subscriptions/new`.
- Show an honest empty state when the user has no subscriptions.
- If only cancelled subscriptions exist, display zero active spend and no upcoming reminders.
- Keep summary and upcoming loading/error states independent so one failed request does not hide successful data from the other.
- Do not add AI Review or premium actions in this phase.

### Shared shell

- Add an authenticated `Subscriptions` navigation link.
- Keep public navigation unchanged.
- Ensure mobile navigation remains usable without adding a new navigation dependency.

## 11. Internationalization and formatting

- Add complete English and Bahasa Indonesia keys for navigation, dashboard metrics, reminders, filters, enums, forms, validation, dialogs, toasts, empty states, and API fallback errors.
- Keep enum values in the API and database unchanged; translate only their display labels.
- Use the active locale for IDR formatting and human-readable dates.
- Use the API's date-only string as the source value to avoid browser timezone drift.
- Extend `apps/platform/src/i18n.test.ts` with representative Phase 2 keys in both languages.

## 12. Planned file changes

### Database and API

| File | Planned change |
|---|---|
| `apps/api/prisma/schema.prisma` | Add Phase 2 enums, `Subscription`, and the `User.subscriptions` relation. |
| `apps/api/prisma/migrations/<timestamp>_add_subscriptions_phase2/migration.sql` | Add the forward-only Phase 2 database migration. |
| `apps/api/src/modules/auth/middleware.ts` | Add reusable authenticated-user enforcement. |
| `apps/api/src/modules/subscriptions/schema.ts` | Add request, parameter, and query validation. |
| `apps/api/src/modules/subscriptions/types.ts` | Add serialized API/domain response types where inference is insufficient. |
| `apps/api/src/modules/subscriptions/services.ts` | Add ownership-scoped CRUD operations. |
| `apps/api/src/modules/subscriptions/router.ts` | Add protected subscription endpoints. |
| `apps/api/src/modules/subscriptions/calculations.ts` | Add pure cost normalization and saving calculations. |
| `apps/api/src/modules/dashboard/services.ts` | Add summary and upcoming-billing queries. |
| `apps/api/src/modules/dashboard/router.ts` | Add protected dashboard endpoints. |
| `apps/api/src/utils/date.ts` | Add strict date-only and Jakarta calendar helpers. |
| `apps/api/src/app.ts` | Mount the new routers. |

### Platform

| File | Planned change |
|---|---|
| `apps/platform/src/modules/subscriptions/*` | Add typed services, schemas, types, formatting helpers, queries, and mutations. |
| `apps/platform/src/modules/dashboard/*` | Add summary and upcoming-billing services and queries. |
| `apps/platform/src/routes/subscriptions/index.tsx` | Add the protected list, filters, sorting, actions, and states. |
| `apps/platform/src/routes/subscriptions/new.tsx` | Add the protected create screen. |
| `apps/platform/src/routes/subscriptions/$subscriptionId/edit.tsx` | Add the protected edit screen. |
| `apps/platform/src/components/subscriptions/subscription-form.tsx` | Add the shared create/edit form composition. |
| `apps/platform/src/routes/dashboard.tsx` | Connect real summary, upcoming billing, reminders, and empty states. |
| `apps/platform/src/routes/__root.tsx` | Add authenticated subscription navigation. |
| `apps/platform/src/i18n.ts` | Add Phase 2 English and Indonesian copy. |
| `apps/platform/src/i18n.test.ts` | Add representative Phase 2 translation coverage. |
| `apps/platform/src/routeTree.gen.ts` | Regenerate through TanStack Router tooling only. |

Component extraction may adjust the exact platform file list, but it must not create a second UI system or move product-specific components into `packages/ui` without a demonstrated reusable need.

## 13. Implementation sequence

1. Add pure money/date rules and their unit tests.
2. Extend the Prisma schema, generate and inspect the additive migration, apply it to the existing database, and regenerate Prisma Client.
3. Add authenticated-user enforcement and subscription Zod schemas.
4. Implement ownership-scoped subscription services and endpoints.
5. Implement dashboard summary and upcoming-billing services and endpoints.
6. Add API tests for validation, calculations, filtering, sorting, ownership isolation, cancelled-record exclusion, and due-soon boundaries.
7. Add typed frontend subscription/dashboard services, queries, mutations, and cache invalidation.
8. Build the shared form and protected create/edit routes.
9. Build the subscription list with filters, sorting, candidate/status actions, confirmation, and responsive states.
10. Connect the dashboard to real summary, upcoming billing, and in-app reminder data.
11. Add navigation and complete both locale dictionaries.
12. Regenerate the route tree, run repository checks, and verify the complete flow in the browser on desktop and mobile widths.

## 14. Verification matrix

### Database and API

- [ ] Existing Better Auth records remain intact after migration.
- [ ] Monthly plans normalize to `price` monthly and `price * 12` yearly.
- [ ] Yearly plans normalize to `price / 12` monthly and `price` yearly.
- [ ] Cancelled subscriptions are excluded from spend, savings, upcoming billing, and reminders.
- [ ] Candidate count and savings update after candidate/status changes.
- [ ] Upcoming billing is sorted by nearest valid future date.
- [ ] Day 0 and day 7 are due soon; day 8 and past dates are not.
- [ ] Create and update validation rejects invalid names, prices, enums, dates, and long notes.
- [ ] A past billing date is accepted.
- [ ] Duplicate names are accepted.
- [ ] Every protected endpoint returns `401` without a session.
- [ ] User A cannot read, edit, mark, change status, or delete User B's subscription.
- [ ] An unknown or foreign subscription ID returns `404` without ownership leakage.

### Frontend behavior

- [ ] An unauthenticated visitor is redirected from all subscription routes to login.
- [ ] Add, edit, delete, status update, and candidate toggle persist after refresh.
- [ ] Delete always requires confirmation.
- [ ] Filters and sort survive refresh and browser back navigation.
- [ ] Summary and upcoming data refresh after every relevant mutation.
- [ ] Empty and filtered-empty states lead to a valid next action.
- [ ] Past dates show a non-blocking warning.
- [ ] API failures never produce invented totals or subscription data.
- [ ] All new UI is usable in English and Bahasa Indonesia.
- [ ] Keyboard focus, labels, dialogs, error messages, and touch targets are accessible.
- [ ] The list and forms have no horizontal overflow at common mobile widths.

### Repository checks

- [ ] `pnpm db:generate`
- [ ] `pnpm typecheck`
- [ ] `pnpm lint`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] Browser smoke test for create, edit, filter, candidate, cancel, delete, dashboard totals, reminders, and cross-session isolation.

## 15. Completion boundary

Phase 2 is complete only when an authenticated user can manage only their own subscriptions and every relevant mutation is reflected in real monthly/yearly totals, cancellation savings, upcoming billing, and due-soon reminders. All data must persist in the existing PostgreSQL database, all required empty/loading/error states must be present, both supported locales must work, and the verification matrix must pass without introducing replacement infrastructure or unrelated Phase 3 features.
