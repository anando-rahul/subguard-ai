# SubGuardAI Phase 3 Implementation Plan

## 1. Objective

Add a durable billing-source field to every subscription and a contextual **How To Cancel** flow:

1. Users may optionally identify where a subscription was purchased.
2. Omitted or unselected billing sources are stored as `UNKNOWN`.
3. The subscription list displays the saved billing source.
4. **How To Cancel** shows source-specific cancellation guidance.
5. An `UNKNOWN` source first asks the user where they subscribed, saves that choice, and then shows the relevant guidance.

This document is the implementation plan only. Creating it does not authorize Phase 3 application-code or database changes.

## 2. Phase boundary

### Included

- One new Prisma enum and one non-null `Subscription.billingSource` column.
- A forward-only migration that backfills existing subscriptions to `UNKNOWN` through the database default.
- Billing-source support in subscription create, read, update, serialization, validation, and frontend types.
- An optional billing-source selector in the create/edit form.
- Billing-source labels in English and Bahasa Indonesia.
- A billing-source column in the desktop subscription table and a corresponding value in mobile subscription cards.
- A per-subscription **How To Cancel** action.
- An accessible modal flow for unknown-source selection and source-specific cancellation guidance.
- Persistence of a source selected from the unknown-source modal.
- Automated and manual verification for defaulting, persistence, authorization, rendering, and modal behavior.

### Deferred

- Service-specific cancellation instructions based on the subscription name.
- Deep links into third-party apps, app stores, banks, e-wallets, or telco applications.
- Automatic detection of billing source from payment or email data.
- Calling third-party cancellation APIs or cancelling on the user's behalf.
- Tracking cancellation-flow analytics.
- Reminders or workers related to cancellation.

The guidance is intentionally generic per billing source. It must not claim that SubGuardAI completed the cancellation.

## 3. Existing-system constraints

- Keep the current pnpm monorepo, Prisma/PostgreSQL API, typed Hono client, React Query, TanStack Router, i18n, and `@repo/ui` components.
- Add one forward-only Phase 3 migration. Do not edit the Phase 1 or Phase 2 migrations.
- Do not recreate the database or modify Better Auth tables.
- Do not add a second HTTP client, state library, validation library, icon library, or modal library.
- Reuse the existing protected subscription CRUD routes and query invalidation patterns.
- Use `@repo/ui` dialog, button, radio/select, alert, and tooltip primitives as appropriate.
- Keep all new user-facing copy bilingual.
- Preserve unrelated working-tree changes, especially the existing edits in `apps/platform/src/i18n.ts`, subscription utilities, dashboard code, and utility tests.
- Do not hand-edit generated TanStack Router files. No new route is required for this feature.

## 4. Current-state audit

- `Subscription` currently has no billing-source field.
- Create and edit use the shared `SubscriptionForm` and submit a full `SubscriptionInput`.
- The API create schema is strict; a new field must be deliberately added or it will be rejected.
- The API update schema is a partial form of the create schema, so it can support a billing-source-only update without adding another endpoint.
- The serializer is the single response boundary for subscription records and must include the new field.
- The subscription list already has responsive desktop-table and mobile-card layouts.
- Row actions already use icon buttons, tooltips, confirmation dialogs, and React Query mutations.
- The platform already supports English and Bahasa Indonesia through `apps/platform/src/i18n.ts`.
- The repository has API database integration tests, frontend utility tests, i18n tests, typechecks, Biome checks, and production builds, but no React component test stack.

## 5. Data model and migration

Add this Prisma enum:

```prisma
enum BillingSource {
  APPLE_APP_STORE
  GOOGLE_PLAY
  MERCHANT_WEBSITE
  IN_APP_DIRECT
  E_WALLET
  CARD_OR_BANK
  TELCO_BUNDLE
  INVOICE_MANUAL
  UNKNOWN
}
```

Add this field to `Subscription`:

```prisma
billingSource BillingSource @default(UNKNOWN)
```

### Migration rules

- Generate a new migration named similar to `add_billing_source_phase3`.
- Create the PostgreSQL enum and add a non-null `billingSource` column with default `UNKNOWN`.
- Existing subscription rows must become `UNKNOWN` without a separate nullable transition.
- Keep the database default after migration so direct creates remain safe.
- Inspect generated SQL before applying it.
- Apply the migration to the existing development database and regenerate Prisma Client.
- Do not add an index because Phase 3 does not filter, sort, or aggregate by billing source.

## 6. Billing-source domain contract

Use the following stable values and user-facing labels:

| Enum | English label | Bahasa Indonesia label |
|---|---|---|
| `APPLE_APP_STORE` | Apple App Store | Apple App Store |
| `GOOGLE_PLAY` | Google Play | Google Play |
| `MERCHANT_WEBSITE` | Service Website | Situs Web Layanan |
| `IN_APP_DIRECT` | Inside the Service App | Di Dalam Aplikasi Layanan |
| `E_WALLET` | E-Wallet Recurring Payment | Pembayaran Berulang E-Wallet |
| `CARD_OR_BANK` | Card/Bank Auto-Charge | Debit Otomatis Kartu/Bank |
| `TELCO_BUNDLE` | Telco/Mobile Bundle | Paket Operator Seluler |
| `INVOICE_MANUAL` | Invoice/Manual Renewal | Tagihan/Perpanjangan Manual |
| `UNKNOWN` | I Am Not Sure | Saya Tidak Yakin |

### Defaulting rules

- The form field is optional from the user's perspective.
- New-form state starts at `UNKNOWN`.
- The API create schema defaults a missing `billingSource` to `UNKNOWN`; it must not rely only on the browser to send the value.
- The database column also defaults to `UNKNOWN`.
- Update requests may omit `billingSource`; omission preserves the current value.
- The API rejects values outside the enum.
- API responses always include one concrete billing-source value, including `UNKNOWN`.

This layered default protects browser submissions, older clients, tests, and direct database creates consistently.

## 7. API and type changes

### API schema

- Export a `billingSources` tuple beside the existing subscription enum tuples.
- Add `billingSource: z.enum(billingSources).default("UNKNOWN")` to the create input schema.
- Ensure the partial update schema accepts billing-source-only updates and continues rejecting empty objects.
- Keep the schema strict so misspelled fields remain invalid.

### API service and response

- Add `billingSource` to `SubscriptionResponse`.
- Add it to `serializeSubscription`.
- Map it explicitly in `toUpdateData` so partial updates persist it.
- The existing create service can pass the validated/defaulted value to Prisma.
- Reuse `PATCH /subscriptions/:id` for source selection from the modal. Do not add a redundant endpoint.
- Ownership remains enforced by the existing `{ id, userId }` update condition; another user's record still returns `404`.

### Frontend domain types

- Add the same `billingSources` tuple and derived `BillingSource` type.
- Add `billingSource` to `Subscription`, `SubscriptionInput`, and form values.
- Set `billingSource: "UNKNOWN"` in the empty new-subscription form.
- Include the saved value when mapping a subscription into edit-form values.
- Add a small billing-source-only service function that calls the existing generic PATCH route with `{ billingSource }`.
- Add a React Query mutation using the current subscription/dashboard invalidation convention.

## 8. Create and edit form behavior

- Add a **Billing Source** native select to the shared form near payment information.
- Render all nine enum labels.
- The select starts on **I Am Not Sure** for a new subscription.
- The field is not marked required and produces no validation error when left at `UNKNOWN`.
- Editing an existing migrated record shows **I Am Not Sure**.
- Submission always results in a valid enum value; older/missing API input is still defaulted server-side.
- Keep the existing two-column responsive form layout and keyboard behavior.

The wording should explain that choosing a source enables more relevant cancellation steps, without implying it is mandatory.

## 9. Subscription list changes

### Desktop

- Add a **Billing Source** header and cell.
- Render the localized label rather than the raw enum.
- Increase the table minimum width/column allocation so the new column does not compress service name, dates, or actions.
- Keep actions visible and horizontally scroll the table when the viewport is narrower than the table.

### Mobile/tablet

- Add billing source to the existing definition list in each subscription card.
- Render `UNKNOWN` as **I Am Not Sure** / **Saya Tidak Yakin**, not as an empty fallback.

## 10. How To Cancel interaction

Add one text action labeled **How To Cancel** to each subscription's action area. On compact desktop rows it may use a recognizable help/cancellation icon with an accessible label and tooltip, while mobile cards should expose readable action text where space permits.

### State flow

```text
How To Cancel clicked
  ├─ billingSource is known
  │    └─ open guidance modal for that source
  └─ billingSource is UNKNOWN
       └─ open source-question modal
            ├─ source selected
            │    ├─ persist with PATCH /subscriptions/:id
            │    └─ show matching guidance after success
            ├─ grouped recurring-payment option selected
            │    └─ ask E-wallet vs card/bank, then persist and show guidance
            └─ “I’m not sure” selected
                 └─ show an unknown-source checklist without changing the record
```

### Unknown-source modal

Title:

> Where did you subscribe to this service?

Initial choices, matching the requested eight visible options:

1. Apple App Store
2. Google Play
3. Service website
4. Inside the service app
5. E-wallet / bank / card recurring payment
6. Telco bundle
7. Invoice/manual renewal
8. I'm not sure

#### Nine-enum/eight-choice reconciliation

The requested popup combines e-wallet and card/bank, while the database contract has separate `E_WALLET` and `CARD_OR_BANK` values. Selecting the combined row opens a short second step:

- **E-wallet** -> save `E_WALLET`.
- **Bank or card** -> save `CARD_OR_BANK`.

This preserves the exact enum, keeps the initial popup concise, and avoids storing incorrect source data.

### Persistence behavior

- Choosing a known source from an `UNKNOWN` record persists it before showing guidance.
- Disable repeat selection while the PATCH is pending.
- On success, update/invalidate cached subscription data, then transition within the modal to guidance.
- On failure, keep the selection modal open and show a localized retryable error; do not display guidance as though the source was saved.
- Choosing **I'm not sure** does not issue a PATCH because the stored value is already `UNKNOWN`.
- Closing either modal does not change subscription status, candidate state, billing date, or any other field.

### Accessibility

- Use the shared accessible `Dialog` primitive with title and description.
- All choices must be reachable and operable by keyboard.
- Focus moves into the modal on open and returns to the triggering button on close.
- Pending and error states are announced with text, not color alone.
- Every icon-only trigger has a source-aware accessible label such as “How to cancel Netflix.”

## 11. Cancellation guidance content

Store guidance as a typed frontend mapping keyed by every `BillingSource`. Keep rendering logic separate from localized copy so every source is exhaustively handled at compile time.

### `APPLE_APP_STORE`

- Open device Settings and select the Apple Account.
- Open Subscriptions and select the service.
- Choose Cancel Subscription and confirm.
- If it is not listed, check another Apple Account or the service's own billing settings.

### `GOOGLE_PLAY`

- Open Google Play and select the profile/account used to subscribe.
- Open Payments & subscriptions, then Subscriptions.
- Select the service, choose Cancel subscription, and confirm.
- If it is not listed, check another Google account or the service's own billing settings.

### `MERCHANT_WEBSITE`

- Sign in on the service's official website.
- Open account, plan, membership, or billing settings.
- Choose cancel/turn off auto-renewal and complete confirmation.
- Keep the confirmation email or screenshot and verify the access-end date.

### `IN_APP_DIRECT`

- Open the service app and sign in to the account that owns the subscription.
- Open account, settings, plan, or subscription management.
- Choose cancel/turn off auto-renewal and confirm.
- If no cancellation control exists, use the app's official support channel.

### `E_WALLET`

- Open the e-wallet used for payment.
- Find automatic payments, recurring payments, or linked merchants.
- Select the service and stop/revoke the recurring authorization.
- Confirm in the service account that renewal is also disabled.

### `CARD_OR_BANK`

- First cancel from the service's account or billing settings.
- Review recurring payments, auto-debits, or standing instructions in the bank/card app.
- Stop the relevant instruction if the bank supports it, or contact the issuer.
- Verify future statements; replacing or blocking a card is not presented as the normal first step.

### `TELCO_BUNDLE`

- Open the mobile operator's app, website, or subscription-management channel.
- Find active add-ons, content services, or bundles.
- Select the service and unsubscribe/disable renewal.
- Check the next mobile bill or prepaid balance for confirmation.

### `INVOICE_MANUAL`

- Check the invoice or agreement for renewal and notice terms.
- Contact the provider before the renewal deadline and request non-renewal.
- Ask for written confirmation.
- Do not imply that simply ignoring an invoice always cancels a contract.

### `UNKNOWN`

- Suggest checking the purchase receipt or renewal email.
- Check Apple and Google subscription lists.
- Review the service's account/billing settings.
- Review e-wallet, bank/card, and telco recurring-payment records.
- Contact the service's official support if the source still cannot be identified.

Every guidance view includes a neutral note: exact menu names may vary, and the user should verify confirmation with the provider. No external link is required in Phase 3.

## 12. i18n requirements

Add matching English and Bahasa Indonesia keys for:

- Billing-source field label, hint, table/card labels, and all nine values.
- **How To Cancel** button, tooltip, and accessible labels.
- Unknown-source question, all eight initial choices, and the e-wallet/card subtype step.
- Guidance modal title, step labels, close/back actions, generic verification note, loading state, and persistence error.
- Source-specific cancellation steps for every enum value.

Extend the i18n smoke test with critical billing-source and cancellation-flow keys in both languages. Avoid embedding UI logic in translated strings.

## 13. Test plan

### API/database integration

Extend the existing database-gated subscription integration test to verify:

1. Creating a subscription without `billingSource` returns and stores `UNKNOWN`.
2. Creating with an explicit enum returns and stores that value.
3. An invalid billing source returns `400`.
4. A billing-source-only PATCH succeeds for the owner.
5. The same PATCH returns `404` for another user.
6. List and detail responses include `billingSource`.
7. Existing totals, renewal, cancellation, filters, and ownership behavior remain unchanged.

### Frontend unit tests

- Extend form/schema tests, or add a focused subscription schema test, to confirm `UNKNOWN` is accepted and explicit sources survive conversion.
- Extend subscription utility tests to confirm edit-form mapping retains billing source.
- Extend i18n tests for English and Indonesian source/action labels.
- Add a pure mapping/state helper test if modal transitions are extracted from the component.

Do not add a new component-testing dependency solely for Phase 3.

### Manual browser verification

Verify at desktop and mobile widths:

1. Create while leaving billing source untouched; list and edit show `UNKNOWN` label.
2. Create/edit each source selection and confirm persistence after reload.
3. Known source opens the correct guidance immediately.
4. Unknown source opens the eight-choice question.
5. The grouped recurring-payment choice disambiguates e-wallet vs bank/card.
6. A selected source persists and subsequently skips the question modal.
7. **I'm not sure** shows the fallback checklist and keeps `UNKNOWN`.
8. PATCH error keeps the modal usable and does not falsely advance.
9. Keyboard navigation, focus return, Escape/close behavior, and screen-reader labels work.
10. The widened desktop table scrolls without overlapping actions, and mobile cards remain readable.
11. English and Bahasa Indonesia copy both render without clipping.

### Repository verification

Run, in order:

```bash
pnpm db:generate
pnpm --filter @repo/api test
RUN_DATABASE_INTEGRATION_TESTS=1 pnpm --filter @repo/api test
pnpm --filter @repo/platform test
pnpm typecheck
pnpm check
pnpm build
```

If the database integration environment is unavailable, report that separately; unit tests, typechecks, checks, and builds must still run.

## 14. Expected file impact

### Database/API

- `apps/api/prisma/schema.prisma`
- `apps/api/prisma/migrations/<timestamp>_add_billing_source_phase3/migration.sql`
- `apps/api/src/modules/subscriptions/schema.ts`
- `apps/api/src/modules/subscriptions/types.ts`
- `apps/api/src/modules/subscriptions/services.ts`
- `apps/api/src/app.integration.test.ts`
- Generated Prisma Client artifacts through the existing generation command

### Platform

- `apps/platform/src/modules/subscriptions/types.ts`
- `apps/platform/src/modules/subscriptions/schema.ts` if frontend validation/default handling needs an explicit check
- `apps/platform/src/modules/subscriptions/services.ts`
- `apps/platform/src/modules/subscriptions/hooks/use-subscriptions.ts`
- `apps/platform/src/modules/subscriptions/utils.ts`
- `apps/platform/src/modules/subscriptions/utils.test.ts`
- `apps/platform/src/components/subscriptions/subscription-form.tsx`
- A focused cancellation dialog/component under `apps/platform/src/components/subscriptions/`
- A typed cancellation-guidance mapping/helper under `apps/platform/src/modules/subscriptions/`
- `apps/platform/src/routes/subscriptions/index.tsx`
- `apps/platform/src/routes/subscriptions/new.tsx` for the empty-form default if it is currently colocated there
- `apps/platform/src/i18n.ts`
- `apps/platform/src/i18n.test.ts`

No dashboard calculations, worker code, admin app, API client package contract, or route tree should require a feature-level change.

## 15. Implementation sequence

1. Add the Prisma enum/field, generate and inspect the migration, apply it, and regenerate Prisma Client.
2. Extend API validation, response types, serialization, partial-update mapping, and database integration coverage.
3. Extend frontend domain types, defaults, conversion helpers, API service, mutation hook, and focused tests.
4. Add bilingual billing-source labels and source-specific cancellation copy, then extend i18n tests.
5. Add the optional billing-source form control and list/card display.
6. Implement the typed cancellation guidance mapping and accessible modal state flow.
7. Wire the **How To Cancel** action into responsive subscription actions.
8. Run automated checks and fix regressions.
9. Perform browser verification in both languages and responsive layouts.
10. Review the final diff to ensure only Phase 3 and necessary generated migration/client changes are included.

## 16. Acceptance criteria

Phase 3 is complete only when:

- The database has a non-null `billingSource` enum field defaulting to `UNKNOWN`.
- Existing records are readable as `UNKNOWN` after migration.
- The API safely defaults omitted creates and rejects invalid enum values.
- Create, detail, list, and update responses include billing source.
- The user can leave the form untouched without validation failure.
- Create/edit forms and desktop/mobile lists show localized billing-source labels.
- Every subscription exposes **How To Cancel** with an accessible label.
- Known sources open the correct guidance directly.
- Unknown sources show the requested eight initial choices.
- The grouped recurring-payment choice resolves to the correct one of `E_WALLET` or `CARD_OR_BANK`.
- A source chosen from the popup is saved before guidance is shown.
- **I'm not sure** retains `UNKNOWN` and shows a useful fallback checklist.
- Cancellation guidance never changes subscription status or claims cancellation succeeded.
- Ownership protections remain intact.
- English and Bahasa Indonesia flows work on desktop and mobile.
- Relevant tests, typechecks, repository checks, builds, and manual browser verification pass, with any unavailable database test explicitly disclosed.
